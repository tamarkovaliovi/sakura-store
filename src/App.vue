<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

onMounted(async () => {
  // DÜZELTME: Projenin geri kalanıyla uyum için 'access_token' kullanmalısın
  const token = localStorage.getItem("access_token");

  if (token) {
    try {
      // Sayfa her yüklendiğinde kullanıcı bilgilerini API'den tazele
      await authStore.fetchUser();
      console.log("🌸 SakuraStore Hazır: Kullanıcı oturumu doğrulandı.");
    } catch (error) {
      console.error("Oturum doğrulama hatası:", error);
      // Eğer token geçersizse authStore.logout() zaten temizliği yapacaktır
    }
  }
});
</script>

<template>
  <RouterView />
</template>
