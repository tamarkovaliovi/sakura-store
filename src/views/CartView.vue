<script setup>
import { ref, computed, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useOrderStore } from "@/stores/orderStore";

import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const store = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

const locations = ref([]);
const searchQuery = ref("");
const isLocationModalOpen = ref(false);
const viewMode = ref("list");
const selectedLocation = ref(null);
const isLoading = ref(false);
const isOrderSuccess = ref(false); // Pop-up kontrolü için

const map = ref(null);
const markers = [];

const subtotal = computed(() => {
  if (!store.cart || !Array.isArray(store.cart)) return 0;
  return store.cart.reduce((total, item) => total + item.price * item.quantity, 0);
});

// Siparişi Onayla ve Bitir Fonksiyonu
const handleOrderConfirmation = () => {
  // Eğer lokasyon seçilmediyse önce lokasyon seçtir
  if (!selectedLocation.value) {
    fetchLocations();
    return;
  }

  // 1. Siparişi OrderStore'a kaydet
  orderStore.addOrder(store.cart, subtotal.value);

  // 2. Başarı Pop-up'ını göster
  isOrderSuccess.value = true;

  // 3. Sepeti temizle
  if (store.clearCart) {
    store.clearCart();
  } else {
    store.cart = [];
  }

  // 4. Kısa bir süre sonra yönlendir
  setTimeout(() => {
    isOrderSuccess.value = false;
    isLocationModalOpen.value = false;
    router.push("/orders");
  }, 3000);
};

const initMap = async () => {
  await nextTick();
  if (!map.value) {
    map.value = L.map("map-container").setView([39.0, 35.0], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map.value);
  }

  markers.forEach((m) => map.value.removeLayer(m));
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

watch(viewMode, (newMode) => {
  if (newMode === "map") {
    initMap();
  }
});

const fetchLocations = async () => {
  if (locations.value.length > 0) {
    isLocationModalOpen.value = true;
    return;
  }
  isLoading.value = true;
  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/locations");
    if (!response.ok) throw new Error("API isteği başarısız.");
    const data = await response.json();
    locations.value = data;
    isLocationModalOpen.value = true;
  } catch (error) {
    console.error("Lokasyonlar yüklenemedi:", error);
  } finally {
    isLoading.value = false;
  }
};

const filteredLocations = computed(() => {
  return locations.value.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="page-wrapper relative">
    <Header />

    <div
      v-if="isOrderSuccess"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300"
      >
        <div
          class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Harika!</h2>
        <p class="text-gray-500 mb-6">
          Siparişiniz başarıyla alındı. Siparişlerim sayfasına yönlendiriliyorsunuz...
        </p>
        <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div class="bg-green-500 h-full animate-progress"></div>
        </div>
      </div>
    </div>

    <main class="main-content">
      <h1 class="page-title">Alışveriş Sepetim</h1>

      <div v-if="!store.cart || store.cart.length === 0" class="empty-cart-container">
        <div class="empty-icon-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="empty-icon"
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
        <h2 class="empty-title">Sepetinizde ürün yok</h2>
        <p class="empty-description">
          Hemen alışverişe başlayıp harika ürünleri keşfedin.
        </p>
        <RouterLink to="/Allproducts" class="start-shopping-btn"
          >Alışverişe Başla</RouterLink
        >
      </div>

      <div v-else class="cart-layout">
        <div class="cart-items-section">
          <div v-for="item in store.cart" :key="item.id" class="cart-item-card">
            <img
              :src="
                item.images && item.images[0]
                  ? item.images[0]
                  : 'https://placehold.co/100x100?text=No+Image'
              "
              class="item-image"
              alt="Product"
            />
            <div class="item-details">
              <div class="item-header">
                <div>
                  <h3 class="item-title">{{ item.title }}</h3>
                  <p class="item-category">{{ item.category?.name || "Genel" }}</p>
                </div>
                <p class="item-price">${{ item.price }}</p>
              </div>
              <div class="item-controls">
                <div class="quantity-wrapper">
                  <CustomButton
                    mode="decrease-quantity"
                    :item="item"
                    @click="
                      item.quantity > 1 ? item.quantity-- : store.removeFromCart(item.id)
                    "
                  />
                  <span class="quantity-text">{{ item.quantity }}</span>
                  <CustomButton
                    mode="increase-quantity"
                    :item="item"
                    @click="item.quantity++"
                  />
                </div>
                <CustomButton
                  mode="remove-itemfrom-cart"
                  :item="item"
                  @click="store.removeFromCart(item.id)"
                />
              </div>
            </div>
          </div>

          <div v-if="isLocationModalOpen" class="location-selection-box animate-in">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-900">Teslimat Noktası Seçin</h2>
              <button @click="isLocationModalOpen = false" class="close-btn">
                &times;
              </button>
            </div>
            <div class="controls-row">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Konum veya adres ara..."
                class="search-bar"
              />
              <div class="view-btns">
                <button
                  @click="viewMode = 'list'"
                  :class="{ active: viewMode === 'list' }"
                >
                  Liste
                </button>
                <button
                  @click="viewMode = 'grid'"
                  :class="{ active: viewMode === 'grid' }"
                >
                  Kartlar
                </button>
                <button @click="viewMode = 'map'" :class="{ active: viewMode === 'map' }">
                  Harita
                </button>
              </div>
            </div>

            <div
              v-show="viewMode === 'map'"
              id="map-container"
              class="map-container-style"
            ></div>

            <div v-if="viewMode !== 'map'" :class="['locations-wrapper', viewMode]">
              <div
                v-for="loc in filteredLocations"
                :key="loc.id"
                @click="selectedLocation = loc"
                :class="[
                  'location-item',
                  { 'is-selected': selectedLocation?.id === loc.id },
                ]"
              >
                <div class="loc-info">
                  <span class="loc-name">{{ loc.name }}</span>
                  <span class="loc-address">{{ loc.description }}</span>
                </div>
                <div v-if="selectedLocation?.id === loc.id" class="check-mark">✓</div>
              </div>
            </div>

            <div v-if="selectedLocation" class="selection-footer">
              <p>
                Seçilen Mağaza: <strong>{{ selectedLocation.name }}</strong>
              </p>
            </div>
          </div>
        </div>

        <div class="summary-section">
          <div class="summary-card">
            <h3 class="summary-title">Sipariş Özeti</h3>
            <div class="summary-details">
              <div class="summary-row">
                <span>Ara Toplam</span><span>${{ subtotal }}</span>
              </div>
              <div class="summary-row">
                <span>Kargo</span><span class="text-green-600">Bedava</span>
              </div>
              <div class="summary-row total">
                <span>Toplam</span><span>${{ subtotal }}</span>
              </div>
            </div>

            <div
              v-if="selectedLocation"
              class="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100"
            >
              <p class="text-[10px] text-blue-400 uppercase font-bold mb-1">
                Teslimat Noktası
              </p>
              <p class="text-sm font-bold text-blue-900">{{ selectedLocation.name }}</p>
            </div>

            <div class="summary-actions">
              <CustomButton
                mode="checkout"
                @click="handleOrderConfirmation"
                :disabled="isLoading"
              />
              <CustomButton
                mode="clear-cart"
                @click="store.clearCart ? store.clearCart() : (store.cart = [])"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
/* Progress bar animasyonu için basit CSS */
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
