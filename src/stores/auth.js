import { defineStore } from 'pinia';
import apiClient from '@/services/axios'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false
  }),
  actions: {
    async fetchUser() {
      // Eğer kullanıcı zaten varsa veya şu an yükleniyorsa tekrar istek atma
      if (this.user || this.loading) return;

      // DÜZELTME: Projenin geri kalanıyla uyum için 'access_token' kullanmalısın
      const token = localStorage.getItem("access_token");
      if (!token) return;

      this.loading = true;
      try {
        // Platzi API profile endpoint'i
        const response = await apiClient.get('/auth/profile');
        
        // Başarılıysa kullanıcı verisini state'e kaydet
        this.user = response.data;
        console.log("✅ Kullanıcı bilgileri güncellendi:", this.user.name);
      } catch (error) {
        console.error("User fetch failed:", error.response?.data || error.message);
        this.user = null;
        
        // Hata durumunda geçersiz token'ı temizle (DÜZELTME: access_token)
        localStorage.removeItem("access_token");
      } finally {
        this.loading = false;
      }
    },
    
    // Çıkış yapma işlemi
    logout() {
      this.user = null;
      // DÜZELTME: access_token temizlenmeli
      localStorage.removeItem("access_token");
      // Sepet ve diğer verileri de temizlemek istersen burada yapabilirsin
      window.location.href = "/login";
    }
  }
});