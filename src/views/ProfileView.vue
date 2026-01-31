<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    
    <Header />

   <main class="flex-grow py-8 px-4 sm:px-6 lg:px-8 min-h-[110vh]">
      
      <div v-if="loading" class="flex flex-col items-center justify-center min-h-[50vh]">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900"></div>
        <p class="mt-4 text-gray-600 font-medium animate-pulse">Profiliniz hazırlanıyor...</p>
      </div>

      <div v-else class="max-w-6xl mx-auto animate-fade-in">
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Hesabım</h1>
          <p class="text-gray-500">Hoş geldin, <span class="text-blue-900 font-bold text-lg">{{ user.name }}</span>! </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div class="lg:col-span-1 space-y-6">
            
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <div class="p-8 text-center">
                <h3 class="text-2xl font-bold text-gray-900 mb-1">{{ user.name }}</h3>
                <p class="text-gray-500 mb-4">{{ user.email }}</p>
                <span class="inline-block px-4 py-1.5 bg-blue-50 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100">
                  {{ user.role || 'Müşteri' }}
                </span>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <nav class="flex flex-col text-sm">
                <a href="#" class="px-6 py-4 text-gray-600 hover:bg-blue-50 hover:text-blue-900 font-medium border-b border-gray-50 transition flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-900 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Siparişlerim
                </a>
                <a href="#" class="px-6 py-4 text-gray-600 hover:bg-blue-50 hover:text-blue-900 font-medium border-b border-gray-50 transition flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-900 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favorilerim
                </a>
                <a href="#" class="px-6 py-4 text-gray-600 hover:bg-blue-50 hover:text-blue-900 font-medium border-b border-gray-50 transition flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-900 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Adres Bilgilerim
                </a>
                <a href="#" class="px-6 py-4 text-gray-600 hover:bg-blue-50 hover:text-blue-900 font-medium border-b border-gray-50 transition flex items-center group">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-900 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Hesap Ayarları
                </a>
                <CustomButton mode="logout" />
              </nav>
            </div>
          </div>

          <div class="lg:col-span-3 space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition cursor-pointer group">
                <div>
                  <p class="text-gray-400 text-xs font-bold uppercase tracking-wider">Siparişlerim</p>
                  <h4 class="text-3xl font-bold text-blue-900 mt-1">0</h4>
                </div>
                <div class="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>

              <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition cursor-pointer group">
                <div>
                  <p class="text-gray-400 text-xs font-bold uppercase tracking-wider">İndirim Kuponu</p>
                  <h4 class="text-3xl font-bold text-orange-500 mt-1">0</h4>
                </div>
                <div class="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2" />
                  </svg>
                </div>
              </div>

              <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition cursor-pointer group">
                <div>
                  <p class="text-gray-400 text-xs font-bold uppercase tracking-wider">Sepetim</p>
                  <h4 class="text-3xl font-bold text-green-600 mt-1">0</h4>
                </div>
                <div class="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
              <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Henüz Siparişiniz Yok</h3>
              <p class="text-gray-500 max-w-md mx-auto mb-8">
                Siparişleriniz, kargo takibiniz ve iade süreçleriniz burada listelenecek. 
              
              </p>
              <CustomButton mode="start-shopping" />
            </div>

          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import AppFooter from '@/components/AppFooter.vue';
import CustomButton from '@/components/CustomButton.vue';

const router = useRouter();
const loading = ref(true);
const user = ref({});

const fetchUserProfile = async () => {
  const token = localStorage.getItem('user_token');
  
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      user.value = data;
    } else {
      handleLogout();
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_name');
  window.location.href = '/login';
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>