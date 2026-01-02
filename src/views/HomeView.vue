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
          iure pariatur dolor inventore. Dicta provident aperiam, odit quibusdam amet, sit
          praesentium at voluptate unde animi voluptatibus id!.
        </p>

        <button
          @click="scrollToProducts"
          class="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition transform hover:scale-105 shadow-lg"
        >
          Alışverişe Başla
        </button>
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
          class="group bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
        >
          <div class="relative h-64 overflow-hidden bg-gray-100">
            <img
              v-if="product.images.length > 0"
              :src="formatImage(product.images[0])"
              :alt="product.title"
              class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
              @error="
                $event.target.src = '/components/pictures/placeholder.jpg'"
              
            />

            
            <button
              class="absolute bottom-4 right-4 bg-white text-dark p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110 group-hover:bottom-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
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

            <div
              class="mt-auto pt-4 flex justify-between items-center border-t border-gray-100"
            >
              <span class="text-xl font-bold text-dark">${{ product.price }}</span>
              <button class="text-sm font-semibold text-primary hover:text-orange-700">
                İncele
              </button>
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
import tukendiImage from '@/components/pictures/tukendi.jpg';
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
    loading.value = false;
  } catch (error) {
    console.error('Hata:', error);
    loading.value = false;
  }
};

const formatImage = (imgUrl) => {
  return imgUrl.replace(/["\[\]]/g, "");
};

onMounted(() => {
  fetchProducts();
});
</script>
