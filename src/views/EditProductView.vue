<template>
  <Header />

  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">
      {{ isEditMode ? "Ürünü Güncelle" : "Yeni Ürün Ekle" }}
    </h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Ürün Başlığı</label>
        <input
          v-model="productData.title"
          type="text"
          required
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Örn: Modern Kulaklık"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Fiyat ($)</label>
        <input
          v-model.number="productData.price"
          type="number"
          required
          min="1"
          class="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Örn: 150"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Açıklama</label>
        <textarea
          v-model="productData.description"
          required
          class="w-full p-2 border border-gray-300 rounded-md"
          rows="3"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Kategori Seçin</label>
        <select
          v-model.number="productData.categoryId"
          required
          class="w-full p-2 border border-gray-300 rounded-md"
        >
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="pt-4">
        <CustomButton
          :mode="isEditMode ? 'add-product-add' : 'add-product-add'"
          :loading="isLoading"
        />
      </div>
    </form>

    <p
      v-if="message"
      :class="isError ? 'text-red-500' : 'text-green-500'"
      class="mt-4 font-semibold"
    >
      {{ message }}
    </p>
  </div>
  <AppFooter />
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import CustomButton from "@/components/CustomButton.vue";
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";

const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const message = ref("");
const isError = ref(false);
const categories = ref([]);
const productId = route.params.id;
const isEditMode = computed(() => !!productId);

const productData = reactive({
  title: "",
  price: 1,
  description: "",
  categoryId: 1,
  images: ["https://picsum.photos/640/480"],
});

onMounted(async () => {
  await fetchCategories();

  if (isEditMode.value) {
    await fetchProductDetails();
  }
});

const fetchCategories = async () => {
  try {
    const res = await fetch("https://api.escuelajs.co/api/v1/categories");
    if (res.ok) {
      categories.value = await res.json();
    }
  } catch (err) {
    console.error("Kategoriler yüklenemedi:", err);
  }
};

const fetchProductDetails = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(`https://api.escuelajs.co/api/v1/products/${productId}`);
    if (!res.ok) {
      throw new Error("Ürün bulunamadı!");
    }
    const data = await res.json();
  } catch (err) {
    isError.value = true;
    message.value = "Hata: Aradığınız ürün mevcut değil veya silinmiş.";
  } finally {
    isLoading.value = false;
  }
};

// Hem Ekleme hem Güncelleme işlemini yöneten ana fonksiyon
const handleSubmit = async () => {
  if (!productData.title || productData.price <= 0) {
    isError.value = true;
    message.value = "Lütfen tüm alanları geçerli şekilde doldurun.";
    return;
  }

  isLoading.value = true;
  isError.value = false;
  message.value = isEditMode.value ? "Ürün güncelleniyor..." : "Ürün kaydediliyor...";

  const url = isEditMode.value
    ? `https://api.escuelajs.co/api/v1/products/${productId}`
    : "https://api.escuelajs.co/api/v1/products/";

  const method = isEditMode.value ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    const result = await response.json();

    if (response.ok) {
      message.value = isEditMode.value
        ? "Ürün başarıyla güncellendi!"
        : `Başarılı! "${result.title}" ürünü eklendi.`;

      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } else {
      isError.value = true;
      message.value = "Hata: " + (result.message || "İşlem başarısız.");
    }
  } catch (error) {
    isError.value = true;
    message.value = "Sunucu hatası!";
    console.error("İşlem Hatası:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
