<script setup>
import { ref, onMounted } from "vue";
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import localBanner from "@/components/pictures/home.jpg";
import CustomButton from "@/components/CustomButton.vue";
import { addToCart } from "@/stores/cart";

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
    const response = await fetch(
      "https://api.escuelajs.co/api/v1/products?offset=0&limit=20"
    );
    const data = await response.json();
    products.value = data;
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    loading.value = false;
  }
};

const formatImage = (imgUrl) => {
  if (!imgUrl) return "https://via.placeholder.com/300";
  return imgUrl.replace(/[\[\]"]/g, "");
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
        <img :src="homeImage" alt="Banner" class="hero-image" />
      </div>

      <div class="hero-content">
        <h1 class="hero-title">Tarzını Keşfet</h1>
        <p class="hero-description">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro facere eos ad
          iure pariatur dolor inventore.
        </p>
        <CustomButton mode="start-shopping" @click="scrollToProducts" />
      </div>
    </section>

    <main id="products-section" class="main-content">
      <h2 class="section-title">Yeni Gelenler</h2>

      <div v-if="loading" class="loading-state">
        <p class="text-xl">Ürünler yükleniyor...</p>
      </div>

      <div v-else class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card group">
          <router-link :to="{ name: 'product-details', params: { id: product.id } }">
            <div class="card-image-wrapper">
              <img
                :src="formatImage(product.images[0])"
                :alt="product.title"
                class="card-image"
                @error="$event.target.src = 'https://via.placeholder.com/300'"
              />
            </div>
          </router-link>

          <div class="card-body">
            <span class="category-tag">
              {{ product.category.name }}
            </span>

            <router-link :to="{ name: 'product-details', params: { id: product.id } }">
              <h3 class="product-title">
                {{ product.title }}
              </h3>
            </router-link>

            <span class="product-price">{{ product.price }}$</span>

            <div class="card-footer">
              <div class="flex justify-center">
                <CustomButton
                  mode="add-to-cart"
                  :product="product"
                  @click="addToCart(product)"
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
  @apply relative h-[500px] flex items-center justify-center overflow-hidden;
}

.hero-overlay {
  @apply absolute inset-0 bg-gray-900;
}

.hero-image {
  @apply w-full h-full object-cover opacity-60;
}

.hero-content {
  @apply relative z-10 text-center px-4 max-w-3xl;
}

.hero-title {
  @apply text-4xl md:text-6xl font-bold text-white mb-6;
}

.hero-description {
  @apply text-xl text-gray-200 mb-8;
}

/* Ana İçerik ve Başlıklar */
.main-content {
  @apply flex-grow container mx-auto px-4 py-16;
}

.section-title {
  @apply text-3xl font-bold text-gray-900 mb-8;
}

.loading-state {
  @apply text-center text-gray-500 py-10;
}

/* Ürün Izgarası (Grid) */
.product-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8;
}

/* Ürün Kartı Tasarımı */
.product-card {
  @apply bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 flex flex-col overflow-hidden;
}

.card-image-wrapper {
  @apply relative h-64 overflow-hidden bg-gray-100;
}

.card-image {
  @apply w-full h-full object-cover transform group-hover:scale-110 transition duration-500;
}

.card-body {
  @apply p-4 flex flex-col flex-grow;
}

.category-tag {
  @apply text-xs font-bold text-blue-600 uppercase tracking-wider mb-2;
}

.product-title {
  @apply font-bold text-gray-800 text-lg mb-1 leading-tight line-clamp-2 hover:text-blue-600 transition;
}

.product-price {
  @apply text-xl font-bold text-gray-900;
}

.card-footer {
  @apply mt-auto pt-4 flex flex-col gap-3 border-t border-gray-100;
}
</style>
