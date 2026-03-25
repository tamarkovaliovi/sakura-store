<script setup>
import { ref, onMounted } from "vue";
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import localBanner from "@/components/pictures/home.jpg";
import tukendiImage from "@/components/pictures/tukendi.jpg";
import CustomButton from "@/components/CustomButton.vue";

import apiClient from "@/services/axios";
import { useCartStore } from "@/stores/cart";

const store = useCartStore();

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
    const response = await apiClient.get("/products?offset=0&limit=20");
    products.value = response.data;
  } catch (error) {
    console.error("Ürünler yüklenirken hata oluştu:", error);
  } finally {
    loading.value = false;
  }
};

const formatImage = (imgUrl) => {
  if (!imgUrl) return tukendiImage;
  let url = Array.isArray(imgUrl) ? imgUrl[0] : imgUrl;
  let cleaned = String(url)
    .replace(/[\[\]"]/g, "")
    .trim();
  if (!cleaned || !cleaned.startsWith("http")) {
    return "https://placehold.co/600x600?text=Gorsel+Yok";
  }
  return cleaned;
};

onMounted(() => {
  fetchProducts();
});
</script>
<template>
  <div class="page-wrapper">
    <Header />

    <section class="hero-section">
      <div class="hero-overlay">
        <img
          :src="homeImage"
          alt="SakuraStore Banner"
          class="hero-image"
          @error="
            (e) =>
              (e.target.src = 'https://placehold.co/1200x500?text=SakuraStore+Banner')
          "
        />
      </div>

      <div class="hero-content">
        <h1 class="hero-title">Tarzını Keşfet</h1>
        <p class="hero-description">
          SakuraStore ile en yeni trendleri ve size özel koleksiyonları keşfedin. Kalite
          ve estetik tek adreste.
        </p>
        <CustomButton mode="start-shopping" @click="scrollToProducts" />
      </div>
    </section>

    <main id="products-section" class="main-content p-6">
      <h2 class="section-title text-2xl font-bold mb-6">Yeni Gelenler</h2>

      <div v-if="loading" class="loading-state">
        <div class="animate-pulse text-xl font-semibold text-gray-400 text-center py-10">
          Ürünler hazırlanıyor...
        </div>
      </div>

      <div
        v-else
        class="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card group border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all relative bg-white"
        >
          <button
            @click="store.toggleFavorite(product)"
            class="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 transition-colors"
              :class="
                store.isFavorite(product.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-400'
              "
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          <router-link :to="{ name: 'product-details', params: { id: product.id } }">
            <div class="card-image-wrapper h-64 overflow-hidden">
              <img
                :src="formatImage(product.images)"
                :alt="product.title"
                class="card-image w-full h-full object-cover group-hover:scale-105 transition-transform"
                @error="
                  (e) =>
                    (e.target.src = 'https://placehold.co/400x400?text=Resim+Bulunamadi')
                "
              />
            </div>
          </router-link>

          <div class="card-body p-4">
            <span
              class="category-tag text-xs font-medium text-pink-500 uppercase tracking-wider"
            >
              {{ product.category?.name || "Genel" }}
            </span>

            <router-link :to="{ name: 'product-details', params: { id: product.id } }">
              <h3 class="product-title font-semibold text-gray-800 mt-1 truncate">
                {{ product.title }}
              </h3>
            </router-link>

            <span class="product-price block mt-2 text-lg font-bold text-gray-900"
              >{{ product.price }}$</span
            >

            <div class="card-footer mt-4">
              <div class="flex justify-center">
                <CustomButton
                  mode="add-to-cart"
                  :product="product"
                  @click="store.addToCart(product)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
<style scoped>
.page-wrapper {
  @apply min-h-screen flex flex-col font-sans bg-gray-50;
}

/* Hero (Banner) Alanı */
.hero-section {
  @apply relative h-[500px] flex items-center justify-center overflow-hidden bg-gray-200;
}

.hero-overlay {
  @apply absolute inset-0 bg-black;
}

.hero-image {
  @apply w-full h-full object-cover opacity-70;
}

.hero-content {
  @apply relative z-10 text-center px-4 max-w-3xl;
}

.hero-title {
  @apply text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg;
}

.hero-description {
  @apply text-xl text-gray-100 mb-8 drop-shadow;
}

/* Ana İçerik */
.main-content {
  @apply flex-grow container mx-auto px-4 py-16;
}

.section-title {
  @apply text-3xl font-bold text-gray-900 mb-10 text-center md:text-left;
}

.loading-state {
  @apply text-center py-20;
}

/* Ürün Izgarası */
.product-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8;
}

/* Ürün Kartı */
.product-card {
  @apply bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 flex flex-col overflow-hidden border border-gray-100;
}

.card-image-wrapper {
  @apply relative h-72 overflow-hidden bg-gray-50;
}

.card-image {
  @apply w-full h-full object-cover transform group-hover:scale-105 transition duration-700;
}

.card-body {
  @apply p-5 flex flex-col flex-grow;
}

.category-tag {
  @apply text-[10px] font-extrabold text-blue-500 uppercase tracking-widest mb-2;
}

.product-title {
  @apply font-bold text-gray-800 text-lg mb-2 leading-tight line-clamp-2 hover:text-blue-600 transition;
}

.product-price {
  @apply text-2xl font-black text-gray-900 mb-4;
}

.card-footer {
  @apply mt-auto pt-4 flex flex-col gap-3 border-t border-gray-50;
}
</style>
