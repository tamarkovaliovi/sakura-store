<template>
  <div class="page-wrapper min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main class="flex-grow container mx-auto px-4 py-8 md:py-12">
      <div class="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1
            class="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase"
          >
            Favorilerim
          </h1>
          <p class="text-gray-400 mt-1 text-xs md:text-sm italic">
            Seçtiğiniz ürünler burada listelenir.
          </p>
        </div>
        <div class="bg-pink-50 text-pink-500 px-3 py-1 rounded-full font-bold text-xs">
          {{ store.favorites.length }} Ürün
        </div>
      </div>

      <div
        v-if="store.favorites.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-fade-in"
      >
        <div
          v-for="product in store.favorites"
          :key="product.id"
          class="fav-card bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col"
        >
          <button
            @click="store.toggleFavorite(product)"
            class="absolute top-2 right-2 z-20 bg-white/80 p-1.5 rounded-full shadow-sm hover:scale-110 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 md:h-5 md:w-5 fill-red-500 text-red-500"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </button>

          <router-link
            :to="`/products/${product.id}`"
            class="block h-40 md:h-48 overflow-hidden bg-gray-50"
          >
            <img
              :src="formatImage(product.images)"
              :alt="product.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              @error="
                (e) => (e.target.src = 'https://placehold.co/400x400?text=Resim+Yok')
              "
            />
          </router-link>

          <div class="p-3 md:p-4 flex flex-col flex-grow">
            <span
              class="text-[9px] font-bold text-pink-400 uppercase tracking-widest block mb-1"
            >
              {{ product.category?.name || "Koleksiyon" }}
            </span>
            <h2 class="text-sm md:text-base font-bold text-gray-800 truncate mb-1">
              {{ product.title }}
            </h2>
            <p class="text-base md:text-lg font-black text-gray-900 mb-4">
              ${{ product.price }}
            </p>

            <div class="mt-auto pt-2 border-t border-gray-50 flex flex-col gap-2">
              <button
                @click="store.addToCart(product)"
                class="w-full bg-gray-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-pink-600 transition-all active:scale-95"
              >
                Sepete Ekle
              </button>
              <router-link
                :to="`/products/${product.id}`"
                class="text-center text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors py-1"
              >
                Detaylar
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center py-20 bg-white rounded-[2rem] border border-pink-50 max-w-2xl mx-auto shadow-sm"
      >
        <div class="text-5xl mb-4">🌸</div>
        <h2 class="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2">
          Liste Boş
        </h2>
        <p class="text-gray-400 text-sm mb-8 px-6">Henüz favorilere ürün eklemediniz.</p>
        <router-link
          to="/Allproducts"
          class="bg-pink-500 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-pink-600 transition-all shadow-md"
        >
          Alışverişe Başla
        </router-link>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useCartStore } from "@/stores/cart";

const store = useCartStore();

const formatImage = (imgData) => {
  if (!imgData) return "https://placehold.co/600x600?text=Resim+Yok";
  let url = Array.isArray(imgData) ? imgData[0] : imgData;
  let cleaned = String(url)
    .replace(/[\[\]"]/g, "")
    .trim();
  if (cleaned.includes("placeimg.com") || !cleaned.startsWith("http")) {
    return "https://placehold.co/600x600?text=Sakura+Store";
  }
  return cleaned;
};
</script>

<style scoped>
.fav-card {
  backface-visibility: hidden;
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
