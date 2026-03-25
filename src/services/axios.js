import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.escuelajs.co/api/v1',
});

apiClient.interceptors.request.use((config) => {
  
  const token = localStorage.getItem('user_token'); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token isteğe eklendi!"); 
  }
  return config;
});

export default apiClient;