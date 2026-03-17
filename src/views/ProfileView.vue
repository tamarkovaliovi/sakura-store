<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore";
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";

const router = useRouter();
const orderStore = useOrderStore();

const loading = ref(true);
const updating = ref(false);
const showModal = ref(false);
const activeTab = ref("lastOrder");

const user = ref({ id: null, name: "", email: "", avatar: "", role: "" });
const editForm = ref({ name: "", avatar: "" });

const toast = ref({ show: false, message: "", type: "success" });

const showToast = (msg, type = "success") => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const API_BASE_URL = "https://api.escuelajs.co";

const coupons = ref([
  { code: "SAKURA20", discount: "%20 İndirim", desc: "Tüm koleksiyonda geçerli" },
  { code: "SPRING15", discount: "%15 İndirim", desc: "Bahar ürünlerinde geçerli" },
]);

const copyCoupon = (code) => {
  navigator.clipboard.writeText(code);
  showToast(`✅ ${code} kopyalandı!`, "success");
};

const fetchUserProfile = async () => {
  const token = localStorage.getItem("user_token");
  if (!token) {
    router.push("/login");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      user.value = data;
      editForm.value = { name: data.name, avatar: data.avatar };
    } else {
      handleLogout();
    }
  } catch (error) {
    console.error("Profil Hatası:", error);
    showToast("Bağlantı hatası oluştu!", "error");
  } finally {
    loading.value = false;
  }
};

const handleUpdateUser = async () => {
  if (!user.value.id) {
    showToast("Kullanıcı ID bulunamadı!", "error");
    return;
  }

  updating.value = true;
  const token = localStorage.getItem("user_token");

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/${user.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editForm.value.name,
        avatar: editForm.value.avatar,
      }),
    });

    if (response.ok) {
      const updatedData = await response.json();
      user.value = updatedData;
      showModal.value = false;
      showToast("Profil başarıyla güncellendi!", "success");
    } else {
      showToast("Güncelleme başarısız.", "error");
    }
  } catch (error) {
    showToast("Bir hata oluştu.", "error");
  } finally {
    updating.value = false;
  }
};

const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <div class="page-wrapper min-h-screen bg-[#FDFCFD] flex flex-col font-sans">
    <Header />

    <Transition name="slide-fade">
      <div
        v-if="toast.show"
        :class="[
          'fixed top-5 right-5 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 text-white font-bold',
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500',
        ]"
      >
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

    <main class="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
      <div v-if="loading" class="flex flex-col items-center justify-center py-40">
        <div
          class="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"
        ></div>
      </div>

      <div v-else class="animate-in fade-in duration-700">
        <div class="mb-10">
          <h1
            class="text-3xl font-black text-indigo-950 uppercase tracking-tighter italic"
          >
            HESABIM
          </h1>
          <p class="text-gray-400 text-sm">
            Hoş geldin,
            <span class="text-pink-500 font-black uppercase">{{ user.name }}</span>
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-3 space-y-4">
            <div
              class="bg-white rounded-[2rem] border border-gray-100 p-8 text-center shadow-sm"
            >
              <div class="relative inline-block group">
                <img
                  :src="user.avatar"
                  class="w-24 h-24 rounded-full border-4 border-pink-50 shadow-inner object-cover mb-4 mx-auto"
                />
              </div>
              <h3 class="font-black text-indigo-950 text-base uppercase">
                {{ user.name }}
              </h3>
              <p class="text-[10px] text-gray-400 font-medium mb-6">{{ user.email }}</p>
              <button
                @click="showModal = true"
                class="w-full py-3 bg-indigo-950 text-white text-[10px] font-black rounded-2xl hover:bg-pink-500 transition-all uppercase tracking-widest"
              >
                Profili Düzenle
              </button>
            </div>

            <nav
              class="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm"
            >
              <button
                @click="router.push('/profile')"
                class="w-full flex items-center p-5 text-pink-600 bg-pink-50/50 font-black text-xs uppercase border-l-4 border-pink-500"
              >
                <i class="fas fa-user-circle mr-3"></i> Profilim
              </button>
              <button
                @click="router.push('/orders')"
                class="w-full flex items-center p-5 text-gray-400 hover:text-indigo-950 font-black text-xs uppercase border-l-4 border-transparent transition-all"
              >
                <i class="fas fa-shopping-bag mr-3"></i> Siparişlerim
              </button>
              <button
                @click="router.push('/favorites')"
                class="w-full flex items-center p-5 text-gray-400 hover:text-indigo-950 font-black text-xs uppercase border-l-4 border-transparent transition-all"
              >
                <i class="fas fa-heart mr-3"></i> Favorilerim
              </button>
              <div class="p-4 bg-gray-50/50">
                <CustomButton
                  mode="logout"
                  @click="handleLogout"
                  class="w-full !rounded-xl !text-[9px]"
                />
              </div>
            </nav>
          </div>

          <div class="lg:col-span-9 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                @click="activeTab = 'lastOrder'"
                :class="[
                  'cursor-pointer p-8 rounded-[2rem] border-2 transition-all flex justify-between items-center',
                  activeTab === 'lastOrder'
                    ? 'border-indigo-500 bg-white shadow-lg shadow-indigo-100'
                    : 'border-gray-100 bg-white shadow-sm',
                ]"
              >
                <div>
                  <p
                    class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2"
                  >
                    Toplam Sipariş
                  </p>
                  <span class="text-4xl font-black text-indigo-950">{{
                    orderStore.orders?.length || 0
                  }}</span>
                </div>
                <div
                  class="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 text-xl"
                >
                  <i class="fas fa-box"></i>
                </div>
              </div>

              <div
                @click="activeTab = 'coupons'"
                :class="[
                  'cursor-pointer p-8 rounded-[2rem] border-2 transition-all flex justify-between items-center',
                  activeTab === 'coupons'
                    ? 'border-orange-500 bg-white shadow-lg shadow-orange-100'
                    : 'border-gray-100 bg-white shadow-sm',
                ]"
              >
                <div>
                  <p
                    class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2"
                  >
                    Özel Kuponlar
                  </p>
                  <span class="text-4xl font-black text-orange-500">{{
                    coupons.length
                  }}</span>
                </div>
                <div
                  class="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 text-xl"
                >
                  <i class="fas fa-ticket-alt"></i>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 min-h-[400px]"
            >
              <div v-if="activeTab === 'lastOrder'">
                <div v-if="orderStore.orders?.length > 0" class="space-y-6">
                  <h3 class="text-indigo-950 font-black text-sm uppercase italic">
                    Son Etkinlik
                  </h3>
                  <div
                    class="bg-gray-50 rounded-3xl p-8 flex items-center justify-between border border-gray-100"
                  >
                    <div class="flex items-center space-x-6">
                      <div
                        class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-indigo-900"
                      >
                        #{{ orderStore.orders[0].id }}
                      </div>
                      <div>
                        <p class="text-[10px] font-bold text-gray-400 uppercase">Durum</p>
                        <p class="text-xs font-black text-emerald-500 uppercase">
                          {{ orderStore.orders[0].status }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-[10px] font-bold text-gray-400 uppercase">Toplam</p>
                      <p class="text-xl font-black text-indigo-950">
                        ${{ orderStore.orders[0].total }}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="flex flex-col items-center justify-center py-20 text-gray-300"
                >
                  <i class="fas fa-folder-open text-5xl mb-4"></i>
                  <p class="italic text-sm">Görüntülenecek sipariş bulunamadı.</p>
                </div>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="c in coupons"
                  :key="c.code"
                  class="p-6 border-2 border-dashed border-orange-100 rounded-3xl bg-orange-50/20 group hover:border-orange-300 transition-all"
                >
                  <div class="flex justify-between items-start mb-4">
                    <span
                      class="px-3 py-1 bg-white rounded-lg text-[10px] font-black text-orange-600 shadow-sm"
                      >{{ c.code }}</span
                    >
                    <i
                      class="fas fa-gift text-orange-200 group-hover:text-orange-400"
                    ></i>
                  </div>
                  <h4 class="text-indigo-950 font-black text-lg mb-1">
                    {{ c.discount }}
                  </h4>
                  <p class="text-gray-400 text-[10px] mb-4">{{ c.desc }}</p>
                  <button
                    @click="copyCoupon(c.code)"
                    class="w-full py-2 bg-orange-500 text-white text-[9px] font-black rounded-xl uppercase shadow-md shadow-orange-100"
                  >
                    Kopyala
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-indigo-950/40 backdrop-blur-md"
      >
        <div
          class="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300"
        >
          <div class="flex justify-between items-center mb-8">
            <h3
              class="text-xl font-black text-indigo-950 uppercase italic tracking-tighter"
            >
              Profilini Yenile
            </h3>
            <button
              @click="showModal = false"
              class="text-gray-300 hover:text-pink-500 transition-colors"
            >
              <i class="fas fa-times-circle text-2xl"></i>
            </button>
          </div>
          <div class="space-y-6">
            <div class="space-y-2">
              <label
                class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2"
                >Görünür İsim</label
              >
              <input
                v-model="editForm.name"
                type="text"
                class="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-pink-200 rounded-2xl outline-none transition-all font-bold text-indigo-950"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2"
                >Avatar Görseli (URL)</label
              >
              <input
                v-model="editForm.avatar"
                type="text"
                class="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-pink-200 rounded-2xl outline-none transition-all font-bold text-indigo-950 text-xs"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-10">
            <button
              @click="showModal = false"
              class="py-4 text-gray-400 font-black text-[10px] uppercase hover:text-gray-600"
            >
              Vazgeç
            </button>
            <button
              @click="handleUpdateUser"
              :disabled="updating"
              class="py-4 bg-pink-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-pink-100 hover:bg-pink-600 disabled:opacity-50"
            >
              {{ updating ? "Yükleniyor..." : "Güncellemeleri Kaydet" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <AppFooter />
  </div>
</template>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-pop-in {
  animation: popIn 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67);
}
@keyframes popIn {
  from {
    opacity: 0;
    scale: 0.98;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

.font-sans {
  font-family: "Inter", sans-serif;
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-pop-in {
  animation: popIn 0.3s cubic-bezier(0.26, 0.53, 0.74, 1.48);
}
@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.page-wrapper {
  @apply min-h-screen flex flex-col bg-gray-50;
  max-width: 100vw;
  overflow-x: hidden;
}
.main-content {
  @apply flex-grow py-6 md:py-8 px-4 lg:px-8;
}
.profile-container {
  @apply max-w-6xl mx-auto;
}
.page-header {
  @apply mb-6 md:mb-8;
}
.page-title {
  @apply font-black;
}
.user-highlight {
  @apply font-bold;
}
.profile-grid {
  @apply grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8;
}
.sidebar-column {
  @apply lg:col-span-1 space-y-4 md:space-y-6;
}
.sidebar-card {
  @apply bg-white rounded-3xl overflow-hidden;
}

.user-info {
  @apply text-center flex flex-col items-center;
}
.user-avatar {
  @apply w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white object-cover shadow-lg transition-transform hover:scale-105;
}

.name-container {
  @apply flex flex-col items-center gap-2 mt-4;
}
.user-name {
  @apply font-black text-gray-900;
}

.role-badge-wrapper {
  @apply flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full;
}
.role-dot {
  @apply w-2 h-2 bg-green-400 rounded-full animate-pulse;
}
.user-role-text {
  @apply text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest;
}

.user-email {
  @apply text-[10px] md:text-xs text-gray-400 font-medium px-4;
}
.edit-profile-btn {
  @apply flex items-center justify-center w-full py-2.5 bg-gray-50 rounded-2xl text-[10px] md:text-xs font-bold text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-all border border-transparent;
}

.sidebar-nav {
  @apply flex flex-col;
}
.nav-link {
  @apply px-6 py-4 text-gray-500 hover:bg-gray-50 hover:text-blue-900 font-bold border-b border-gray-50 transition flex items-center text-xs md:text-sm;
}
.active-link {
  @apply bg-blue-50/50 text-blue-900 border-l-4 border-blue-900;
}

.content-column {
  @apply lg:col-span-3 space-y-6;
}

.stat-card {
  @apply bg-white rounded-3xl flex items-center justify-between hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-blue-100;
}
.stat-title {
  @apply text-gray-400 font-black uppercase tracking-widest;
}
.stat-value {
  @apply font-black mt-1;
}
.stat-icon-bg {
  @apply rounded-2xl flex items-center justify-center transition-colors flex-shrink-0;
}

.empty-orders-card {
  @apply bg-white rounded-[2.5rem] text-center flex flex-col items-center justify-center;
}
.empty-orders-icon {
  @apply rounded-full flex items-center justify-center mb-6 shadow-inner;
}
.shopping-btn {
  @apply bg-blue-900 text-white px-8 md:px-10 py-3 rounded-full hover:bg-pink-500 transition-all font-black uppercase tracking-widest;
}

.modal-overlay {
  @apply fixed inset-0 bg-blue-900/20 backdrop-blur-md flex items-center justify-center z-50;
}
.modal-card {
  @apply bg-white rounded-[2rem] w-full shadow-2xl;
}
.modal-header {
  @apply flex justify-between items-center mb-6 md:mb-8 pb-4 border-b border-gray-100;
}
.close-modal-btn {
  @apply text-gray-300 hover:text-pink-500 transition-colors text-2xl;
}
.modal-label {
  @apply block text-[9px] md:text-[10px] font-black text-gray-300 uppercase mb-2 ml-1 tracking-[0.2em];
}
.modal-input {
  @apply w-full p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white focus:outline-none transition-all text-xs md:text-sm font-bold text-gray-600;
}
.save-btn {
  @apply flex-grow text-white py-3 md:py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50;
}
.cancel-btn {
  @apply flex-grow bg-gray-50 text-gray-400 py-3 md:py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all;
}

.animate-pop-in {
  animation: popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.spinner {
  @apply animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto mb-4;
}
</style>
