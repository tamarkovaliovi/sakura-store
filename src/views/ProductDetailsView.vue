<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "@/stores/cart";
import apiClient from "@/services/axios"; // Axios eklendi

import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";
import tukendiImage from "@/components/pictures/tukendi.jpg";

const store = useCartStore();
const route = useRoute();

const product = ref(null);
const relatedProducts = ref([]);
const loading = ref(true);

// --- Methods ---

const formatImage = (imgData) => {
  if (!imgData || (Array.isArray(imgData) && imgData.length === 0)) return tukendiImage;

  let url = Array.isArray(imgData) ? imgData[0] : imgData;
  let cleaned = String(url)
    .replace(/[\[\]"]/g, "")
    .trim();

  // Kapanmış servis (placeimg) veya hatalı URL kontrolü
  const isInvalid =
    cleaned.includes("placeimg.com") ||
    cleaned.includes("any") ||
    !cleaned.startsWith("http");

  return isInvalid ? tukendiImage : cleaned;
};

const fetchData = async (productId) => {
  loading.value = true;
  try {
    // Ürün detaylarını çek (apiClient ile Token otomatik eklenir)
    const productResponse = await apiClient.get(`/products/${productId}`);
    product.value = productResponse.data;

    // Benzer ürünleri aynı kategori üzerinden çek
    const relatedResponse = await apiClient.get(
      `/categories/${product.value.category.id}/products?limit=4`
    );

    relatedProducts.value = relatedResponse.data
      .filter((item) => item.id !== product.value.id)
      .slice(0, 3);
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    product.value = null;
  } finally {
    loading.value = false;
    // Sayfa değiştiğinde en yukarı kaydır
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// --- Lifecycle & Watchers ---

onMounted(() => {
  fetchData(route.params.id);
});

watch(
  () => route.params.id,
  (newId) => {
    fetchData(newId);
  }
);
</script>

<template>
  <div class="page-container bg-gray-50 min-h-screen">
    <Header />

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>🌸 SakuraStore Ürünü Hazırlıyor...</p>
    </div>

    <div v-else-if="!product" class="error-wrapper">
      <div class="error-card">
        <h2>Hata: Ürün bulunamadı!</h2>
        <p>Aradığınız ürün mevcut olmayabilir veya silinmiş olabilir.</p>
        <router-link to="/Allproducts" class="back-link">Tüm Ürünlere Dön</router-link>
      </div>
    </div>

    <div v-else class="content-wrapper max-w-5xl mx-auto p-6 mt-10">
      <div class="product-main-card">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="image-box">
            <img
              :src="formatImage(product.images)"
              :alt="product.title"
              class="product-img"
              @error="(e) => (e.target.src = tukendiImage)"
            />
          </div>

          <div class="info-box">
            <span class="category-tag">{{ product.category?.name }}</span>
            <h1 class="title">{{ product.title }}</h1>
            <p class="price">${{ product.price }}</p>
            <p class="description">{{ product.description }}</p>

            <CustomButton
              mode="add-to-cart"
              :product="product"
              @click="store.addToCart(product)"
              class="w-full md:w-max mt-4"
            />
          </div>
        </div>
      </div>

      <div v-if="relatedProducts.length > 0" class="related-section mt-20">
        <h2 class="section-title">
          <span class="pink-bar"></span> Bunları da Beğenebilirsiniz
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div v-for="item in relatedProducts" :key="item.id" class="item-card">
            <div class="item-img-wrapper">
              <img
                :src="formatImage(item.images)"
                :alt="item.title"
                @error="(e) => (e.target.src = tukendiImage)"
              />
            </div>
            <div class="item-info">
              <h3>{{ item.title }}</h3>
              <p class="item-price">${{ item.price }}</p>
              <router-link
                :to="{ name: 'product-details', params: { id: item.id } }"
                class="detail-btn"
              >
                İncele
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
/* Yükleme ve Hata Alanları */
.loading-state {
  text-align: center;
  margin-top: 5rem;
  color: #6b7280;
  font-weight: bold;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ec4899;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-wrapper {
  text-align: center;
  margin-top: 5rem;
}

.error-card h2 {
  color: #ef4444;
  font-size: 1.5rem;
  font-weight: 800;
}

.back-link {
  color: #1e3a8a;
  text-decoration: underline;
  margin-top: 1rem;
  display: inline-block;
}

/* Ana Ürün Kartı */
.product-main-card {
  background: white;
  border-radius: 2rem;
  padding: 2.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid #ffffff;
}

.product-img {
  width: 100%;
  height: auto;
  border-radius: 1.5rem;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-img:hover {
  transform: scale(1.02);
}

.category-tag {
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 0.5rem;
}

.title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.price {
  font-size: 2.5rem;
  font-weight: 900;
  color: #111827;
  margin: 1rem 0;
}

.description {
  color: #4b5563;
  line-height: 1.7;
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

/* Benzer Ürünler */
.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.pink-bar {
  width: 8px;
  height: 32px;
  background-color: #ec4899;
  margin-right: 12px;
  border-radius: 999px;
}

.item-card {
  background: white;
  padding: 1.25rem;
  border-radius: 1.5rem;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
}

.item-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.item-img-wrapper {
  height: 200px;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
}

.item-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-price {
  color: #2563eb;
  font-weight: 800;
  margin-bottom: 1rem;
}

.detail-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.6rem;
  border: 2px solid #ec4899;
  color: #ec4899;
  border-radius: 0.75rem;
  font-weight: 700;
  transition: all 0.2s;
}

.detail-btn:hover {
  background-color: #ec4899;
  color: white;
}
</style>
