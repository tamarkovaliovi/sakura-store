<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>

    <form @submit.prevent="addProduct" class="space-y-4">
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
        <CustomButton mode="add-product-add" :loading="isLoading" />
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
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import CustomButton from "@/components/CustomButton.vue";

const router = useRouter();
const isLoading = ref(false);
const message = ref("");
const isError = ref(false);
const categories = ref([]);

defineProps({
  mode: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const productData = reactive({
  title: "",
  price: 1,
  description: "",
  categoryId: 1,
  images: ["https://picsum.photos/640/480"],
});

onMounted(async () => {
  try {
    const res = await fetch("https://api.escuelajs.co/api/v1/categories");
    if (res.ok) {
      categories.value = await res.json();
      if (categories.value.length > 0) {
        productData.categoryId = categories.value[0].id;
      }
    }
  } catch (err) {
    console.error("Kategoriler yüklenemedi:", err);
  }
});

const addProduct = async () => {
  if (!productData.title || productData.price <= 0) {
    isError.value = true;
    message.value = "Lütfen tüm alanları geçerli şekilde doldurun.";
    return;
  }

  isLoading.value = true;
  isError.value = false;
  message.value = "Ürün kaydediliyor...";

  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const result = await response.json();

    if (response.ok) {
      isError.value = false;
      message.value = `Başarılı! "${result.title}" ürünü eklendi. Yönlendiriliyorsunuz...`;

      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } else {
      isError.value = true;
      message.value = "Hata: " + (result.message || "İşlem başarısız.");
    }
  } catch (error) {
    isError.value = true;
    message.value = "Sunucuya bağlanırken bir hata oluştu!";
    console.error("Post Error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
