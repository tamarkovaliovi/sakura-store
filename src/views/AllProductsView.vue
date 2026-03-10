<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { addToCart } from "@/stores/cart";

import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";
import tukendiImage from "@/components/pictures/tukendi.jpg";

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const router = useRouter();
const route = useRoute();

const currentPage = ref(1);
const limit = 20;
const selectedCategory = ref(null);
const minPrice = ref("");
const maxPrice = ref("");
const isDropdownOpen = ref(false);

const API_BASE_URL = "https://api.escuelajs.co";

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectCategory = (id) => {
  filterByCategory(id);
  isDropdownOpen.value = false;
};

const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
    const data = await response.json();
    categories.value = data.filter(
      (c) => c.name && !["string", "test", "new"].includes(c.name.toLowerCase())
    );
  } catch (error) {
    console.error("Kategoriler yüklenirken hata oluştu:", error);
  }
};

const fetchProducts = async () => {
  loading.value = true;
  const offset = (currentPage.value - 1) * limit;
  let url = "";

  if (selectedCategory.value !== null && !route.query.search) {
    url = `${API_BASE_URL}/api/v1/categories/${selectedCategory.value}/products?offset=${offset}&limit=${limit}`;
  } else {
    url = `${API_BASE_URL}/api/v1/products?offset=${offset}&limit=${limit}`;

    if (route.query.search) {
      url += `&title=${route.query.search}`;
    }

    if (selectedCategory.value !== null) {
      url += `&categoryId=${selectedCategory.value}`;
    }
  }

  if (minPrice.value !== "" || maxPrice.value !== "") {
    const min = minPrice.value || 0;
    const max = maxPrice.value || 999999;
    url += `&price_min=${min}&price_max=${max}`;
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

watch(
  () => route.query.search,
  () => {
    currentPage.value = 1;
    fetchProducts();
  }
);

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
  router.push("/Allproducts");
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
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
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
  let cleaned = Array.isArray(imgurl) ? imgurl[0] : imgurl;
  cleaned = String(cleaned)
    .replace(/["\[\]]/g, "")
    .trim();
  if (cleaned.includes("placeimg.com") || !cleaned.startsWith("http")) {
    return "https://placehold.co/600x600?text=Sakura+Store";
  }
  return cleaned;
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
});
</script>

<template>
  <div class="page-wrapper">
    <Header />

    <div class="page-header relative overflow-visible z-30 py-6 md:py-12">
      <div class="header-bg-text hidden md:flex">
        <span class="bg-text-content"> Sakura </span>
      </div>

      <div class="header-content relative z-40 px-4 overflow-visible">
        <h1 class="page-title text-2xl md:text-5xl font-extrabold mb-2 md:mb-4">
          Tüm Ürünler
        </h1>

        <p
          v-if="route.query.search"
          class="page-subtitle mb-6 md:mb-8 text-pink-600 font-bold text-sm md:text-base"
        >
          "{{ route.query.search }}" için sonuçlar listeleniyor...
        </p>
        <p v-else class="page-subtitle mb-6 md:mb-8 text-sm md:text-lg">
          En yeni koleksiyonumuzu keşfedin, tarzınızı yansıtan parçaları bulun.
        </p>

        <div
          class="flex flex-col md:flex-row justify-center items-stretch md:items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-pink-100 max-w-6xl mx-auto relative z-50 overflow-visible"
        >
          <div class="relative group z-[100]">
            <button
              @click="toggleDropdown"
              class="w-full flex items-center justify-between md:justify-start gap-3 px-6 py-3 bg-white border-2 border-pink-100 text-pink-600 font-bold rounded-2xl shadow-sm hover:border-pink-300 transition-all active:scale-95"
            >
              <span class="text-xs md:text-sm uppercase tracking-wider">
                {{
                  selectedCategory === null
                    ? "Kategoriler"
                    : categories.find((c) => c.id === selectedCategory)?.name ||
                      "Kategori"
                }}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                :class="{ 'rotate-180': isDropdownOpen }"
                class="w-4 h-4 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <transition name="fade">
              <div
                v-if="isDropdownOpen"
                class="absolute top-full left-0 mt-3 w-full md:w-72 bg-white border border-pink-50 rounded-2xl shadow-2xl z-[1000] max-h-60 md:max-h-96 overflow-y-auto p-2"
              >
                <button
                  @click="selectCategory(null)"
                  :class="
                    selectedCategory === null
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-600 hover:bg-pink-50'
                  "
                  class="w-full text-left px-5 py-3 rounded-xl font-bold transition-all mb-1"
                >
                  Tüm Ürünler
                </button>

                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  @click="selectCategory(cat.id)"
                  :class="
                    selectedCategory === cat.id
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-600 hover:bg-pink-50'
                  "
                  class="w-full text-left px-5 py-3 rounded-xl font-bold transition-all mb-1 truncate"
                >
                  {{ cat.name }}
                </button>
              </div>
            </transition>
          </div>

          <div
            class="flex items-center gap-2 md:gap-3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4 md:px-2"
          >
            <span
              class="hidden sm:inline text-xs font-bold text-gray-400 uppercase tracking-tighter"
              >Fiyat:</span
            >
            <input
              v-model.number="minPrice"
              type="number"
              placeholder="Min"
              class="flex-1 md:w-24 px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-pink-300 outline-none transition-all"
            />
            <span class="text-pink-300 font-bold">-</span>
            <input
              v-model.number="maxPrice"
              type="number"
              placeholder="Max"
              class="flex-1 md:w-24 px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-pink-300 outline-none transition-all"
            />
          </div>

          <div class="flex gap-2 justify-center">
            <CustomButton mode="apply" @click="fetchProducts"> Uygula </CustomButton>
            <CustomButton mode="clear" @click="clearFilters"> Temizle </CustomButton>
          </div>

          <div class="md:pl-2">
            <CustomButton
              mode="add-product-green"
              @click="goToAddProduct"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <main class="main-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p class="text-xl">Ürünler yükleniyor...</p>
      </div>

      <div
        v-else-if="products.length > 0"
        class="product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card group relative z-10"
        >
          <div class="card-image-wrapper relative group h-40 md:h-64">
            <img
              :src="formatImage(product.images)"
              :alt="product.title"
              class="card-image w-full h-full object-cover"
              @error="
                (e) => (e.target.src = 'https://placehold.co/400x400?text=Resim+Yok')
              "
            />

            <div
              class="card-actions-overlay absolute top-2 right-2 flex flex-col gap-2 z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
            >
              <router-link
                :to="{ name: 'EditProduct', params: { id: product.id } }"
                class="icon-btn edit-bg p-1.5 md:p-2"
                title="Düzenle"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-4 h-4 md:w-5 md:h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </router-link>

              <button
                @click="deleteProduct(product.id)"
                class="icon-btn delete-bg p-1.5 md:p-2"
                title="Sil"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-4 h-4 md:w-5 md:h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="card-body p-3 md:p-6">
            <span class="category-tag text-[10px] md:text-xs">{{
              product.category?.name || "Kategori"
            }}</span>
            <h3
              class="product-title font-bold text-gray-900 mb-1 leading-tight line-clamp-1 text-sm md:text-lg"
            >
              {{ product.title }}
            </h3>
            <div
              class="card-footer mt-auto pt-3 md:pt-4 flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-100 gap-2"
            >
              <span class="product-price text-base md:text-xl font-bold text-gray-900"
                >${{ product.price }}</span
              >
              <CustomButton
                mode="add-to-cart"
                :product="product"
                @click="addToCart(product)"
                class="w-full md:w-auto scale-90 md:scale-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center py-10 md:py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 mx-4"
      >
        <div class="text-3xl md:text-5xl mb-4">🔍</div>
        <h2 class="text-xl md:text-2xl font-bold text-gray-800 px-4">
          Aradığınız ürün bulunamadı
        </h2>
        <p class="text-gray-500 mt-2 text-sm md:text-base px-4">
          Farklı bir anahtar kelime veya filtre denemeye ne dersiniz?
        </p>
        <CustomButton mode="clear" class="mt-6" @click="clearFilters"
          >Tüm ürünlere geri dön</CustomButton
        >
      </div>
    </main>

    <div
      v-if="products.length > 0"
      class="flex justify-center items-center gap-4 md:gap-6 mt-6 md:mt-10 mb-20"
    >
      <CustomButton
        mode="pagination"
        direction="left"
        :disabled="currentPage === 1"
        @click="changePage(-1)"
      />
      <div class="current-page-badge w-8 h-8 md:w-10 md:h-10 text-sm md:text-base">
        {{ currentPage }}
      </div>
      <CustomButton
        mode="pagination"
        direction="right"
        :disabled="products.length < limit"
        @click="changePage(1)"
      />
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
.page-wrapper {
  @apply min-h-screen flex flex-col font-sans bg-gray-50;
  overflow-x: hidden;
}
.page-header {
  @apply relative bg-white px-4 text-center shadow-sm;
  overflow: visible !important;
  z-index: 50;
}
.header-bg-text {
  @apply absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none;
  overflow: hidden;
}
.bg-text-content {
  @apply text-[5rem] md:text-[10rem] font-bold text-blue-400 uppercase tracking-widest transform scale-110;
}
.page-title {
  @apply font-extrabold text-gray-900 tracking-tight;
}
.page-subtitle {
  @apply max-w-2xl mx-auto text-gray-500 font-light;
}
.main-content {
  @apply flex-grow container mx-auto px-2 md:px-4;
  position: relative;
  z-index: 10;
}
.product-grid {
  /* Tailwind sınıfları template içinde tanımlandı */
}
.product-card {
  @apply bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative;
  z-index: 10;
}
.card-image-wrapper {
  @apply relative overflow-hidden bg-gray-100 rounded-t-xl;
}
.card-image {
  @apply w-full h-full object-cover transform group-hover:scale-110 transition duration-500;
}
.card-actions-overlay {
  /* Tailwind sınıfları template içinde tanımlandı */
}
.icon-btn {
  @apply rounded-xl shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center;
  background: rgba(255, 255, 255, 0.9);
}
.card-body {
  /* Tailwind sınıfları template içinde tanımlandı */
}
.category-tag {
  @apply font-bold text-blue-600 uppercase tracking-wider mb-1 block;
}
.product-title {
  @apply text-gray-900 leading-tight line-clamp-1;
}
.card-footer {
  /* Tailwind sınıfları template içinde tanımlandı */
}
.product-price {
  @apply font-bold text-gray-900;
}
.current-page-badge {
  @apply flex items-center justify-center bg-pink-500 text-white rounded-full font-bold shadow-md;
}
</style>
