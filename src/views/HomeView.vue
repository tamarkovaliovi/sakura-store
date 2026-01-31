<template>
  <div class="min-h-screen flex flex-col font-sans bg-background">
    <Header />

    <section class="relative h-[500px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-gray-900">
        <img
          :src="homeImage"
          alt="Banner"
          class="w-full h-full object-cover opacity-60"
        />
      </div>

      <div class="relative z-10 text-center px-4 max-w-3xl">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">Tarzını Keşfet</h1>
        <p class="text-xl text-gray-200 mb-8">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro facere eos ad
          iure pariatur dolor inventore.
        </p>
        <CustomButton mode="start-shopping" @click="scrollToProducts" />
      </div>
    </section>

    <main id="products-section" class="flex-grow container mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold text-dark mb-8">Yeni Gelenler</h2>

      <div v-if="loading" class="text-center text-gray-500 py-10">
        <p class="text-xl">Ürünler yükleniyor...</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="group bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 flex flex-col overflow-hidden"
        >
          
          <router-link :to="{ name: 'product-details', params: { id: product.id } }">
            <div class="relative h-64 overflow-hidden bg-gray-100">
              <img 
                :src="formatImage(product.images[0])" 
                :alt="product.title"
                class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                @error="$event.target.src = 'https://via.placeholder.com/300'" 
              >
            </div>
          </router-link>

          <div class="p-4 flex flex-col flex-grow">
            <span class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              {{ product.category.name }}
            </span>

            <router-link :to="{ name: 'product-details', params: { id: product.id } }">
              <h3 class="font-bold text-gray-800 text-lg mb-1 leading-tight line-clamp-2 hover:text-blue-600 transition">
                {{ product.title }}
              </h3>
            </router-link>

            <div class="mt-auto pt-4 flex flex-col gap-3 border-t border-gray-100">
              <div class="flex justify-between items-center">
                 <span class="text-xl font-bold text-gray-900">{{ product.price }}₺</span>
                 
                 <router-link :to="{ name: 'product-details', params: { id: product.id } }">
                   
                 </router-link>
              </div>
              
             
            </div>
          </div>
        </div>
        </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import localBanner from "@/components/pictures/home.jpg";
import CustomButton from '@/components/CustomButton.vue'; 

const homeImage = localBanner;
const products = ref([]);
const loading = ref(true);

const scrollToProducts = () => {
  const element = document.getElementById("products-section");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const fetchProducts = async () => {
  try {
    const response = await fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=8'); 
    const data = await response.json();
    products.value = data;
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    loading.value = false;
  }
};

const sepeteEkle = (product) => {
  alert(`${product.title} sepete eklendi!`);
};


const formatImage = (imgUrl) => {
  if (!imgUrl) return "https://via.placeholder.com/300";
  return imgUrl.replace(/[\[\]"]/g, "");
};

onMounted(() => {
  fetchProducts();
});
</script>