<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { addToCart } from "@/stores/cart";

import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";
import tukendiImage from "@/components/pictures/tukendi.jpg";

const products = ref([]);
const loading = ref(true);
const router = useRouter();

const currentPage = ref(1);
const limit = 20;
const selectedCategory = ref(null);
const minPrice = ref("");
const maxPrice = ref("");

const fetchProducts = async () => {
  loading.value = true;
  const offset = (currentPage.value - 1) * limit;
  let url = `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`;
  if (selectedCategory.value !== null) {
    url += `&categoryId=${selectedCategory.value}`;
  }

  if (minPrice.value !== "" && maxPrice.value === "") {
    url += `&price_min=${minPrice.value}&price_max=999999`;
  } else if (minPrice.value === "" && maxPrice.value !== "") {
    url += `&price_min=0&price_max=${maxPrice.value}`;
  } else if (minPrice.value !== "" && maxPrice.value !== "") {
    url += `&price_min=${minPrice.value}&price_max=${maxPrice.value}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    products.value = data;

    if (data.length === 0 && currentPage.value > 1) {
      currentPage.value--;
      await fetchProducts();
    }
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    loading.value = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
const filterByCategory = (id) => {
  selectedCategory.value = id;
  currentPage.value = 1;
  fetchProducts();
};

const clearFilters = () => {
  selectedCategory.value = null;
  minPrice.value = "";
  maxPrice.value = "";
  currentPage.value = 1;
  fetchProducts();
};

const changePage = (step) => {
  if (currentPage.value === 1 && step === -1) return;
  currentPage.value += step;
  fetchProducts();
};

const goToAddProduct = () => {
  router.push("/edit-product");
};

const deleteProduct = async (id) => {
  if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
  try {
    const response = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      products.value = products.value.filter((p) => p.id !== id);
      alert("Ürün başarıyla silindi.");
    }
  } catch (error) {
    console.error("Silme hatası:", error);
  }
};

const formatImage = (imgurl) => {
  if (!imgurl) return tukendiImage;
  let cleaned = imgurl.replace(/["\[\]]/g, "");
  if (!cleaned.startsWith("http")) return tukendiImage;
  return cleaned;
};

onMounted(() => {
  fetchProducts();
});
</script>
<template>
  <div class="page-wrapper">
    <Header />

    <div class="page-header">
      <div class="header-bg-text">
        <span class="bg-text-content"> Sakura </span>
      </div>

      <div class="header-content relative z-10 px-4">
        <h1 class="page-title text-3xl md:text-5xl font-extrabold mb-4">Tüm Ürünler</h1>
        <p class="page-subtitle mb-8">
          En yeni koleksiyonumuzu keşfedin, tarzınızı yansıtan parçaları bulun.
        </p>

        <div
          class="flex justify-center items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-pink-100 max-w-6xl mx-auto flex-wrap"
        >
          <div class="flex items-center gap-2 border-r border-gray-100 pr-4">
            <button
              @click="filterByCategory(null)"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                selectedCategory === null
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-pink-50',
              ]"
            >
              Hepsi
            </button>
            <button
              @click="filterByCategory(1)"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                selectedCategory === 1
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-pink-50',
              ]"
            >
              Giysi
            </button>
            <button
              @click="filterByCategory(2)"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                selectedCategory === 2
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-pink-50',
              ]"
            >
              Elektronik
            </button>
            <button
              @click="filterByCategory(3)"
              :class="[
                'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                selectedCategory === 3
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-pink-50',
              ]"
            >
              Mobilya
            </button>
          </div>

          <div class="flex items-center gap-3 border-r border-gray-100 pr-4 px-2">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-tighter"
              >Fiyat:</span
            >
            <input
              v-model.number="minPrice"
              type="number"
              placeholder="Min $"
              class="w-24 px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-pink-300 outline-none transition-all"
            />
            <span class="text-pink-300 font-bold">-</span>
            <input
              v-model.number="maxPrice"
              type="number"
              placeholder="Max $"
              class="w-24 px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-pink-300 outline-none transition-all"
            />
            <button
              @click="fetchProducts"
              class="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-pink-600 transition-all active:scale-95"
            >
              Uygula
            </button>
            <button
              @click="clearFilters"
              class="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-100"
            >
              Temizle
            </button>
          </div>

          <div class="pl-2">
            <CustomButton mode="add-product-green" @click="goToAddProduct" />
          </div>
        </div>
      </div>
    </div>

    <main class="main-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p class="text-xl">Ürünler yükleniyor...</p>
      </div>

      <div v-else class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card group">
          <div class="card-image-wrapper">
            <img
              v-if="product.images && product.images.length > 0"
              :src="formatImage(product.images[0])"
              :alt="product.title"
              class="card-image"
              @error="$event.target.src = tukendiImage"
            />
          </div>

          <div class="card-actions">
            <router-link
              :to="{ name: 'EditProduct', params: { id: product.id } }"
              class="action-link edit"
            >
              Düzenle
            </router-link>

            <button @click="deleteProduct(product.id)" class="action-link delete">
              Sil
            </button>
          </div>

          <div class="card-body">
            <span class="category-tag">
              {{ product.category.name }}
            </span>

            <h3 class="product-title">
              {{ product.title }}
            </h3>

            <div class="card-footer">
              <span class="product-price">${{ product.price }}</span>
              <CustomButton
                mode="add-to-cart"
                :product="product"
                @click="addToCart(product)"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="flex justify-center items-center gap-6 mt-10 mb-20">
      <button
        @click="changePage(-1)"
        :disabled="currentPage === 1"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        class="pagination-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div class="current-page-badge">
        {{ currentPage }}
      </div>

      <button
        @click="changePage(1)"
        :disabled="products.length < limit"
        :class="{ 'opacity-50 cursor-not-allowed': products.length < limit }"
        class="pagination-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>

    <AppFooter />
  </div>
</template>
<style scoped>
.toolbar-wrapper {
  @apply flex justify-center mt-10 px-4;
}

.toolbar-content {
  @apply flex flex-wrap items-center gap-6 bg-white p-4 rounded-2xl shadow-md border border-gray-100;
}

.toolbar-group {
  @apply flex items-center gap-3 pr-6 border-r border-gray-100 last:border-none last:pr-0;
}

.toolbar-label {
  @apply text-sm font-bold text-gray-400 uppercase tracking-wider;
}

.price-input {
  @apply w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all;
}

.apply-btn {
  @apply px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors;
}

.filter-btn {
  @apply px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-all;
}

.filter-btn.active {
  @apply bg-pink-50 text-pink-600 shadow-sm;
}

.page-wrapper {
  @apply min-h-screen flex flex-col font-sans bg-gray-50;
}

.page-header {
  @apply relative bg-white pt-12 pb-10 px-4 sm:px-6 lg:px-8 text-center shadow-sm overflow-hidden;
}

.header-bg-text {
  @apply absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none;
}

.bg-text-content {
  @apply text-[10rem] font-bold text-blue-400 uppercase tracking-widest transform scale-110;
}

.header-content {
  @apply relative z-10;
}

.page-title {
  @apply text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4;
}

.page-subtitle {
  @apply max-w-2xl mx-auto text-lg text-gray-500 font-light;
}

.main-content {
  @apply flex-grow container mx-auto px-4 py-8;
}

.loading-state {
  @apply text-center text-gray-500 py-20;
}

.spinner {
  @apply animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4;
}

.product-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8;
}

.product-card {
  @apply bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full;
}

.card-image-wrapper {
  @apply relative h-64 overflow-hidden bg-gray-100;
}

.card-image {
  @apply w-full h-full object-cover transform group-hover:scale-110 transition duration-500;
}

.card-actions {
  @apply mt-2 flex items-center justify-between group-hover:px-6 px-4 transition-all duration-300;
}

.action-link {
  @apply text-xs font-medium;
}

.action-link.edit {
  @apply text-blue-500 hover:text-blue-700 underline underline-offset-4;
}

.action-link.delete {
  @apply text-red-500 hover:text-red-700;
}

.card-body {
  @apply p-6 flex flex-col flex-grow;
}

.category-tag {
  @apply text-xs font-bold text-blue-600 uppercase tracking-wider mb-2;
}

.product-title {
  @apply text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-2;
}

.card-footer {
  @apply mt-auto pt-4 flex justify-between items-center border-t border-gray-100;
}

.product-price {
  @apply text-xl font-bold text-gray-900;
}

.pagination-btn {
  @apply flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200;
}

.pagination-btn:active {
  @apply transform scale-95;
}

.pagination-btn:disabled {
  @apply bg-gray-100 text-gray-400 border-gray-100 shadow-none cursor-not-allowed transform-none;
}
.filter-section {
  @apply flex justify-center my-6 px-4;
}
.filter-container {
  @apply flex flex-wrap gap-2 p-2 bg-white rounded-full shadow-sm border border-pink-100;
}
.filter-btn {
  @apply px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-pink-50;
}
.filter-btn.active {
  background-color: #ffb7c5;
  @apply text-white shadow-inner;
}
</style>
