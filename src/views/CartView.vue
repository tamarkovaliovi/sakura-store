<script setup>
import { ref, computed, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useOrderStore } from "@/stores/orderStore";
import Swal from "sweetalert2";

import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Store & Router ---
const store = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

// --- State ---
const locations = ref([]);
const searchQuery = ref("");
const isLocationModalOpen = ref(false);
const viewMode = ref("list");
const selectedLocation = ref(null);
const isLoading = ref(false);
const couponInput = ref("");
const map = ref(null);
let markers = [];

// --- Hızlı Toast Yapılandırması (Donmaz ve Akıcı) ---
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  background: "#fff5f7",
  color: "#d63384",
  iconColor: "#ffb7c5",
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

// --- Computed Properties ---
const subtotal = computed(() => {
  if (!store.cart || !Array.isArray(store.cart)) return 0;
  return store.cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
});

const discountAmount = computed(() => {
  if (!store.appliedCoupon) return 0;
  const couponValue = store.appliedCoupon.value;
  return couponValue < 1 ? subtotal.value * couponValue : couponValue;
});

const finalTotal = computed(() => {
  return Math.max(0, subtotal.value - discountAmount.value);
});

const filteredLocations = computed(() => {
  return locations.value.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// --- Methods ---
const handleApplyCoupon = () => {
  if (!couponInput.value) return;
  const success = store.applyCoupon(couponInput.value.toUpperCase());
  if (success) {
    Toast.fire({ icon: "success", title: "Kupon Uygulandı!" });
    couponInput.value = "";
  } else {
    Toast.fire({ icon: "error", title: "Geçersiz Kupon!" });
  }
};

const handleOrderConfirmation = () => {
  if (!selectedLocation.value) {
    Toast.fire({ icon: "warning", title: "Lütfen Adres Seçin!" });
    fetchLocations();
    return;
  }

  // Siparişi kaydet
  orderStore.addOrder(store.cart, finalTotal.value.toFixed(2));

  // Akıcı Bildirim ve Yönlendirme
  Toast.fire({
    icon: "success",
    title: "Siparişiniz Alındı!",
    text: "Siparişlerim sayfasına aktarılıyorsunuz...",
  });

  // Sepeti temizle
  if (typeof store.clearCart === "function") {
    store.clearCart();
  } else {
    store.cart = [];
  }

  // Bekletmeden hızlıca yönlendir
  setTimeout(() => {
    isLocationModalOpen.value = false;
    router.push("/orders");
  }, 2200);
};

const initMap = async () => {
  await nextTick();
  const mapContainer = document.getElementById("map-container");
  if (!mapContainer) return;

  if (!map.value) {
    map.value = L.map("map-container").setView([39.0, 35.0], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map.value);
  } else {
    setTimeout(() => {
      map.value.invalidateSize();
    }, 100);
  }

  markers.forEach((m) => map.value.removeLayer(m));
  markers = [];

  filteredLocations.value.forEach((loc) => {
    const lat = loc.latitude || 41 + Math.random() * 0.5;
    const lng = loc.longitude || 28.9 + Math.random() * 0.5;

    const marker = L.marker([lat, lng])
      .addTo(map.value)
      .bindPopup(`<b>${loc.name}</b><br>${loc.description}`);

    marker.on("click", () => {
      selectedLocation.value = loc;
    });
    markers.push(marker);
  });

  if (markers.length > 0) {
    const group = new L.featureGroup(markers);
    map.value.fitBounds(group.getBounds().pad(0.1));
  }
};

const fetchLocations = async () => {
  if (locations.value.length > 0) {
    isLocationModalOpen.value = true;
    return;
  }
  isLoading.value = true;
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/locations");
    if (!response.ok) throw new Error("API hatası");
    const data = await response.json();
    locations.value = data;
    isLocationModalOpen.value = true;
  } catch (error) {
    isLocationModalOpen.value = true;
  } finally {
    isLoading.value = false;
  }
};

watch(viewMode, (newMode) => {
  if (newMode === "map") initMap();
});
</script>

<template>
  <div class="page-wrapper relative">
    <Header />

    <main class="max-w-7xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-black text-gray-900 mb-8">Alışveriş Sepetim</h1>

      <div
        v-if="!store.cart || store.cart.length === 0"
        class="text-center py-20 bg-gray-50 rounded-3xl"
      >
        <div class="mb-6 flex justify-center text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-20 w-20"
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
        <h2 class="text-xl font-bold text-gray-500 mb-6">Sepetiniz şu an boş.</h2>
        <RouterLink
          to="/Allproducts"
          class="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 transition"
        >
          Alışverişe Başla
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in store.cart"
            :key="item.id"
            class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
          >
            <img
              :src="item.images?.[0] || 'https://placehold.co/100x100'"
              class="w-24 h-24 object-cover rounded-xl"
            />
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h3 class="font-bold text-gray-900">{{ item.title }}</h3>
                <p class="font-black text-indigo-900">${{ item.price }}</p>
              </div>
              <p class="text-xs text-gray-400 mb-4">{{ item.category?.name }}</p>
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3 bg-gray-50 p-1 rounded-lg">
                  <button
                    @click="
                      item.quantity > 1 ? item.quantity-- : store.removeFromCart(item.id)
                    "
                    class="px-2 font-bold text-gray-500"
                  >
                    -
                  </button>
                  <span class="text-sm font-bold">{{ item.quantity }}</span>
                  <button @click="item.quantity++" class="px-2 font-bold text-gray-500">
                    +
                  </button>
                </div>
                <button
                  @click="store.removeFromCart(item.id)"
                  class="text-red-400 text-xs font-bold hover:text-red-600"
                >
                  Kaldır
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="isLocationModalOpen"
            class="bg-white p-6 rounded-3xl shadow-lg border border-pink-100"
          >
            <div class="flex justify-between mb-4">
              <h2 class="font-bold">Teslimat Noktası Seç</h2>
              <div class="flex gap-2">
                <button
                  @click="viewMode = 'list'"
                  :class="
                    viewMode === 'list' ? 'text-pink-500 font-bold' : 'text-gray-400'
                  "
                >
                  Liste
                </button>
                <button
                  @click="viewMode = 'map'"
                  :class="
                    viewMode === 'map' ? 'text-pink-500 font-bold' : 'text-gray-400'
                  "
                >
                  Harita
                </button>
              </div>
            </div>
            <div
              v-show="viewMode === 'map'"
              id="map-container"
              class="h-64 rounded-2xl mb-4 bg-gray-100"
            ></div>
            <div v-if="viewMode === 'list'" class="max-h-60 overflow-y-auto space-y-2">
              <div
                v-for="loc in filteredLocations"
                :key="loc.id"
                @click="selectedLocation = loc"
                :class="[
                  'p-3 rounded-xl border cursor-pointer transition',
                  selectedLocation?.id === loc.id
                    ? 'bg-pink-50 border-pink-200'
                    : 'bg-gray-50 border-transparent',
                ]"
              >
                <p class="text-sm font-bold">{{ loc.name }}</p>
                <p class="text-[10px] text-gray-400">{{ loc.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div
            class="bg-white p-6 rounded-3xl shadow-xl sticky top-24 border border-gray-50"
          >
            <h3 class="text-xl font-black mb-6">Sipariş Özeti</h3>
            <div class="flex gap-2 mb-6">
              <input
                v-model="couponInput"
                type="text"
                placeholder="Kupon Kodu"
                class="flex-1 p-3 bg-gray-50 rounded-xl text-sm outline-none border focus:border-pink-300"
              />
              <button
                @click="handleApplyCoupon"
                class="bg-indigo-900 text-white px-4 rounded-xl text-xs font-bold"
              >
                Uygula
              </button>
            </div>
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-500">
                <span>Ara Toplam</span
                ><span class="font-bold text-gray-900">${{ subtotal }}</span>
              </div>
              <div v-if="discountAmount > 0" class="flex justify-between text-pink-500">
                <span>İndirim</span
                ><span class="font-black">-${{ discountAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-500">
                <span>Kargo</span><span class="text-green-600 font-bold">Bedava</span>
              </div>
            </div>
            <div class="border-t pt-6 mb-8 flex justify-between items-center">
              <span class="font-bold text-gray-400">TOPLAM</span>
              <span class="text-3xl font-black text-indigo-900"
                >${{ finalTotal.toFixed(2) }}</span
              >
            </div>
            <CustomButton
              mode="checkout"
              @click="handleOrderConfirmation"
              :disabled="isLoading"
              class="w-full mb-3"
            />
            <button
              @click="store.clearCart"
              class="w-full text-gray-400 text-xs font-bold hover:text-red-500 transition"
            >
              Sepeti Temizle
            </button>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
#map-container {
  z-index: 1;
}

.animate-progress {
  animation: progress 3s linear forwards;
}
@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

input:focus {
  box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.1);
}

.animate-progress {
  animation: progress 3s linear forwards;
}
@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.page-wrapper {
  @apply min-h-screen bg-gray-50 flex flex-col;
}
.main-content {
  @apply flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full;
}
.page-title {
  @apply text-3xl font-bold text-gray-900 mb-8;
}
.cart-layout {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-8;
}
.cart-items-section {
  @apply lg:col-span-2 space-y-6;
}
.cart-item-card {
  @apply bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center;
}
.item-image {
  @apply w-24 h-24 object-cover rounded-lg border border-gray-200;
}
.item-details {
  @apply ml-6 flex-1;
}
.item-header {
  @apply flex justify-between items-start;
}
.item-title {
  @apply text-lg font-bold text-gray-900;
}
.item-category {
  @apply text-sm text-gray-500 mt-1;
}
.item-price {
  @apply text-lg font-bold text-blue-900;
}
.item-controls {
  @apply flex justify-between items-center mt-4;
}
.quantity-wrapper {
  @apply flex items-center space-x-3 bg-gray-50 rounded-lg p-1;
}
.location-selection-box {
  @apply bg-white border-2 border-blue-50 rounded-2xl p-6 shadow-xl mt-8;
}
.close-btn {
  @apply text-2xl text-gray-400 hover:text-red-500 transition;
}
.controls-row {
  @apply flex flex-col md:flex-row gap-4 mb-6;
}
.search-bar {
  @apply flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition;
}
.view-btns {
  @apply flex bg-gray-100 p-1 rounded-xl;
}
.view-btns button {
  @apply px-4 py-2 rounded-lg text-sm font-medium transition;
}
.view-btns button.active {
  @apply bg-white shadow-sm text-blue-900;
}
.locations-wrapper.list {
  @apply space-y-3;
}
.locations-wrapper.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
.location-item {
  @apply border border-gray-100 p-4 rounded-xl cursor-pointer transition hover:bg-gray-50 flex justify-between items-center bg-white;
}
.location-item.is-selected {
  @apply border-blue-600 bg-blue-50 ring-1 ring-blue-600;
}
.loc-name {
  @apply block font-bold text-gray-900;
}
.loc-address {
  @apply block text-xs text-gray-500 mt-1;
}
.check-mark {
  @apply text-blue-600 font-bold bg-blue-100 w-6 h-6 flex items-center justify-center rounded-full;
}

.map-container-style {
  @apply w-full h-[400px] rounded-xl border-2 border-gray-100 mb-4;
  z-index: 10;
}

.selection-footer {
  @apply mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4;
}
.final-submit-btn {
  @apply bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition w-full md:w-auto;
}
.summary-card {
  @apply bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4;
}
.summary-title {
  @apply text-lg font-bold text-gray-900 mb-6;
}
.summary-row {
  @apply flex justify-between text-sm text-gray-600 mb-4;
}
.summary-row.total {
  @apply border-t border-gray-100 pt-4 text-lg font-bold text-gray-900;
}
.summary-actions {
  @apply mt-6 space-y-3;
}
.empty-cart-container {
  @apply bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100;
}
.empty-icon-wrapper {
  @apply w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6;
}
.empty-icon {
  @apply h-10 w-10 text-blue-900;
}
.start-shopping-btn {
  @apply inline-block mt-6 bg-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition;
}
.animate-in {
  animation: slideUp 0.4s ease-out;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
