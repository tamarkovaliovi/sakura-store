<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/orderStore"; // EKLEDİK
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";

const router = useRouter();
const orderStore = useOrderStore(); // EKLEDİK
const loading = ref(true);
const updating = ref(false);
const showModal = ref(false);
const user = ref({ name: "", email: "", avatar: "", role: "", id: null });

const API_BASE_URL = "https://api.escuelajs.co";

const editForm = ref({
  name: "",
  avatar: "",
});

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

      localStorage.setItem("user_name", data.name);
      localStorage.setItem("user_avatar", data.avatar);
    } else {
      handleLogout();
    }
  } catch (error) {
    console.error("Profil yükleme hatası:", error);
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
      localStorage.setItem("user_name", updatedData.name);
      localStorage.setItem("user_avatar", updatedData.avatar);
      showModal.value = false;
      alert("✅ Profil başarıyla güncellendi!");
    }
  } catch (error) {
    console.error("Güncelleme hatası:", error);
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
  <div class="page-wrapper">
    <Header />

    <main class="main-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p class="loading-text">Profiliniz hazırlanıyor...</p>
      </div>

      <div v-else class="profile-container animate-fade-in">
        <div class="page-header text-center lg:text-left">
          <h1 class="page-title text-blue-900 text-2xl md:text-3xl font-bold">Hesabım</h1>
          <p class="welcome-text italic text-sm md:text-base mt-2">
            Hoş geldin,
            <span class="user-highlight text-pink-500 font-bold">{{ user.name }}</span
            >!
          </p>
        </div>

        <div class="profile-grid grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div class="sidebar-column space-y-6">
            <div
              class="sidebar-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div class="user-info p-6 md:p-8 text-center">
                <div class="avatar-wrapper mb-4 flex justify-center">
                  <img
                    :src="user.avatar"
                    :alt="user.name"
                    class="user-avatar w-24 h-24 rounded-full object-cover border-4 border-pink-50 shadow-sm"
                  />
                </div>

                <div class="name-container mb-2">
                  <h3 class="user-name text-lg md:text-xl font-bold text-gray-800">
                    {{ user.name }}
                  </h3>
                  <div
                    class="role-badge-wrapper flex items-center justify-center gap-2 mt-1"
                  >
                    <span class="role-dot w-2 h-2 rounded-full bg-green-500"></span>
                    <span class="user-role-text text-xs text-gray-500 font-medium">
                      {{ user.role === "admin" ? "Yönetici" : "Müşteri" }}
                    </span>
                  </div>
                </div>

                <p class="user-email text-sm text-gray-400 truncate px-4 mb-6">
                  {{ user.email }}
                </p>

                <button
                  @click="showModal = true"
                  class="edit-profile-btn inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 text-sm rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-all group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Profili Düzenle
                </button>
              </div>
            </div>

            <div
              class="sidebar-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <nav class="sidebar-nav flex flex-col">
                <RouterLink
                  to="/profile"
                  class="nav-link flex items-center p-4 hover:bg-pink-50 transition-colors border-l-4 border-pink-500 bg-pink-50 text-pink-600 font-bold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profil Bilgilerim
                </RouterLink>

                <RouterLink
                  to="/orders"
                  class="nav-link flex items-center p-4 text-gray-600 hover:bg-gray-50 transition-colors group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-3 group-hover:text-pink-500"
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
                  Siparişlerim
                </RouterLink>

                <RouterLink
                  to="/favorites"
                  class="nav-link flex items-center p-4 text-gray-600 hover:bg-gray-50 transition-colors group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-3 group-hover:text-pink-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Favorilerim
                </RouterLink>

                <div class="p-4 border-t border-gray-50">
                  <CustomButton mode="logout" @click="handleLogout" />
                </div>
              </nav>
            </div>
          </div>

          <div class="content-column lg:col-span-2 space-y-6">
            <div class="stats-grid grid grid-cols-2 gap-4 md:gap-6">
              <div
                class="stat-card group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center hover:border-blue-200 transition-all"
              >
                <div>
                  <p
                    class="stat-title text-gray-400 text-xs uppercase tracking-wider mb-1"
                  >
                    Siparişlerim
                  </p>
                  <h4 class="stat-value text-blue-900 text-2xl md:text-3xl font-black">
                    {{ orderStore.orders.length }}
                  </h4>
                </div>
                <div
                  class="stat-icon-bg h-12 w-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"
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
                class="stat-card group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center hover:border-orange-200 transition-all"
              >
                <div>
                  <p
                    class="stat-title text-gray-400 text-xs uppercase tracking-wider mb-1"
                  >
                    İndirim Kuponu
                  </p>
                  <h4 class="stat-value text-orange-500 text-2xl md:text-3xl font-black">
                    2
                  </h4>
                </div>
                <div
                  class="stat-icon-bg h-12 w-12 rounded-xl flex items-center justify-center bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all"
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

            <div
              v-if="orderStore.hasOrders"
              class="last-order-card bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
            >
              <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-blue-900 uppercase">Son Siparişiniz</h3>
                <RouterLink
                  to="/orders"
                  class="text-pink-500 text-sm font-bold hover:underline"
                  >Tümünü Gör</RouterLink
                >
              </div>
              <div class="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                <div>
                  <p class="text-xs text-gray-400">Sipariş No</p>
                  <p class="font-bold text-gray-800">#{{ orderStore.orders[0].id }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-400">Tutar</p>
                  <p class="font-bold text-blue-900">${{ orderStore.orders[0].total }}</p>
                </div>
                <div
                  class="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-bold uppercase"
                >
                  {{ orderStore.orders[0].status }}
                </div>
              </div>
            </div>

            <div
              v-else
              class="empty-orders-card bg-white rounded-3xl shadow-sm border border-pink-100 p-12 text-center flex flex-col items-center justify-center min-h-[350px]"
            >
              <div
                class="empty-orders-icon bg-pink-50 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-10 w-10 md:h-12 md:w-12 text-pink-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3
                class="empty-orders-title font-extrabold text-blue-900 uppercase tracking-tight text-base mb-2"
              >
                Henüz Siparişiniz Yok
              </h3>
              <p class="empty-orders-desc italic text-sm text-gray-400 mb-8">
                SakuraStore koleksiyonuna göz atmak ister misiniz?
              </p>
              <RouterLink
                to="/Allproducts"
                class="shopping-btn bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-600 transition-all"
              >
                Alışverişe Başla
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="showModal"
      class="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4 backdrop-blur-sm"
    >
      <div
        class="modal-card bg-white animate-pop-in border-t-8 border-pink-500 rounded-[2rem] w-full max-w-md p-8 md:p-10 shadow-2xl relative"
      >
        <div class="modal-header flex justify-between items-center mb-8">
          <h3 class="text-xl font-bold text-blue-900 uppercase tracking-tighter">
            Profili Düzenle
          </h3>
          <button
            @click="showModal = false"
            class="close-modal-btn text-gray-400 hover:text-red-500 text-2xl transition-colors"
          >
            ✕
          </button>
        </div>
        <div class="modal-body space-y-6">
          <div class="input-field">
            <label
              class="modal-label block text-xs font-bold text-gray-400 uppercase mb-2"
              >İsim Soyisim</label
            >
            <input
              v-model="editForm.name"
              type="text"
              class="modal-input w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            />
          </div>
          <div class="input-field">
            <label
              class="modal-label block text-xs font-bold text-gray-400 uppercase mb-2"
              >Profil Fotoğraf URL</label
            >
            <input
              v-model="editForm.avatar"
              type="text"
              class="modal-input w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            />
          </div>
        </div>
        <div class="modal-footer flex space-x-3 mt-10">
          <button
            @click="showModal = false"
            class="cancel-btn flex-1 py-4 border border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all"
          >
            İptal
          </button>
          <button
            @click="handleUpdateUser"
            :disabled="updating"
            class="save-btn flex-1 py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 shadow-lg shadow-pink-100 disabled:opacity-50 transition-all"
          >
            {{ updating ? "Güncelleniyor..." : "Kaydet" }}
          </button>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
<style scoped>
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
