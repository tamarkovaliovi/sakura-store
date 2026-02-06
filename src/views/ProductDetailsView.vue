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

const fetchData = async (productId) => {
  loading.value = true;
  try {
    const productResponse = await fetch(
      `https://api.escuelajs.co/api/v1/products/${productId}`
    );
    product.value = await productResponse.json();

    const relatedResponse = await fetch(
      `https://api.escuelajs.co/api/v1/products/${productId}/related`
    );
    relatedProducts.value = await relatedResponse.json();
  } catch (error) {
    console.error("Veri çekme hatası:", error);
  } finally {
    loading.value = false;
    window.scrollTo(0, 0);
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

    <div v-else-if="product" class="max-w-4xl mx-auto mt-10 mb-20 p-6">
      <div class="bg-white shadow-lg rounded-lg p-6 mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              :src="product.images[0]"
              class="w-full rounded-lg object-cover shadow-sm"
              alt="Ürün Resmi"
            />
          </div>

          <div class="flex flex-col justify-center">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ product.title }}</h1>

            <p class="text-2xl text-blue-900 font-bold mb-6">${{ product.price }}</p>

            <p class="text-gray-600 mb-8 leading-relaxed">{{ product.description }}</p>

            <CustomButton mode="add-to-cart" :product="product" />
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
              :src="item.images[0]"
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
