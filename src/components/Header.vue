<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCartStore } from "@/stores/cart";
import CustomButoon from "./CustomButton.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const store = useCartStore();

const isLoggedIn = computed(() => !!authStore.user);
const userName = computed(() => authStore.user?.name || "Kullanıcı");
const userRole = computed(() => authStore.user?.role);

const searchQuery = ref("");
const isMobileMenuOpen = ref(false);

onMounted(async () => {
  const token = localStorage.getItem("user_token");
  if (token && !authStore.user) {
    await authStore.fetchUser();
  }

  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
});

const totalQuantity = computed(() => {
  const items = store.cart || [];
  return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
});

const cartTotal = computed(() => {
  const items = store.cart || [];
  return items
    .reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
    .toFixed(2);
});

const handleSearch = () => {
  const query = searchQuery.value.trim();
  const targetQuery = { ...route.query };

  if (query) {
    targetQuery.search = query;
  } else {
    delete targetQuery.search;
  }

  isMobileMenuOpen.value = false;
  router.push({ path: "/Allproducts", query: targetQuery }).catch((err) => {
    if (err.name !== "NavigationDuplicated") console.error(err);
  });
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

watch(
  () => route.query.search,
  (newSearch) => {
    searchQuery.value = newSearch || "";
  }
);

watch(searchQuery, (newVal) => {
  if (newVal === "") handleSearch();
});
</script>
<template>
  <header class="bg-white shadow-md sticky top-0 z-[100]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20 gap-4">
        <div
          class="flex-shrink-0 flex items-center cursor-pointer"
          @click="$router.push('/')"
        >
          <span class="text-xl md:text-2xl font-extrabold text-blue-900 tracking-tight">
            Sakura<span class="text-pink-500">Store</span>
          </span>
        </div>

        <div class="hidden md:flex flex-1 mx-4 lg:mx-10">
          <div class="relative w-full max-w-xl mx-auto flex items-center">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              class="w-full bg-gray-100 rounded-full py-2 pl-5 pr-12 border-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition duration-300 placeholder-gray-400 text-sm"
              placeholder="Ürün ara..."
            />
            <button
              @click.stop="handleSearch"
              class="absolute right-0 top-0 h-full px-4 flex items-center"
            >
              <CustomButoon mode="search" />
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-3 md:space-x-6">
          <nav class="hidden md:flex items-center space-x-1 lg:space-x-4">
            <RouterLink
              to="/Allproducts"
              class="text-sm font-bold text-gray-600 hover:text-pink-500 px-3 py-2 rounded-xl transition hover:bg-pink-50"
            >
              Tüm Ürünler
            </RouterLink>

            <RouterLink
              to="/kategoriler"
              class="text-sm font-bold text-gray-600 hover:text-pink-500 px-3 py-2 rounded-xl transition hover:bg-pink-50"
            >
              Kategoriler
            </RouterLink>
          </nav>

          <div class="flex items-center space-x-2 md:space-x-4">
            <RouterLink to="/favorites" class="relative group flex items-center">
              <div class="bg-gray-100 p-2 rounded-full group-hover:bg-pink-50 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-600 group-hover:text-pink-500 transition-colors"
                  :class="{ 'fill-pink-500 text-pink-500': store.favorites.length > 0 }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span
                  v-if="store.favorites.length > 0"
                  class="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-pink-500 text-white text-[9px] font-bold rounded-full border-2 border-white"
                >
                  {{ store.favorites.length }}
                </span>
              </div>
            </RouterLink>

            <RouterLink
              :to="isLoggedIn ? '/profile' : '/login'"
              class="flex items-center group"
            >
              <div class="bg-gray-100 p-2 rounded-full group-hover:bg-pink-50 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-600 group-hover:text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </RouterLink>

            <RouterLink to="/cart" class="relative group flex items-center">
              <div class="bg-gray-100 p-2 rounded-full group-hover:bg-pink-50 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-600 group-hover:text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span
                  v-if="totalQuantity > 0"
                  class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white"
                >
                  {{ totalQuantity }}
                </span>
              </div>
            </RouterLink>

            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden p-2 text-gray-600 focus:outline-none"
            >
              <svg
                v-if="!isMobileMenuOpen"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
      >
        <div class="p-4 space-y-4">
          <div class="relative flex items-center">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              class="w-full bg-gray-100 rounded-xl py-3 px-4 border-none text-sm"
              placeholder="Ürün ara..."
            />
            <button
              @click="handleSearch"
              class="absolute right-3 text-pink-500 font-bold text-sm"
            >
              Ara
            </button>
          </div>
          <nav class="grid grid-cols-1 gap-2">
            <RouterLink
              to="/Allproducts"
              @click="isMobileMenuOpen = false"
              class="p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-pink-50 flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-pink-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Tüm Ürünler
            </RouterLink>

            <RouterLink
              to="/favorites"
              @click="isMobileMenuOpen = false"
              class="p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-pink-50 flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Favorilerim ({{ store.favorites.length }})
            </RouterLink>

            <RouterLink
              to="/kategoriler"
              @click="isMobileMenuOpen = false"
              class="p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-pink-50 flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              Kategorileri Yönet
            </RouterLink>
          </nav>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
