<script setup>
import { ref, onMounted } from "vue";
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import localBanner from "@/components/pictures/home.jpg";
import tukendiImage from "@/components/pictures/tukendi.jpg";
import CustomButton from "@/components/CustomButton.vue";
import { addToCart } from "@/stores/cart";

const homeImage = localBanner;
const products = ref([]);
const loading = ref(true);

// API Base URL (HTTPS olduğundan emin oluyoruz)
const API_BASE_URL = "https://api.escuelajs.co";

const scrollToProducts = () => {
  const element = document.getElementById("products-section");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const fetchProducts = async () => {
  try {
    // API isteği limitli ve güvenli
    const response = await fetch(`${API_BASE_URL}/api/v1/products?offset=0&limit=20`);
    if (!response.ok) throw new Error("Veri çekilemedi");
    const data = await response.json();
    products.value = data;
  } catch (error) {
    console.error("Ürünler yüklenirken hata oluştu:", error);
  } finally {
    loading.value = false;
  }
};

/**
 * API'den gelen bozuk resim URL'lerini temizler.
 * [ "url" ] gibi gelen dizileri veya tırnak işaretlerini ayıklar.
 */
const formatImage = (imgUrl) => {
  if (!imgUrl) return tukendiImage;

  // Eğer veri dizi olarak geldiyse ilkini al
  let url = Array.isArray(imgUrl) ? imgUrl[0] : imgUrl;

  // Gereksiz karakterleri temizle (Vite/Render uyumu için kritik)
  let cleaned = String(url)
    .replace(/[\[\]"]/g, "")
    .trim();

  // Eğer temizlenen URL boşsa veya geçerli bir link değilse varsayılan resmi dön
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

    <main id="products-section" class="main-content">
      <h2 class="section-title">Yeni Gelenler</h2>

      <div v-if="loading" class="loading-state">
        <div class="animate-pulse text-xl font-semibold text-gray-400">
          Ürünler hazırlanıyor...
        </div>
      </div>

      <div v-else class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card group">
          <router-link :to="{ name: 'product-details', params: { id: product.id } }">
            <div class="card-image-wrapper">
              <img
                :src="formatImage(product.images)"
                :alt="product.title"
                class="card-image"
                @error="
                  (e) =>
                    (e.target.src = 'https://placehold.co/400x400?text=Resim+Bulunamadi')
                "
              />
            </div>
          </router-link>

          <div class="card-body">
            <span class="category-tag">
              {{ product.category?.name || "Genel" }}
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
