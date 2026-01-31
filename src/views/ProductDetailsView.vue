<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; 
import { addToCart } from '../stores/cart';
import Header from '@/components/Header.vue';
import AppFooter from '@/components/AppFooter.vue';

const route = useRoute();
const product = ref(null);
const loading = ref(true);

onMounted(async () => {

  const productId = route.params.id;
  const response = await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`);
  product.value = await response.json();
  loading.value = false;
});
</script>


<template>
  <div class="min-h-screen bg-gray-100 pb-10">
    <Header />

    <div v-if="loading" class="text-center mt-20 text-xl font-bold text-gray-500">
      Ürün Yükleniyor...
    </div>

 
    <div v-else-if="product" class="max-w-4xl mx-auto mt-10 mb-20 p-6 bg-white shadow-lg rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div>
          <img :src="product.images[0]" class="w-full rounded-lg object-cover" alt="Ürün Resmi">
        </div>

        <div class="flex flex-col justify-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ product.title }}</h1>
          
          <p class="text-2xl text-blue-900 font-bold mb-6">${{ product.price }}</p>
          
          <p class="text-gray-600 mb-8 leading-relaxed">{{ product.description }}</p>
          
          <button 
            @click="addToCart(product)" 
            class="bg-blue-900 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-800 transition">
            Sepete Ekle
          </button>
        </div>

      </div>
    </div>
     </div>
    <AppFooter />
  
</template>