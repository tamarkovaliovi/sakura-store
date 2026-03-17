<template>
  <div class="page-wrapper min-h-screen flex flex-col bg-gray-50">
    <Header />

    <main class="flex-grow container mx-auto px-4 py-10 md:py-16">
      <div class="max-w-5xl mx-auto">
        <div
          class="flex items-center justify-between mb-10 border-b border-gray-100 pb-6"
        >
          <div>
            <h1 class="text-3xl font-black text-indigo-900 tracking-tight uppercase">
              Favorilerim
            </h1>
            <p class="text-gray-400 mt-1 text-sm italic">
              Beğendiğiniz ürünler SakuraStore güvencesiyle burada listelenir.
            </p>
          </div>
          <div
            class="bg-pink-50 text-pink-500 px-4 py-1.5 rounded-full font-bold text-xs shadow-sm border border-pink-100"
          >
            {{ store.favorites.length }} Ürün
          </div>
        </div>

        <div v-if="store.favorites.length > 0" class="space-y-8 animate-fade-in">
          <div
            v-for="product in store.favorites"
            :key="product.id"
            class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 group"
          >
            <div class="flex flex-col md:flex-row">
              <div
                class="w-full md:w-80 h-80 bg-gray-100 relative overflow-hidden flex-shrink-0"
              >
                <img
                  :src="formatImage(product.images)"
                  :alt="product.title"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button
                  @click="store.toggleFavorite(product)"
                  class="absolute top-4 left-4 z-10 bg-white/90 p-3 rounded-full shadow-lg hover:bg-red-50 transition-all active:scale-90"
                  title="Favorilerden Kaldır"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 fill-red-500 text-red-500"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                </button>
              </div>

              <div class="flex-grow p-8 md:p-10 flex flex-col justify-between bg-white">
                <div>
                  <div class="flex justify-between items-start mb-4">
                    <span
                      class="text-[12px] font-bold text-pink-400 uppercase tracking-[0.3em]"
                    >
                      {{ product.category?.name || "Özel Tasarım" }}
                    </span>
                    <span class="text-3xl font-black text-indigo-900">
                      ${{ product.price }}
                    </span>
                  </div>
                  <h2
                    class="text-2xl font-bold text-gray-800 mb-4 group-hover:text-pink-500 transition-colors"
                  >
                    {{ product.title }}
                  </h2>
                  <p class="text-gray-500 text-base leading-relaxed line-clamp-3 mb-6">
                    {{
                      product.description ||
                      "SakuraStore kalitesiyle seçilen bu özel ürün, tarzınıza şıklık katmak için tasarlandı. Detaylı bilgi için ürünü inceleyebilirsiniz."
                    }}
                  </p>
                </div>

                <div class="flex items-center gap-6 pt-8 border-t border-gray-100">
                  <button
                    @click="store.addToCart(product)"
                    class="flex-grow bg-indigo-900 text-white px-10 py-4 rounded-2xl text-sm font-bold hover:bg-pink-600 transition-all active:scale-95 shadow-lg shadow-indigo-100 uppercase tracking-widest"
                  >
                    Sepete Ekle
                  </button>
                  <router-link
                    :to="`/products/${product.id}`"
                    class="px-8 py-4 rounded-2xl border-2 border-gray-100 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-all text-center uppercase tracking-widest"
                  >
                    Detaylar
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="bg-white rounded-[3rem] p-24 text-center shadow-sm border border-gray-100"
        >
          <div class="flex justify-center mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-28 w-28 text-pink-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 class="text-3xl font-black text-gray-800 mb-4 tracking-tight uppercase">
            Favori Listen Boş
          </h3>
          <router-link
            to="/Allproducts"
            class="inline-block bg-indigo-900 text-white px-12 py-5 rounded-full font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-800 transition-all transform hover:-translate-y-1 uppercase text-sm tracking-widest"
          >
            Alışverişe Başla
          </router-link>
        </div>
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
  if (!imgData) return "https://placehold.co/800x800?text=Resim+Yok";
  let url = Array.isArray(imgData) ? imgData[0] : imgData;
  let cleaned = String(url)
    .replace(/[\[\]"]/g, "")
    .trim();
  if (cleaned.includes("placeimg.com") || !cleaned.startsWith("http")) {
    return "https://placehold.co/800x800?text=Sakura+Store";
  }
  return cleaned;
};
</script>

<style scoped>
.page-wrapper {
  font-family: "Inter", sans-serif;
}
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
