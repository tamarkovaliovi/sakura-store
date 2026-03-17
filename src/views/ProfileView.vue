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
const user = ref({ name: "", email: "", avatar: "", role: "", id: null });

const activeTab = ref("lastOrder");

const coupons = ref([
  {
    code: "SAKURA20",
    discount: "%20 İndirim",
    desc: "Tüm koleksiyonda geçerli",
    expiry: "30.04.2026",
  },
  {
    code: "MERHABA10",
    discount: "10$ İndirim",
    desc: "50$ ve üzeri siparişlerde",
    expiry: "15.05.2026",
  },
  {
    code: "SPRING15",
    discount: "%15 İndirim",
    desc: "Bahar ürünlerinde geçerli",
    expiry: "10.06.2026",
  },
]);

const copyCoupon = (code) => {
  navigator.clipboard.writeText(code);
  alert(`✅ Kupon kodu kopyalandı: ${code}`);
};

const API_BASE_URL = "https://api.escuelajs.co";
const editForm = ref({ name: "", avatar: "" });

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
      editForm.value.name = data.name;
      editForm.value.avatar = data.avatar;
    } else {
      handleLogout();
    }
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    loading.value = false;
  }
};

const handleUpdateUser = async () => {
  updating.value = true;
  const token = localStorage.getItem("user_token");
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/${user.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: editForm.value.name, avatar: editForm.value.avatar }),
    });
    if (response.ok) {
      const updatedData = await response.json();
      user.value = updatedData;
      showModal.value = false;
      alert("✅ Profil güncellendi!");
    }
  } catch (error) {
    console.error("Hata:", error);
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
  <div class="page-wrapper min-h-screen bg-gray-50 flex flex-col font-sans">
    <Header />

    <main class="flex-grow w-full max-w-7xl mx-auto px-6 py-10">
      <div v-if="loading" class="text-center py-20 text-gray-400 italic font-medium">
        Yükleniyor...
      </div>

      <div v-else class="animate-fade-in">
        <div class="mb-8 px-2">
          <h1
            class="text-2xl md:text-3xl font-black text-indigo-900 uppercase tracking-tight"
          >
            Hesabım
          </h1>
          <p class="text-gray-400 text-sm italic">
            Hoş geldin,
            <span class="text-pink-500 font-bold uppercase">{{ user.name }}</span
            >!
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-3 space-y-6">
            <div
              class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center"
            >
              <img
                :src="user.avatar"
                class="w-20 h-20 rounded-full border-4 border-pink-50 shadow-sm mx-auto mb-4 object-cover"
              />
              <h3 class="font-bold text-gray-800 uppercase text-sm tracking-tight">
                {{ user.name }}
              </h3>
              <p class="text-[11px] text-gray-400 truncate mb-6">{{ user.email }}</p>
              <button
                @click="showModal = true"
                class="w-full py-2 bg-gray-50 text-gray-600 text-[10px] font-black rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-all uppercase tracking-widest border border-transparent"
              >
                Profili Düzenle
              </button>
            </div>

            <nav
              class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-sm"
            >
              <RouterLink
                to="/profile"
                class="flex items-center p-4 border-l-4 border-pink-500 bg-pink-50 text-pink-600 font-bold"
                >Profil Bilgilerim</RouterLink
              >
              <RouterLink
                to="/orders"
                class="flex items-center p-4 text-gray-500 hover:bg-gray-50 font-bold transition-all border-l-4 border-transparent"
                >Siparişlerim</RouterLink
              >
              <RouterLink
                to="/favorites"
                class="flex items-center p-4 text-gray-500 hover:bg-gray-50 font-bold transition-all border-l-4 border-transparent"
                >Favorilerim</RouterLink
              >
              <div class="p-3 border-t border-gray-50">
                <CustomButton
                  mode="logout"
                  @click="handleLogout"
                  class="w-full text-[10px]"
                />
              </div>
            </nav>
          </div>

          <div class="lg:col-span-9 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                @click="activeTab = 'lastOrder'"
                class="cursor-pointer bg-white rounded-3xl shadow-sm border p-6 flex justify-between items-center transition-all hover:border-indigo-200"
                :class="
                  activeTab === 'lastOrder'
                    ? 'border-indigo-300 ring-2 ring-indigo-50'
                    : 'border-gray-100'
                "
              >
                <div>
                  <p
                    class="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1"
                  >
                    Siparişlerim
                  </p>
                  <h4 class="text-indigo-900 text-2xl font-black">
                    {{ orderStore.orders.length }}
                  </h4>
                </div>
                <div
                  class="h-12 w-12 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>

              <div
                @click="activeTab = 'coupons'"
                class="cursor-pointer bg-white rounded-3xl shadow-sm border p-6 flex justify-between items-center transition-all hover:border-orange-200"
                :class="
                  activeTab === 'coupons'
                    ? 'border-orange-300 ring-2 ring-orange-50'
                    : 'border-gray-100'
                "
              >
                <div>
                  <p
                    class="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1"
                  >
                    İndirim Kuponu
                  </p>
                  <h4 class="text-orange-500 text-2xl font-black">
                    {{ coupons.length }}
                  </h4>
                </div>
                <div
                  class="h-12 w-12 rounded-2xl flex items-center justify-center bg-orange-50 text-orange-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 5v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div class="transition-all duration-300">
              <div v-if="activeTab === 'lastOrder'">
                <div
                  v-if="orderStore.hasOrders"
                  class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 animate-fade-in"
                >
                  <div
                    class="flex justify-between items-center mb-6 border-b border-gray-50 pb-4"
                  >
                    <h3 class="font-black text-indigo-900 uppercase text-xs">
                      Son Siparişiniz
                    </h3>
                    <RouterLink
                      to="/orders"
                      class="text-pink-500 text-[10px] font-black hover:underline uppercase tracking-widest"
                      >Tümünü Gör</RouterLink
                    >
                  </div>
                  <div
                    class="flex items-center justify-between bg-gray-50 p-6 rounded-2xl"
                  >
                    <div>
                      <p class="text-[9px] text-gray-400 font-bold uppercase mb-1">No</p>
                      <p class="font-bold text-gray-800 text-sm">
                        #{{ orderStore.orders[0].id }}
                      </p>
                    </div>
                    <div>
                      <p class="text-[9px] text-gray-400 font-bold uppercase mb-1">
                        Tutar
                      </p>
                      <p class="font-black text-indigo-900 text-lg">
                        ${{ orderStore.orders[0].total }}
                      </p>
                    </div>
                    <div
                      class="px-4 py-1.5 bg-white text-orange-600 rounded-lg text-[9px] font-black uppercase border border-orange-100"
                    >
                      {{ orderStore.orders[0].status }}
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="bg-white rounded-3xl p-10 text-center border border-gray-100 text-gray-400 italic text-sm"
                >
                  Henüz siparişiniz yok.
                </div>
              </div>

              <div
                v-else-if="activeTab === 'coupons'"
                class="bg-white rounded-3xl shadow-sm border border-orange-100 p-8 animate-fade-in"
              >
                <h3
                  class="font-black text-orange-600 uppercase text-xs mb-6 border-b border-gray-50 pb-4"
                >
                  Kuponlarım
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="coupon in coupons"
                    :key="coupon.code"
                    class="bg-orange-50/40 border border-dashed border-orange-200 p-5 rounded-2xl flex flex-col justify-between group hover:bg-orange-50 transition-all"
                  >
                    <div>
                      <p
                        class="text-orange-600 font-black text-sm tracking-widest uppercase mb-1"
                      >
                        {{ coupon.code }}
                      </p>
                      <p class="text-indigo-900 font-bold text-xs">
                        {{ coupon.discount }}
                      </p>
                      <p class="text-gray-400 text-[10px] italic mt-1">
                        {{ coupon.desc }}
                      </p>
                    </div>
                    <button
                      @click="copyCoupon(coupon.code)"
                      class="mt-4 w-full bg-white text-orange-500 py-2 rounded-xl text-[9px] font-black uppercase border border-orange-100 hover:bg-orange-500 hover:text-white transition-all"
                    >
                      Kodu Kopyala
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="showModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
    >
      <div class="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-pop-in">
        <h3 class="text-lg font-black text-indigo-900 uppercase mb-6 tracking-tight">
          Profili Düzenle
        </h3>
        <div class="space-y-4 text-sm">
          <input
            v-model="editForm.name"
            type="text"
            placeholder="İsim Soyisim"
            class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-pink-200"
          />
          <input
            v-model="editForm.avatar"
            type="text"
            placeholder="Fotoğraf URL"
            class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>
        <div class="flex gap-3 mt-8">
          <button
            @click="showModal = false"
            class="flex-1 py-3 text-gray-400 font-bold text-xs uppercase"
          >
            İptal
          </button>
          <button
            @click="handleUpdateUser"
            :disabled="updating"
            class="flex-1 py-3 bg-pink-500 text-white rounded-xl font-black text-xs uppercase shadow-md hover:bg-pink-600"
          >
            Güncelle
          </button>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
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
