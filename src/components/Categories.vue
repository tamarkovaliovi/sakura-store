<template>
  <AppHeader />

  <div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl font-extrabold text-blue-900 mb-8 flex items-center">
        <span class="mr-3 text-pink-500"></span> SakuraStore - Kategori Yönetimi
      </h1>

      <div class="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <h3 class="text-lg font-bold text-gray-800 mb-4">
          {{ isEditing ? "Kategoriyi Güncelle" : "Yeni Kategori Ekle" }}
        </h3>

        <div class="flex flex-col md:flex-row gap-4">
          <input
            v-model="categoryForm.name"
            placeholder="Kategori Adı"
            type="text"
            class="flex-1 p-3 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-900 outline-none transition"
          />
          <input
            v-model="categoryForm.image"
            placeholder="Resim URL (https://...)"
            type="text"
            class="flex-1 p-3 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-900 outline-none transition"
          />
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="isEditing ? updateCategory() : createCategory()"
            :class="
              isEditing
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-green-600 hover:bg-green-700'
            "
            class="px-6 py-2.5 text-white font-bold rounded-xl transition duration-300 shadow-md"
          >
            {{ isEditing ? "Güncelle" : "Ekle" }}
          </button>
          <button
            v-if="isEditing"
            @click="resetForm"
            class="bg-gray-500 hover:bg-gray-600 px-6 py-2.5 text-white font-bold rounded-xl transition duration-300 shadow-md"
          >
            Vazgeç
          </button>
        </div>
      </div>

      <hr class="border-gray-100 mb-10" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col"
        >
          <img
            :src="formatCategoryImage(cat.image)"
            :alt="cat.name"
            class="w-full h-40 object-cover rounded-xl mb-4 bg-gray-100"
            @error="
              (e) => (e.target.src = 'https://placehold.co/600x400?text=Resim+Bulunamadi')
            "
          />
          <div class="text-center flex-grow">
            <h4 class="font-bold text-gray-900 text-lg mb-1">{{ cat.name }}</h4>
            <p class="text-gray-400 text-xs mb-4 uppercase tracking-widest font-semibold">
              ID: {{ cat.id }}
            </p>
          </div>

          <div class="flex gap-2 border-t pt-4 mt-2">
            <button
              @click="prepareEdit(cat)"
              class="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-bold hover:bg-blue-100 transition"
            >
              Düzenle
            </button>
            <button
              @click="deleteCategory(cat.id)"
              class="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100 transition"
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AppFooter />
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

import AppHeader from "../components/Header.vue";
import AppFooter from "../components/AppFooter.vue";

const categories = ref([]);
const isEditing = ref(false);
const apiUrl = "/api/v1/categories";
const categoryForm = ref({
  id: null,
  name: "",
  image: "",
});

// Resim URL'sini temizleyen fonksiyon
const formatCategoryImage = (url) => {
  if (!url) return "https://placehold.co/600x400?text=Resim+Yok";
  // Bazı URL'ler ["url"] şeklinde dizi gibi gelebiliyor, onları temizler
  let cleaned = url.replace(/[\[\]"]/g, "");
  return cleaned;
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(apiUrl);
    // Konsoldaki hatalara sebep olan "string" isimli test verilerini filtreliyoruz
    categories.value = response.data.filter(
      (c) => c.name && c.name !== "string" && c.name !== "New Category"
    );
  } catch (error) {
    console.error("Kategoriler yüklenirken hata:", error);
  }
};

const createCategory = async () => {
  if (!categoryForm.value.name || !categoryForm.value.image)
    return alert("Lütfen tüm alanları doldurun.");
  try {
    await axios.post(apiUrl, {
      name: categoryForm.value.name,
      image: categoryForm.value.image,
    });
    fetchCategories();
    resetForm();
  } catch (error) {
    console.error("Ekleme hatası:", error);
  }
};

const prepareEdit = (category) => {
  isEditing.value = true;
  categoryForm.value = {
    id: category.id,
    name: category.name,
    image: formatCategoryImage(category.image),
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const updateCategory = async () => {
  try {
    await axios.put(`${apiUrl}/${categoryForm.value.id}`, {
      name: categoryForm.value.name,
      image: categoryForm.value.image,
    });
    fetchCategories();
    resetForm();
  } catch (error) {
    console.error("Güncelleme hatası:", error);
  }
};

const deleteCategory = async (id) => {
  if (confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchCategories();
    } catch (error) {
      alert("Bu kategori silinemez (Bağlı ürünler olabilir).");
    }
  }
};

const resetForm = () => {
  categoryForm.value = { id: null, name: "", image: "" };
  isEditing.value = false;
};

onMounted(() => {
  fetchCategories();
});
</script>
