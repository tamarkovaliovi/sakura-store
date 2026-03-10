<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { addToCart } from "../stores/cart";
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";
import tukendiImage from "@/components/pictures/tukendi.jpg";

const route = useRoute();
const product = ref(null);
const relatedProducts = ref([]);
const loading = ref(true);

const API_BASE_URL = "https://api.escuelajs.co";

/**
 * BOZUK GÖRSEL TEMİZLEME MOTORU
 */
const formatImage = (imgData) => {
  if (!imgData) return "https://placehold.co/600x600?text=Resim+Yok";

  // Veri dizi ise ilk elemanı al, değilse kendisini kullan
  let url = Array.isArray(imgData) ? imgData[0] : imgData;

  // String temizliği (tırnak ve köşeli parantezler)
  let cleaned = String(url)
    .replace(/[\[\]"]/g, "")
    .trim();

  // placeimg.com hatasını engelle veya geçersiz linkleri yakala
  if (cleaned.includes("placeimg.com") || !cleaned.startsWith("http")) {
    return "https://placehold.co/600x600?text=Sakura+Store";
  }

  return cleaned;
};

const fetchData = async (productId) => {
  loading.value = true;
  try {
    const productResponse = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`);
    if (!productResponse.ok) throw new Error("Ürün bulunamadı");

    const productData = await productResponse.json();
    product.value = productData;

    const relatedResponse = await fetch(
      `${API_BASE_URL}/api/v1/categories/${productData.category.id}/products?limit=4`
    );
    const relatedData = await relatedResponse.json();

    relatedProducts.value = relatedData
      .filter((item) => item.id !== productData.id)
      .slice(0, 3);
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

    <div
      v-if="loading"
      class="text-center mt-20 text-xl font-bold text-gray-500 italic animate-pulse"
    >
      🌸 Ürün Yükleniyor...
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
      <div class="bg-white shadow-lg rounded-3xl p-8 mb-12 border border-white">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div class="relative group">
            <img
              :src="formatImage(product.images)"
              class="w-full h-auto rounded-2xl object-cover shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
              :alt="product.title"
              @error="
                (e) =>
                  (e.target.src = 'https://placehold.co/600x600?text=Resim+Yuklenemedi')
              "
            />
          </div>

          <div class="flex flex-col justify-center">
            <h1 class="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
              {{ product.title }}
            </h1>
            <p class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4">
              {{ product.category?.name }}
            </p>

            <p class="text-4xl text-gray-900 font-black mb-6">${{ product.price }}</p>

            <p class="text-gray-600 mb-8 leading-relaxed text-lg">
              {{ product.description }}
            </p>

            <CustomButton
              mode="add-to-cart"
              :product="product"
              @click="addToCart(product)"
              class="w-full md:w-max px-12"
            />
          </div>
        </div>
      </div>

      <div v-if="relatedProducts.length > 0" class="mt-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <span class="w-2 h-8 bg-pink-500 mr-3 rounded-full"></span>
          Bunları da Beğenebilirsiniz
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
            v-for="item in relatedProducts"
            :key="item.id"
            class="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-50"
          >
            <div class="h-48 overflow-hidden rounded-xl mb-4">
              <img
                :src="formatImage(item.images)"
                class="w-full h-full object-cover"
                :alt="item.title"
                @error="
                  (e) => (e.target.src = 'https://placehold.co/400x400?text=SakuraStore')
                "
              />
            </div>

            <h3 class="font-bold text-gray-800 truncate mb-1">{{ item.title }}</h3>
            <p class="text-blue-600 font-extrabold mb-4">${{ item.price }}</p>

            <router-link
              :to="{ name: 'product-details', params: { id: item.id } }"
              class="block w-full text-center border-2 border-pink-500 text-pink-500 py-2 rounded-xl font-bold hover:bg-pink-500 hover:text-white transition-colors"
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
