<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div
          class="flex-shrink-0 flex items-center cursor-pointer"
          @click="$router.push('/')"
        >
          <span class="text-2xl font-extrabold text-blue-900 tracking-tight"
            >Sakura<span class="text-orange-500">Store</span></span
          >
        </div>

        <div class="hidden md:flex flex-1 mx-10">
          <div class="relative w-full max-w-xl mx-auto">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              class="w-full bg-gray-100 rounded-full py-2 pl-5 pr-12 border-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition duration-300 placeholder-gray-400 text-sm"
              placeholder="Ürün, kategori veya marka ara..."
            />
            <CustomButoon mode="search" />
          </div>
          <div class="hidden lg:flex items-center">
            <RouterLink
              to="/products"
              class="text-sm font-semibold text-gray-600 hover:text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Tüm Ürünler
            </RouterLink>
          </div>
        </div>

        <div class="flex items-center space-x-6">
          <div class="relative group hidden lg:block">
            <CustomButoon mode="kategoriler" />

            <div
              class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-gray-100"
            >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                >Elektronik</a
              >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                >Giyim</a
              >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900"
                >Aksesuar</a
              >
            </div>
          </div>

          <div class="relative group">
            <RouterLink
              :to="isLoggedIn ? '/profile' : '/login'"
              class="flex items-center text-gray-500 hover:text-blue-900 transition"
            >
              <div class="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div class="hidden xl:block ml-2 text-left">
                <p class="text-xs text-gray-500">Hesabım</p>
                <p class="text-sm font-bold text-gray-800">
                  {{ isLoggedIn ? userName : "Giriş Yap" }}
                </p>
              </div>
            </RouterLink>
          </div>

          <RouterLink to="/cart" class="relative group">
            <div class="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-600 group-hover:text-blue-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <span
              v-if="cart.length > 0"
              class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white"
            >
              {{ cart.length }}
            </span>
            <div class="hidden xl:block absolute top-1 left-10 w-20">
              <p class="text-xs text-gray-500">Sepet</p>
              <p class="text-sm font-bold text-gray-800">${{ cartTotal }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { cart } from "../stores/cart";
import CustomButoon from "./CustomButton.vue";

const router = useRouter();
const searchQuery = ref("");
const isLoggedIn = ref(false);
const userName = ref("");

const cartTotal = computed(() => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
});

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log("Aranan kelime:", searchQuery.value);
    alert("Arama yapıldı: " + searchQuery.value);
  }
};

onMounted(() => {
  const token = localStorage.getItem("user_token");
  const name = localStorage.getItem("user_name");

  if (token && name) {
    isLoggedIn.value = true;
  }
});
</script>
