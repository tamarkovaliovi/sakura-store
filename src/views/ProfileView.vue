<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";

const router = useRouter();
const loading = ref(true);
const updating = ref(false);
const showModal = ref(false);
const user = ref({ name: "", email: "", avatar: "", role: "", id: null });

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
    const response = await fetch("/api/v1/auth/profile", {
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
    const response = await fetch(`/api/v1/users/${user.value.id}`, {
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
        <div class="page-header">
          <h1 class="page-title text-blue-900">Hesabım</h1>
          <p class="welcome-text italic">
            Hoş geldin, <span class="user-highlight text-pink-500">{{ user.name }}</span
            >!
          </p>
        </div>

        <div class="profile-grid">
          <div class="sidebar-column">
            <div class="sidebar-card shadow-sm border border-gray-100">
              <div class="user-info">
                <div class="avatar-wrapper">
                  <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                </div>

                <div class="name-container">
                  <h3 class="user-name">{{ user.name }}</h3>
                  <div class="role-badge-wrapper">
                    <span class="role-dot"></span>
                    <span class="user-role-text">
                      {{ user.role === "admin" ? "Yönetici" : "Müşteri" }}
                    </span>
                  </div>
                </div>

                <p class="user-email">{{ user.email }}</p>

                <button @click="showModal = true" class="edit-profile-btn mt-6 group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2 group-hover:text-pink-500 transition-colors"
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

            <div class="sidebar-card shadow-sm border border-gray-100">
              <nav class="sidebar-nav">
                <a href="#" class="nav-link active-link">
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
                </a>
                <a href="#" class="nav-link group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-900 transition"
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
                </a>
                <a href="#" class="nav-link group">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-3 text-gray-400 group-hover:text-pink-500 transition"
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
                </a>
                <div class="p-4 border-t border-gray-50">
                  <CustomButton mode="logout" @click="handleLogout" />
                </div>
              </nav>
            </div>
          </div>

          <div class="content-column">
            <div class="stats-grid">
              <div class="stat-card group shadow-sm border border-gray-100">
                <div>
                  <p class="stat-title">Siparişlerim</p>
                  <h4 class="stat-value text-blue-900">0</h4>
                </div>
                <div
                  class="stat-icon-bg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"
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
              <div class="stat-card group shadow-sm border border-gray-100">
                <div>
                  <p class="stat-title">İndirim Kuponu</p>
                  <h4 class="stat-value text-orange-500">2</h4>
                </div>
                <div
                  class="stat-icon-bg bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all"
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

            <div class="empty-orders-card shadow-sm border border-pink-100 bg-white">
              <div class="empty-orders-icon bg-pink-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 text-pink-200"
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
                class="empty-orders-title font-extrabold text-blue-900 uppercase tracking-tight"
              >
                Henüz Siparişiniz Yok
              </h3>
              <p class="empty-orders-desc italic text-sm mb-6 text-gray-400">
                SakuraStore koleksiyonuna göz atmak ister misiniz?
              </p>
              <RouterLink
                to="/"
                class="shopping-btn shadow-md hover:shadow-pink-200 transition-all"
                >Alışverişe Başla</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card animate-pop-in border-t-4 border-pink-500">
        <div class="modal-header">
          <h3 class="text-xl font-bold text-blue-900">Profili Düzenle</h3>
          <button @click="showModal = false" class="close-modal-btn">✕</button>
        </div>
        <div class="modal-body space-y-5">
          <div class="input-field">
            <label class="modal-label">İsim Soyisim</label>
            <input v-model="editForm.name" type="text" class="modal-input" />
          </div>
          <div class="input-field">
            <label class="modal-label">Profil Fotoğraf URL</label>
            <input v-model="editForm.avatar" type="text" class="modal-input" />
          </div>
        </div>
        <div class="modal-footer flex space-x-3 mt-8">
          <button @click="showModal = false" class="cancel-btn">İptal</button>
          <button
            @click="handleUpdateUser"
            :disabled="updating"
            class="save-btn bg-pink-500 hover:bg-pink-600"
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
}
.main-content {
  @apply flex-grow py-8 px-4 lg:px-8;
}
.profile-container {
  @apply max-w-6xl mx-auto;
}
.page-header {
  @apply mb-8;
}
.page-title {
  @apply text-3xl font-black;
}
.user-highlight {
  @apply font-bold text-xl;
}
.profile-grid {
  @apply grid grid-cols-1 lg:grid-cols-4 gap-8;
}
.sidebar-column {
  @apply lg:col-span-1 space-y-6;
}
.sidebar-card {
  @apply bg-white rounded-3xl overflow-hidden;
}

.user-info {
  @apply p-8 text-center flex flex-col items-center;
}
.user-avatar {
  @apply w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg transition-transform hover:scale-105;
}

.name-container {
  @apply flex flex-col items-center gap-2 mt-4;
}
.user-name {
  @apply text-xl font-black text-gray-900;
}

.role-badge-wrapper {
  @apply flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full;
}
.role-dot {
  @apply w-2 h-2 bg-green-400 rounded-full animate-pulse;
}
.user-role-text {
  @apply text-[11px] font-bold text-gray-400 uppercase tracking-widest;
}

.user-email {
  @apply text-xs text-gray-400 font-medium;
}
.edit-profile-btn {
  @apply flex items-center justify-center w-full py-2.5 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-all border border-transparent;
}

.sidebar-nav {
  @apply flex flex-col;
}
.nav-link {
  @apply px-6 py-4 text-gray-500 hover:bg-gray-50 hover:text-blue-900 font-bold border-b border-gray-50 transition flex items-center text-sm;
}
.active-link {
  @apply bg-blue-50/50 text-blue-900 border-l-4 border-blue-900;
}

.content-column {
  @apply lg:col-span-3 space-y-6;
}
.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}
.stat-card {
  @apply bg-white p-6 rounded-3xl flex items-center justify-between hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-blue-100;
}
.stat-title {
  @apply text-gray-400 text-[10px] font-black uppercase tracking-widest;
}
.stat-value {
  @apply text-3xl font-black mt-1;
}
.stat-icon-bg {
  @apply h-12 w-12 rounded-2xl flex items-center justify-center transition-colors;
}

.empty-orders-card {
  @apply bg-white rounded-[2.5rem] p-12 text-center flex flex-col items-center min-h-[350px] justify-center;
}
.empty-orders-icon {
  @apply w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner;
}
.shopping-btn {
  @apply bg-blue-900 text-white px-10 py-3 rounded-full hover:bg-pink-500 transition-all font-black uppercase text-xs tracking-widest;
}

.modal-overlay {
  @apply fixed inset-0 bg-blue-900/20 backdrop-blur-md flex items-center justify-center z-50 px-4;
}
.modal-card {
  @apply bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-10;
}
.modal-header {
  @apply flex justify-between items-center mb-8 pb-4 border-b border-gray-100;
}
.close-modal-btn {
  @apply text-gray-300 hover:text-pink-500 transition-colors text-2xl;
}
.modal-label {
  @apply block text-[10px] font-black text-gray-300 uppercase mb-2 ml-1 tracking-[0.2em];
}
.modal-input {
  @apply w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:bg-white focus:outline-none transition-all text-sm font-bold text-gray-600;
}
.save-btn {
  @apply flex-grow text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50;
}
.cancel-btn {
  @apply flex-grow bg-gray-50 text-gray-400 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all;
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
</style>
