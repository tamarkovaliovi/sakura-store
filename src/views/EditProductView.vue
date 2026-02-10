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
    if (!res.ok) throw new Error("Ürün bulunamadı!");

    const data = await res.json();

    productData.title = data.title;
    productData.price = data.price;
    productData.description = data.description;
    productData.categoryId = data.category.id;
  } catch (err) {
    isError.value = true;
    message.value = "Hata: Aradığınız ürün mevcut değil veya silinmiş.";
  } finally {
    isLoading.value = false;
  }
};

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
        router.push("/Allproducts");
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
<template>
  <div class="page-wrapper">
    <Header />

    <main class="main-content">
      <div class="form-container">
        <h1 class="page-title">
          {{ isEditMode ? "Ürünü Güncelle" : "Yeni Ürün Ekle" }}
        </h1>

        <form @submit.prevent="handleSubmit" class="product-form">
          <div class="form-group">
            <label class="form-label">Ürün Başlığı</label>
            <input
              v-model="productData.title"
              type="text"
              required
              class="form-input"
              placeholder="Örn: Modern Kulaklık"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Fiyat ($)</label>
            <input
              v-model.number="productData.price"
              type="number"
              required
              min="1"
              class="form-input"
              placeholder="Örn: 150"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Açıklama</label>
            <textarea
              v-model="productData.description"
              required
              class="form-input"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Kategori Seçin</label>
            <select v-model.number="productData.categoryId" required class="form-input">
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="form-actions">
            <CustomButton
              :mode="isEditMode ? 'add-product-add' : 'add-product-add'"
              :loading="isLoading"
            >
              {{ isEditMode ? "Güncelle" : "Kaydet" }}
            </CustomButton>
          </div>
        </form>

        <p
          v-if="message"
          :class="isError ? 'text-red-600' : 'text-green-600'"
          class="status-message"
        >
          {{ message }}
        </p>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
<style scoped>
.page-wrapper {
  @apply min-h-screen bg-gray-50 flex flex-col;
}

.main-content {
  @apply flex-grow py-12 px-4;
}

.form-container {
  @apply max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100;
}

.page-title {
  @apply text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4;
}

.status-message {
  @apply mt-4 font-semibold text-center p-3 rounded-lg bg-opacity-10;
}

.product-form {
  @apply space-y-6;
}

.form-group {
  @apply flex flex-col gap-1;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none bg-gray-50 focus:bg-white;
}

.form-actions {
  @apply pt-4 flex justify-end;
}
</style>
