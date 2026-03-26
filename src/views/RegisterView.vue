<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/services/axios"; // Axios instance'ı ekledik
import CustomButton from "@/components/CustomButton.vue";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

const handleRegister = async () => {
  // Basit boşluk kontrolü
  if (!name.value.trim() || !email.value.trim() || !password.value.trim()) {
    errorMsg.value = "Lütfen tüm alanları eksiksiz doldurun.";
    return;
  }

  loading.value = true;
  errorMsg.value = "";

  // Dinamik avatar linki
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name.value
  )}&background=0D47A1&color=fff`;

  try {
    // DÜZELTME: fetch yerine apiClient (Axios) kullanarak daha temiz bir yapı kurduk
    const response = await apiClient.post("/users/", {
      name: name.value,
      email: email.value,
      password: password.value,
      avatar: defaultAvatar,
      role: "customer",
    });

    // Axios başarılıysa direkt veriyi döner (response.ok kontrolüne gerek kalmaz)
    alert("✅ Kayıt Başarılı! Şimdi giriş yapabilirsiniz.");
    router.push("/login");
  } catch (error) {
    console.error("Kayıt Hatası:", error);

    // Axios hata mesajını yakalama
    if (error.response && error.response.data) {
      const data = error.response.data;
      errorMsg.value = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "Kayıt sırasında bir hata oluştu.";
    } else {
      errorMsg.value = "Sunucuya bağlanılamadı. Lütfen internetinizi kontrol edin.";
    }
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
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Konteynır: Arka planı Login ile aynı */
.register-container {
  @apply min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans;
}

/* Kart */
.register-card {
  @apply max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-gray-100;
  animation: fadeInUp 0.6s ease-out;
}

/* --- LOGO STİLİ (FOTOĞRAFA GÖRE GÜNCELLENDİ) --- */
.brand-title {
  /* tracking-tighter ve font-black ile harfleri fotoğraftaki gibi sıkılaştırdık */
  @apply text-4xl font-black text-center tracking-tighter;
}

.brand-title::before {
  content: "Sakura";
  /* Fotoğraftaki koyu mavi/indigo tonu */
  @apply text-indigo-900;
}

.brand-title::after {
  content: "Store";
  /* Fotoğraftaki canlı pembe tonu */
  @apply text-pink-500;
}
/* ---------------------------------------------- */

.brand-subtitle {
  @apply mt-2 text-sm text-gray-400 text-center font-medium italic;
}

/* Hata Mesajı Alanı */
.error-banner {
  @apply flex items-center bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-2xl;
}

.error-icon {
  @apply mr-3 text-lg;
}

.error-text {
  @apply text-[10px] text-red-700 font-black uppercase tracking-wider;
}

/* Form Tasarımı */
.register-form {
  @apply mt-8 space-y-6;
}

.input-group {
  @apply space-y-4;
}

.form-input {
  @apply appearance-none rounded-2xl relative block w-full px-5 py-4 border border-transparent bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-pink-300 focus:bg-white sm:text-sm transition-all font-bold;
}

.form-input:focus {
  transform: scale(1.02);
}

/* Buton Stili */
.submit-button {
  @apply w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-indigo-950 hover:bg-pink-500 shadow-xl shadow-indigo-100/50 transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50;
}

/* Alt Bağlantılar */
.footer-link {
  @apply text-center mt-8 border-t border-gray-50 pt-6 text-sm text-gray-500 font-medium;
}

.link-text {
  @apply font-black text-pink-500 hover:text-pink-700 underline underline-offset-8 uppercase text-xs ml-1 transition-colors;
}

.input-label {
  @apply text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 mb-2 block;
}
</style>
