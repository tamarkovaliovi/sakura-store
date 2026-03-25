<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import CustomButton from "@/components/CustomButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

const API_BASE_URL = "https://api.escuelajs.co";

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = "";

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      errorMsg.value = data.message || "Giriş bilgileri hatalı!";
      return;
    }

    if (data.access_token) {
      localStorage.setItem("user_token", data.access_token);

      await authStore.fetchUser();

      if (authStore.user) {
        router.push("/");
      }
    }
  } catch (error) {
    console.error("Hata:", error);
    errorMsg.value = "Sunucu hatası!";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2 class="brand-title"></h2>
        <p class="brand-subtitle">Hesabınıza giriş yapın</p>
      </div>

      <div v-if="errorMsg" class="error-banner">
        <span class="error-icon">⚠️</span>
        <p class="error-text">{{ errorMsg }}</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="input-group">
          <input
            v-model="email"
            type="email"
            required
            class="form-input"
            placeholder="Email adresi"
          />
          <input
            v-model="password"
            type="password"
            required
            class="form-input"
            placeholder="Şifre"
          />
        </div>

        <div class="action-area">
          <CustomButton mode="submit" :loading="loading" class="submit-button">
            {{ loading ? "Giriş Yapılıyor..." : "Giriş Yap" }}
          </CustomButton>
        </div>

        <div class="guest-action">
          <button type="button" @click="router.push('/')" class="guest-button">
            Üye Olmadan Devam Et
          </button>
        </div>
      </form>

      <div class="footer-link">
        <p>
          Hesabınız yok mu?
          <RouterLink to="/register" class="link-text">Hemen Kayıt Olun</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  @apply min-h-screen flex items-center justify-center bg-pink-50 py-12 px-4 sm:px-6 lg:px-8;
}

.login-card {
  @apply max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-pink-100;
}

.brand-title {
  @apply text-3xl font-extrabold text-center;
}
.brand-title::before {
  content: "Sakura";
  @apply text-orange-500;
}
.brand-title::after {
  content: "Store";
  @apply text-blue-900;
}

.brand-subtitle {
  @apply mt-2 text-sm text-gray-500 text-center;
}

.error-banner {
  @apply flex items-center bg-red-50 border-l-4 border-red-500 p-4 mb-4;
}

.error-icon {
  @apply mr-2;
}

.error-text {
  @apply text-sm text-red-700;
}

.login-form {
  @apply mt-8 space-y-6;
}

.input-group {
  @apply rounded-md shadow-sm space-y-4;
}

.form-input {
  @apply appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm;
}

.submit-button {
  @apply w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-all;
}

.guest-action {
  @apply text-center mt-2;
}

.guest-button {
  @apply text-sm text-gray-400 hover:text-pink-600 transition-colors underline decoration-dotted;
}

.footer-link {
  @apply text-center mt-4 border-t pt-4 text-sm text-gray-600;
}

.link-text {
  @apply font-medium text-pink-600 hover:text-pink-800 underline;
}
</style>
