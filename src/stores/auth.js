import { defineStore } from 'pinia';
import apiClient from '@/services/axios'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false
  }),
  actions: {
    async fetchUser() {
      
      if (this.user || this.loading) return;

      const token = localStorage.getItem("user_token");
      if (!token) return;

      this.loading = true;
      try {
      
        const response = await apiClient.get('/auth/profile');
        
        this.user = response.data;
      } catch (error) {
        console.error("User fetch failed:", error.response?.data || error.message);
        this.user = null;
       
        localStorage.removeItem("user_token");
      } finally {
        this.loading = false;
      }
    },
    
    
    logout() {
      this.user = null;
      localStorage.removeItem("user_token");
      window.location.href = "/login";
    }
  }
});