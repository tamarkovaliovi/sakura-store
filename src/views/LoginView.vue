<script setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import apiClient from "@/services/axios";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMsg.value = "Lütfen tüm alanları doldurun.";
    return;
  }

  loading.value = true;
  errorMsg.value = "";

  try {
    const response = await apiClient.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    const { access_token } = response.data;

    if (access_token) {
      localStorage.setItem("access_token", access_token);
      await authStore.fetchUser();
      await nextTick();

      router.push("/").catch((err) => {
        console.error("Yönlendirme hatası:", err);
        router.push("/");
      });
    } else {
      throw new Error("Geçersiz anahtar alındı.");
    }
  } catch (error) {
    console.error("Giriş Hatası:", error);
    if (error.response) {
      if (error.response.status === 401) {
        errorMsg.value = "E-posta veya şifre hatalı!";
      } else {
        errorMsg.value = error.response.data?.message || "Sunucu hatası oluştu.";
      }
    } else {
      errorMsg.value = "Bağlantı hatası! Lütfen internetinizi kontrol edin.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="text-center mb-10">
        <h2 class="brand-title"></h2>
        <p class="brand-subtitle">Moda dünyasına hoş geldiniz</p>
      </div>

      <div v-if="errorMsg" class="error-banner">
        <span class="error-icon">⚠️</span>
        <p class="error-text">{{ errorMsg }}</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field-group">
          <label class="input-label">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="form-input"
            placeholder="john@mail.com"
          />
        </div>

        <div class="field-group">
          <label class="input-label">Şifre</label>
          <input
            v-model="password"
            type="password"
            required
            class="form-input"
            placeholder="••••••••"
          />
        </div>

        <div class="pt-6">
          <button type="submit" :disabled="loading" class="submit-button">
            <div v-if="loading" class="flex items-center justify-center gap-3">
              <div
                class="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              <span>Lütfen Bekleyin...</span>
            </div>
            <span v-else>Giriş Yap</span>
          </button>
        </div>

        <div class="footer-link">
          <button type="button" @click="router.push('/')" class="guest-button">
            Üye Olmadan Devam Et
          </button>

          <div class="pt-6 border-t border-gray-50 mt-6">
            <p class="text-gray-500 text-sm font-medium">
              Hesabınız yok mu?
              <RouterLink to="/register" class="link-text">Hemen Kayıt Olun</RouterLink>
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-animate {
  animation: fadeIn 0.5s ease-out forwards;
}

.login-container {
  @apply min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans;
}

.login-card {
  @apply max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-gray-100 auth-animate;
}

.brand-title {
  @apply text-4xl font-black text-center tracking-tighter uppercase;
}

.brand-title::before {
  content: "Sakura";
  @apply text-indigo-900;
}

.brand-title::after {
  content: "Store";
  @apply text-pink-500;
}

.brand-subtitle {
  @apply mt-2 text-sm text-gray-400 text-center font-medium italic;
}

.error-banner {
  @apply flex items-center bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-xl;
}

.error-icon {
  @apply mr-3 text-lg;
}

.error-text {
  @apply text-xs text-red-700 font-black uppercase tracking-wider;
}

.login-form {
  @apply mt-8 space-y-6;
}

.form-input {
  @apply appearance-none rounded-2xl relative block w-full px-5 py-4 border border-transparent bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-pink-300 focus:bg-white sm:text-sm transition-all font-bold;
}

input:focus {
  transform: scale(1.02);
}

.submit-button {
  @apply w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-indigo-950 hover:bg-pink-600 shadow-xl shadow-indigo-100 transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50;
}

.guest-button {
  @apply text-[10px] font-black text-gray-400 hover:text-indigo-950 uppercase tracking-widest transition-colors;
}

.footer-link {
  @apply text-center mt-6 flex flex-col items-center;
}

.link-text {
  @apply font-black text-pink-500 hover:text-pink-700 underline underline-offset-4 uppercase text-xs ml-1;
}

.input-label {
  @apply text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 mb-2 block text-left w-full;
}
</style>
