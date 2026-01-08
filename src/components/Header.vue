<template>
  <header class="bg-white shadow-sm sticky top-0 z-50 relative h-20">
    <div class="container mx-auto px-4 h-full flex items-center justify-between relative">
      
      <div class="text-2xl font-bold text-dark cursor-pointer z-10 flex-shrink-0">
        SakuraStore
      </div>
      
      <nav class="hidden md:flex space-x-8 text-dark items-center absolute left-1/2 transform -translate-x-1/2">
        <RouterLink to="/" class="font-medium hover:text-blue-900 transition relative group">
          Ana Sayfa
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-full"></span>
        </RouterLink>
        <RouterLink to="/products" class="font-medium hover:text-blue-900 transition relative group">
          Ürünler
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-900 transition-all duration-300 group-hover:w-full"></span>
        </RouterLink>
        
        <button 
          @click="toggleMenu" 
          class="flex items-center font-medium hover:text-blue-900 transition focus:outline-none"
        >
          Kategoriler
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform transition-transform duration-200" :class="{ 'rotate-180': isMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </nav>

      <div class="flex items-center justify-end z-10 relative">
        
        <div class="flex items-center transition-all duration-300 ease-in-out" :class="isSearchOpen ? 'w-64' : 'w-10'">
          
          <button v-if="!isSearchOpen" @click="isSearchOpen = true" class="hover:text-blue-900 transition p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <div v-else class="relative w-full flex items-center animate-fade-in">
            <input 
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text" 
              placeholder="Ara..." 
              class="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900 text-sm shadow-sm transition-all bg-gray-50"
              autofocus
            />
            
            <button 
              @click="handleSearch" 
              class="absolute right-1 top-1 bottom-1 bg-blue-900 text-white rounded-full p-1.5 hover:bg-blue-800 transition shadow-md flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button @click="closeSearch" class="ml-2 text-gray-400 hover:text-red-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
         
        <div class="flex items-center space-x-3 ml-2 border-l pl-3 border-gray-200">
         <RouterLink 
  :to="isLoggedIn ? '/profile' : '/login'" 
  class="hover:text-blue-900 transition flex items-center"
  title="Hesabım"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
  
  <span v-if="isLoggedIn" class="ml-2 text-sm font-semibold hidden md:block">
    {{ userName }}
  </span>
</RouterLink>

          <button class="hover:text-blue-900 transition relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="absolute -top-2 -right-2 bg-blue-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
          </button>
        </div>

      </div>
    </div>

    <div v-show="isMenuOpen" class="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl z-40 transition-all duration-300 ease-in-out">
      <div class="container mx-auto px-4 py-8">
        <div v-if="loading" class="text-center text-gray-500 py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-2"></div>
          Kategoriler yükleniyor...
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div v-for="category in categories" :key="category.id" class="group cursor-pointer flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition">
            <div class="h-20 w-20 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-blue-900 transition">
              <img :src="category.image" class="w-full h-full object-cover" @error="$event.target.src='https://via.placeholder.com/150?text=Kategori'" />
            </div>
            <span class="font-semibold text-gray-700 group-hover:text-blue-900 text-center uppercase text-sm tracking-wide">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isMenuOpen" @click="isMenuOpen = false" class="fixed inset-0 bg-black bg-opacity-30 z-30" style="top: 80px;"></div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isMenuOpen = ref(false);
const isSearchOpen = ref(false);
const searchQuery = ref("");
const categories = ref([]);
const loading = ref(true);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { q: searchQuery.value } });
   
  }
};

const closeSearch = () => {
  isSearchOpen.value = false;
  searchQuery.value = "";
}

const fetchCategories = async () => {
  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/categories');
    const data = await response.json();
    categories.value = data.slice(0, 5); 
    loading.value = false;
  } catch (error) {
    console.error("Kategoriler yüklenirken hata:", error);
    loading.value = false;
  }
};
// Script setup içinde:
const isLoggedIn = ref(false);
const userName = ref('');

const checkLoginStatus = () => {
  const token = localStorage.getItem('user_token');
  const name = localStorage.getItem('user_name');
  if (token) {
    isLoggedIn.value = true;
    userName.value = name || 'Hesabım';
  } else {
    isLoggedIn.value = false;
    userName.value = '';
  }
};

onMounted(() => {
  checkLoginStatus(); // Sayfa açılınca kontrol et
  // ... diğer fetch işlemleri
});

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>

