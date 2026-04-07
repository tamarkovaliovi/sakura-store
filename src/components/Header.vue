<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import CustomButton from "./CustomButton.vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();

// --- Computed Properties ---

const isLoggedIn = computed(() => {
  // DÜZELTME: Artık 'access_token' kullanıyoruz
  return !!authStore.user || !!localStorage.getItem("access_token");
});

const userName = computed(() => authStore.user?.name || "Kullanıcı");
const userRole = computed(() => authStore.user?.role);

const totalQuantity = computed(() => {
  // Cart store içindeki ürünlerin toplam miktarını hesapla
  return cartStore.cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
});

// --- State ---
const searchQuery = ref("");
const isMobileMenuOpen = ref(false);

// --- Lifecycle Hooks ---
onMounted(async () => {
  // DÜZELTME: Token ismi güncellendi
  const token = localStorage.getItem("access_token");

  if (token && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch (error) {
      console.error("Kullanıcı bilgileri çekilemedi:", error);
      localStorage.removeItem("access_token");
    }
  }

  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
});

// --- Methods ---

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

const goToProfile = () => {
  // DÜZELTME: Token ismi güncellendi ve yönlendirme mantığı netleştirildi
  const token = localStorage.getItem("access_token");
  if (token || authStore.user) {
    router.push("/profile");
  } else {
    router.push("/login");
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

// --- Watchers ---
watch(
  () => route.query.search,
  (newSearch) => {
    searchQuery.value = newSearch || "";
  }
);

// Arama kutusu temizlendiğinde sonuçları sıfırla
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
          @click="router.push('/')"
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
              <CustomButton mode="search" />
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-3 md:space-x-6">
          <nav class="hidden md:flex items-center space-x-1 lg:space-x-4">
            <RouterLink
              to="/Allproducts"
              class="text-sm font-bold text-gray-600 hover:text-pink-500 px-3 py-2 rounded-xl transition hover:bg-pink-50"
              >Tüm Ürünler</RouterLink
            >
            <RouterLink
              to="/kategoriler"
              class="text-sm font-bold text-gray-600 hover:text-pink-500 px-3 py-2 rounded-xl transition hover:bg-pink-50"
              >Kategoriler</RouterLink
            >
          </nav>

          <div class="flex items-center space-x-2 md:space-x-4">
            <RouterLink to="/favorites" class="relative group flex items-center">
              <div class="bg-gray-100 p-2 rounded-full group-hover:bg-pink-50 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-600 group-hover:text-pink-500 transition-colors"
                  :class="{
                    'fill-pink-500 text-pink-500': cartStore.favorites?.length > 0,
                  }"
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
                  v-if="cartStore.favorites?.length > 0"
                  class="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-pink-500 text-white text-[9px] font-bold rounded-full border-2 border-white"
                >
                  {{ cartStore.favorites.length }}
                </span>
              </div>
            </RouterLink>

            <div @click="goToProfile" class="flex items-center group cursor-pointer">
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
            </div>

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
