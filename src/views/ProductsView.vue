<template>
  <div class="min-h-screen flex flex-col font-sans bg-background">
    <Header />

    <div class="bg-white shadow-sm py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-dark justify-center">Tüm Ürünler</h1>
        <p class="text-gray-500 mt-2 justify-center">En yeni koleksiyonumuzu keşfedin.</p>
      </div>
    </div>

    <main class="flex-grow container mx-auto px-4 py-8">
      
      <div v-if="loading" class="text-center text-gray-500 py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-xl">Ürünler yükleniyor...</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="product in products" :key="product.id" class="group bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
          
          <div class="relative h-64 overflow-hidden bg-gray-100">
            <img 
              v-if="product.images.length > 0"
              :src="formatImage(product.images[0])" 
              :alt="product.title" 
              class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
              @error="$event.target.src='https://via.placeholder.com/300?text=Resim+Yok'"
            />
            
            <button class="absolute bottom-4 right-4 bg-white text-dark p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110 group-hover:bottom-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div class="p-6 flex flex-col flex-grow">
            <span class="text-xs font-bold text-primary uppercase tracking-wider mb-2">
              {{ product.category.name }}
            </span>
            <h3 class="text-lg font-bold text-dark mb-1 leading-tight line-clamp-2">
              {{ product.title }}
            </h3>
            <div class="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
              <span class="text-xl font-bold text-dark">${{ product.price }}</span>
              <button class="text-sm font-semibold text-primary hover:text-orange-700">İncele</button>
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
import Header from '@/components/Header.vue';
import AppFooter from '@/components/AppFooter.vue';

const products = ref([]);
const loading = ref(true);

const fetchProducts = async () => {
  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=50');
    const data = await response.json();
    products.value = data;
    loading.value = false;
  } catch (error) {
    console.error('Hata:', error);
    loading.value = false;
  }
};

const formatImage = (imgurl) => {
  return imgurl.replace(/["\[\]]/g, ''); 
};
onMounted (() => {
  fetchProducts();
});
</script>