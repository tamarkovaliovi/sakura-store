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

// Render ve canlı ortam için HTTPS tabanlı ana URL
const API_BASE_URL = "https://api.escuelajs.co";

const handleRegister = async () => {
  loading.value = true;
  errorMsg.value = "";

  // Kullanıcı ismiyle dinamik avatar oluşturma
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
        role: "customer", // Platzi API'nin beklediği zorunlu alan
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // API'den gelen hata mesajlarını (örneğin: "email must be an email") kullanıcıya gösteriyoruz
      if (data.message) {
        errorMsg.value = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message;
      } else {
        errorMsg.value =
          "Kayıt sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edin.";
      }
      return;
    }

    alert("✅ Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
    router.push("/login");
  } catch (error) {
    console.error("Bağlantı Hatası:", error);
    errorMsg.value = "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2 class="brand-title"></h2>
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
              class="form-input"
              placeholder="Email adresi"
            />
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
          <CustomButton mode="submit" :loading="loading" class="submit-button">
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

<
<style scoped>
.register-container {
  @apply min-h-screen flex items-center justify-center bg-pink-50 py-12 px-4 sm:px-6 lg:px-8;
}

.register-card {
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

.form-input {
  @apply appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-all;
}

.submit-button {
  @apply w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none transition-colors shadow-md;
}

.footer-link {
  @apply text-center mt-4 border-t pt-4 text-sm text-gray-600;
}

.link-text {
  @apply font-medium text-pink-600 hover:text-pink-800 underline underline-offset-4;
}
</style>
