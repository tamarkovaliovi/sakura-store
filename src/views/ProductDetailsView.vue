<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { addToCart } from "../stores/cart";
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";

const route = useRoute();
const product = ref(null);
const relatedProducts = ref([]);
const loading = ref(true);

// Render/Production uyumluluğu için Base URL tanımlandı
const API_BASE_URL = "https://api.escuelajs.co";

const fetchData = async (productId) => {
  loading.value = true;
  try {
    // 1. Ürün detaylarını çekiyoruz (Tam URL ile)
    const productResponse = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`);

    if (!productResponse.ok) throw new Error("Ürün bulunamadı");

    const productData = await productResponse.json();
    product.value = productData;

    // 2. Benzer ürünleri çekiyoruz
    // Platzi API'de '/related' olmadığı için ürünün kategorisindeki diğer ürünleri çekiyoruz
    const relatedResponse = await fetch(
      `${API_BASE_URL}/api/v1/categories/${productData.category.id}/products?limit=3`
    );
    const relatedData = await relatedResponse.json();

    // Şu anki ürünü listeden filtreleyip geri kalanı gösteriyoruz
    relatedProducts.value = relatedData.filter((item) => item.id !== productData.id);
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    product.value = null;
  } finally {
    loading.value = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

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
  <div class="min-h-screen bg-gray-100 pb-10">
    <Header />

    <div v-if="loading" class="text-center mt-20 text-xl font-bold text-gray-500">
      Ürün Yükleniyor...
    </div>

    <div v-else-if="!product" class="text-center mt-20">
      <h2 class="text-2xl font-bold text-red-600">Hata: Ürün bulunamadı!</h2>
      <p class="text-gray-500 mt-2">
        Aradığınız ürün mevcut olmayabilir veya silinmiş olabilir.
      </p>
      <router-link to="/Allproducts" class="text-blue-900 underline mt-4 inline-block"
        >Tüm Ürünlere Dön</router-link
      >
    </div>

    <div v-else class="max-w-4xl mx-auto mt-10 mb-20 p-6">
      <div class="bg-white shadow-lg rounded-lg p-6 mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              :src="
                product.images && product.images[0]
                  ? product.images[0]
                  : 'https://placehold.co/600x600?text=Resim+Yok'
              "
              class="w-full rounded-lg object-cover shadow-sm"
              alt="Ürün Resmi"
              @error="$event.target.src = 'https://placehold.co/600x600?text=SakuraStore'"
            />
          </div>

          <div class="flex flex-col justify-center">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ product.title }}</h1>

            <p class="text-2xl text-blue-900 font-bold mb-6">${{ product.price }}</p>

            <p class="text-gray-600 mb-8 leading-relaxed">{{ product.description }}</p>

            <CustomButton
              mode="add-to-cart"
              :product="product"
              @click="addToCart(product)"
            />
          </div>
        </div>
      </div>

      <div v-if="relatedProducts.length > 0" class="mt-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-900 pl-3">
          Bunları da Beğenebilirsiniz
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
            v-for="item in relatedProducts"
            :key="item.id"
            class="bg-white p-4 rounded-lg shadow hover:shadow-xl transition duration-300"
          >
            <img
              :src="
                item.images && item.images[0]
                  ? item.images[0]
                  : 'https://placehold.co/400x400?text=SakuraStore'
              "
              class="w-full h-48 object-cover rounded-md mb-4"
              :alt="item.title"
            />

            <h3 class="font-semibold text-gray-800 truncate">{{ item.title }}</h3>
            <p class="text-blue-900 font-bold mt-1">${{ item.price }}</p>

            <router-link
              :to="{ name: 'product-details', params: { id: item.id } }"
              class="mt-4 block w-full text-center border border-blue-900 text-blue-900 py-2 rounded hover:bg-blue-900 hover:text-white transition"
            >
              İncele
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AppFooter />
</template>

<style scoped>
/* Mevcut Tailwind stillerine dokunulmamıştır */
</style>
