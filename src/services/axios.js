import axios from "axios";

// 1. SakuraStore için özel axios instance oluşturuyoruz
const apiClient = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1",
});

// 2. REQUEST INTERCEPTOR: Her istekte token'ı otomatik ekler
apiClient.interceptors.request.use(
  (config) => {
    // localStorage ismi router ile aynı (access_token) olmalı
    const token = localStorage.getItem("access_token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🚀 TOKEN YOLA ÇIKTI:", token);
    } else {
      console.warn("⚠️ TOKEN BULUNAMADI! Giriş yapmanız gerekebilir.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR: Token süresi biterse (401) login'e atar
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;