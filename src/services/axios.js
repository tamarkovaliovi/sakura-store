import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.escuelajs.co/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Oturum süresi dolmuş veya yetkisiz erişim.");
     
    }
    return Promise.reject(error);
  }
);

export default apiClient;