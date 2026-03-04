<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2 class="brand-title">Hesap Oluştur</h2>
        <p class="brand-subtitle">SakuraStore dünyasına ilk adımı atın</p>
      </div>

      <div v-if="errorMsg" class="error-banner">
        <span class="error-icon">❌</span>
        <p class="error-text">{{ errorMsg }}</p>
      </div>

      <form class="register-form" @submit.prevent="handleRegister">
        <div class="input-group">
          <div class="field">
            <label class="sr-only">İsim Soyisim</label>
            <input
              v-model="name"
              type="text"
              required
              class="form-input"
              placeholder="İsim Soyisim"
            />
          </div>

          <div class="field">
            <label class="sr-only">Email Adresi</label>
            <input
              v-model="email"
              type="email"
              required
              @blur="checkEmailAvailability"
              class="form-input"
              :class="{ 'border-red-500': emailError }"
              placeholder="Email adresi"
            />
            <p v-if="emailError" class="email-error-text">{{ emailError }}</p>
            <p v-if="checkingEmail" class="email-checking-text">Kontrol ediliyor...</p>
          </div>

          <div class="field">
            <label class="sr-only">Şifre</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="4"
              class="form-input"
              placeholder="Şifre (En az 4 karakter)"
            />
          </div>
        </div>

        <div class="action-area">
          <CustomButton
            mode="submit"
            :loading="loading"
            :disabled="emailError || checkingEmail"
            class="submit-button"
          >
            {{ loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol" }}
          </CustomButton>
        </div>
      </form>

      <div class="footer-link">
        <p>
          Zaten hesabınız var mı?
          <RouterLink to="/login" class="link-text">Giriş Yap</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import CustomButton from "@/components/CustomButton.vue";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

const checkingEmail = ref(false);
const emailError = ref("");

const API_BASE_URL = "https://api.escuelajs.co";

const checkEmailAvailability = async () => {
  if (!email.value || !email.value.includes("@")) {
    emailError.value = "";
    return;
  }

  checkingEmail.value = true;
  emailError.value = "";

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/is-available`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value }),
    });

    const data = await response.json();
    if (data.isAvailable === false) {
      emailError.value = "Bu e-posta adresi zaten kullanımda!";
    }
  } catch (error) {
    console.error("Email kontrol hatası:", error);
  } finally {
    checkingEmail.value = false;
  }
};

const handleRegister = async () => {
  if (emailError.value) return;

  loading.value = true;
  errorMsg.value = "";

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name.value
  )}&background=0D47A1&color=fff`;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        avatar: defaultAvatar,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.message) {
        errorMsg.value = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;
      } else {
        errorMsg.value = "Kayıt sırasında bir hata oluştu.";
      }
      return;
    }

    alert("✅ Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
    router.push("/login");
  } catch (error) {
    console.error("Bağlantı Hatası:", error);
    errorMsg.value = "Sunucu hatası! Lütfen internet bağlantınızı kontrol edin.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  @apply min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8;
}

.register-card {
  @apply max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100;
}

.brand-title {
  @apply text-3xl font-extrabold text-blue-900 text-center;
}

.brand-subtitle {
  @apply mt-2 text-sm text-gray-500 text-center;
}

.error-banner {
  @apply flex items-center bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded;
}

.error-icon {
  @apply mr-2;
}

.error-text {
  @apply text-sm text-red-700 font-medium;
}

.register-form {
  @apply mt-8 space-y-6;
}

.input-group {
  @apply rounded-md shadow-sm space-y-4;
}

.form-input {
  @apply appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm transition-all;
}

.email-error-text {
  @apply text-xs text-red-600 mt-1 font-semibold;
}

.email-checking-text {
  @apply text-xs text-blue-600 mt-1 italic;
}

.submit-button {
  @apply w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.footer-link {
  @apply text-center mt-4 border-t pt-4 text-sm text-gray-600;
}

.link-text {
  @apply font-medium text-blue-900 hover:text-blue-700 underline underline-offset-4;
}
</style>
