<script setup>
import { computed } from "vue";
import { cart, removeFromCart, clearCart } from "@/stores/cart"; // Store yolunun doğru olduğundan emin ol

import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";
import CustomButton from "@/components/CustomButton.vue";

const subtotal = computed(() => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
});
</script>
<template>
  <div class="page-wrapper">
    <Header />

    <main class="main-content">
      <h1 class="page-title">Alışveriş Sepetim</h1>

      <div v-if="cart.length === 0" class="empty-cart-container">
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

        <RouterLink to="/Allproducts" class="start-shopping-btn">
          Alışverişe Başla
        </RouterLink>
      </div>

      <div v-else class="cart-layout">
        <div class="cart-items-section">
          <div v-for="item in cart" :key="item.id" class="cart-item-card">
            <img
              :src="item.images ? item.images[0] : 'https://via.placeholder.com/100'"
              class="item-image"
              alt="Product"
            />

            <div class="item-details">
              <div class="item-header">
                <div>
                  <h3 class="item-title">{{ item.title }}</h3>
                  <p class="item-category">
                    {{ item.category?.name || "Genel" }}
                  </p>
                </div>
                <p class="item-price">${{ item.price }}</p>
              </div>

              <div class="item-controls">
                <div class="quantity-wrapper">
                  <CustomButton
                    mode="decrease-quantity"
                    :item="item"
                    @click="item.quantity > 1 ? item.quantity-- : removeFromCart(item.id)"
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
                  @click="removeFromCart(item.id)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="summary-section">
          <div class="summary-card">
            <h3 class="summary-title">Sipariş Özeti</h3>

            <div class="summary-details">
              <div class="summary-row">
                <span>Ara Toplam</span>
                <span>${{ subtotal }}</span>
              </div>
              <div class="summary-row">
                <span>Kargo</span>
                <span class="text-green-600">Bedava</span>
              </div>
              <div class="summary-row total">
                <span>Toplam</span>
                <span>${{ subtotal }}</span>
              </div>
            </div>

            <div class="summary-actions">
              <CustomButton mode="checkout" />
              <CustomButton mode="clear-cart" @click="clearCart()" />
            </div>
          </div>
        </div>
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
  @apply flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full;
}

.page-title {
  @apply text-3xl font-bold text-gray-900 mb-8;
}

.empty-cart-container {
  @apply bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100;
}

.empty-icon-wrapper {
  @apply w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6;
}

.empty-icon {
  @apply h-10 w-10 text-blue-900;
}

.empty-title {
  @apply text-xl font-bold text-gray-900 mb-2;
}

.empty-description {
  @apply text-gray-500 mb-8;
}

.start-shopping-btn {
  @apply inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 transition;
}

.cart-layout {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-8;
}

.cart-items-section {
  @apply lg:col-span-2 space-y-4;
}

.cart-item-card {
  @apply bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center transition hover:shadow-md;
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

.quantity-text {
  @apply font-medium text-gray-900;
}

.summary-section {
  @apply lg:col-span-1;
}

.summary-card {
  @apply bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4;
}

.summary-title {
  @apply text-lg font-bold text-gray-900 mb-6;
}

.summary-details {
  @apply space-y-4 text-sm text-gray-600;
}

.summary-row {
  @apply flex justify-between;
}

.summary-row.total {
  @apply border-t border-gray-100 pt-4 flex justify-between items-center text-lg font-bold text-gray-900;
}

.summary-actions {
  @apply mt-6 space-y-3;
}
</style>
