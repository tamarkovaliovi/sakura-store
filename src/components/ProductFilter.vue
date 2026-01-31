<template>
  <div class="min-h-screen flex flex-col font-sans bg-background">
    <Header />

    <div class="relative bg-white pt-12 pb-10 px-4 sm:px-6 lg:px-8 text-center shadow-sm overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
        <span class="text-[10rem] font-bold text-blue-900 uppercase tracking-widest transform scale-110">
          Sakura
        </span>
      </div>
      
      <div class="relative z-10">
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          {{ isSearching ? `'${searchKeyword}' İçin Sonuçlar` : 'Tüm Ürünler' }}
        </h1>
        <p class="max-w-2xl mx-auto text-lg text-gray-500 font-light">
          {{ isSearching ? 'Aradığınız kriterlere uygun ürünler aşağıda listelenmiştir.' : 'En yeni koleksiyonumuzu keşfedin, tarzınızı yansıtan parçaları bulun.' }}
        </p>
      </div>
    </div>

    <main class="flex-grow container mx-auto px-4 py-8">
      
      <div v-if="loading" class="text-center text-gray-500 py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
        <p class="text-xl">Ürünler aranıyor...</p>
      </div>

      <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-2xl font-bold text-gray-700 mb-2">Üzgünüz, sonuç bulunamadı.</h3>
        <p class="text-gray-500 mb-6">Farklı bir anahtar kelime deneyebilir veya tüm ürünlere dönebilirsiniz.</p>
        <CustomButton mode="clear-search" />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="product in products" :key="product.id" class="group bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
          
          <div class="relative h-64 overflow-hidden bg-gray-100">
            <img 
              v-if="product.images.length > 0"
              :src="formatImage(product.images[0])" 
              :alt="product.title" 
              class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
              @error="$event.target.src = tukendiImage"
            />
            
            <button class="absolute bottom-4 right-4 bg-white text-dark p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-blue-900 hover:text-white hover:scale-110 group-hover:bottom-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div class="p-6 flex flex-col flex-grow">
            <span class="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              {{ product.category.name }}
            </span>
            <h3 class="text-lg font-bold text-dark mb-1 leading-tight line-clamp-2">
              {{ product.title }}
            </h3>
            <div class="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
              <span class="text-xl font-bold text-dark">${{ product.price }}</span>
             <CustomButton mode="incele" />
            </div>
          </div>

        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import Header from '@/components/Header.vue';
import AppFooter from '@/components/AppFooter.vue';
import tukendiImage from '../components/pictures/tukendi.png';
import CustomButton from '@/components/CustomButton.vue';


const route = useRoute();    
const router = useRouter();   

const products = ref([]);
const loading = ref(true);
const isSearching = ref(false);
const searchKeyword = ref("");

const fetchProducts = async () => {
  loading.value = true;
  products.value = []; 
  
  try {
    let url = '';

  
    if (route.query.q) {
      
      isSearching.value = true;
      searchKeyword.value = route.query.q;
     
      url = `https://api.escuelajs.co/api/v1/products/?title=${route.query.q}`;
    } else {
    
      isSearching.value = false;
      url = 'https://api.escuelajs.co/api/v1/products/?categoryId=1&offset=0&limit=40';
    }

    const response = await fetch(url);
    const data = await response.json();

    
    if (Array.isArray(data)) {
      products.value = data;
    } else {
      products.value = [];
    }

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    loading.value = false;
  }
};


const clearSearch = () => {
  router.push('/products'); 
};

const formatImage = (imgurl) => {
  if (!imgurl) return tukendiImage;
  let cleaned = imgurl.replace(/["\[\]]/g, '');
  if (cleaned.startsWith('"')) cleaned = cleaned.slice(1);
  if (cleaned.endsWith('"')) cleaned = cleaned.slice(0, -1);
  if (cleaned.includes('place') || cleaned.includes('canvas') || !cleaned.startsWith('http')) {
    return tukendiImage;
  }
  return cleaned;
};


watch(() => route.query.q, () => {
  fetchProducts();
});

onMounted(() => {
  fetchProducts();
});
</script>