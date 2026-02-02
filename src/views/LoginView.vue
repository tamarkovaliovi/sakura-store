<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-blue-900">Giriş Yap</h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <input
              v-model="email"
              type="email"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-900 focus:border-blue-900 focus:z-10 sm:text-sm"
              placeholder="Email adresi"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-900 focus:border-blue-900 focus:z-10 sm:text-sm"
              placeholder="Şifre"
            />
          </div>
        </div>

        <div>
          <CustomButton mode="submit" :loading="loading" />
        </div>
      </form>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Hesabınız yok mu?
          <RouterLink
            to="/register"
            class="font-medium text-blue-900 hover:text-blue-700"
          >
            Hemen Kayıt Olun
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import CustomButton from "@/components/CustomButton.vue";

const email = ref("");
const password = ref("");
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`HATA: ${data.message || "Giriş yapılamadı!"}\n(Lütfen tekrar Kayıt Olun)`);
      loading.value = false;
      return;
    }

    if (data.access_token) {
      localStorage.setItem("user_token", data.access_token);

      const profileResponse = await fetch(
        "https://api.escuelajs.co/api/v1/auth/profile",
        {
          headers: { Authorization: `Bearer ${data.access_token}` },
        }
      );
      const profileData = await profileResponse.json();
      localStorage.setItem("user_name", profileData.name);

      window.location.href = "/";
    }
  } catch (error) {
    console.error("Hata:", error);
    alert("Sunucu hatası! Lütfen internet bağlantınızı kontrol edin.");
  } finally {
    loading.value = false;
  }
};
</script>
