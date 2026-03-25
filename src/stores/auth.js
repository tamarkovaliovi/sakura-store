
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false
  }),
  actions: {
    async fetchUser() {
     const token = localStorage.getItem("user_token");
      if (!token) return;

      this.loading = true
      try {
        const response = await axios.get('https://api.escuelajs.co/api/v1/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.user = response.data
      } catch (error) {
        console.error("User fetch failed:", error.response?.data || error.message)
        this.user = null
        
      } finally {
        this.loading = false
      }
    }
  }
})