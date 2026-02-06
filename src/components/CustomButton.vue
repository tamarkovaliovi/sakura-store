<script setup>
defineProps({
  mode: String,
  loading: Boolean,
});
defineEmits(["click", "logout"]);
</script>

<template>
  <button
    v-if="mode === 'add'"
    @click="$emit('click')"
    class="absolute bottom-4 right-4 bg-white text-dark p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110 group-hover:bottom-6"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 4v16m8-8H4"
      />
    </svg>
  </button>

  <button
    v-else-if="mode === 'submit'"
    @click="$emit('click')"
    type="submit"
    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none transition duration-300"
  >
    {{ loading ? "Giriş Yapılıyor..." : "Giriş Yap" }}
  </button>

  <button
    v-else-if="mode === 'logout'"
    @click="$emit('click')"
    class="w-full text-left px-6 py-4 text-red-500 hover:bg-red-50 font-medium transition flex items-center group"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 mr-3 text-red-400 group-hover:text-red-600 transition"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
    <slot>Çıkış Yap</slot>
  </button>

  <button
    v-else-if="mode === 'start-shoppingg'"
    @click="$router.push('/products')"
    class="px-8 py-3 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
  >
    <slot>Alışverişe Başla</slot>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 ml-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  </button>

  <button
    v-else-if="mode === 'clear-search'"
    @click="clearSearch"
    class="bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition shadow-lg"
  >
    <slot>Tüm Ürünleri Göster</slot>
  </button>

  <button
    v-else-if="mode === 'register-submit'"
    type="submit"
    class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none transition duration-300"
  >
    {{ loading ? "Kayıt Yapılıyor..." : "Kayıt Ol" }}
  </button>

  <button
    v-else-if="mode === 'incele'"
    class="text-sm font-semibold text-blue-900 hover:text-orange-700"
  >
    <slot>İncele</slot>
  </button>

  <button
    v-else-if="mode === 'start-shopping'"
    @click="scrollToProducts"
    class="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition transform hover:scale-105 shadow-lg"
  >
    <slot>Alışverişe Başla</slot>
  </button>

  <button
    v-else-if="mode === 'addDefault'"
    class="absolute justify-center bottom-4 right-4 bg-white text-dark p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-primary hover:text-white hover:scale-110 group-hover:bottom-6"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 4v16m8-8H4"
      />
    </svg>
  </button>

  <button
    v-else-if="mode === 'search'"
    @click="handleSearch"
    class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </button>

  <button
    v-else-if="mode === 'kategoriler'"
    class="flex items-center text-gray-600 hover:text-blue-900 font-medium transition"
  >
    <slot>kategoriler</slot>
    <svg
      class="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>

  <button
    v-else-if="mode === 'checkout'"
    class="w-full mt-6 bg-blue-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex justify-center items-center"
  >
    <slot>Sepeti Onayla</slot>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 ml-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  </button>

  <button
    v-else-if="mode === 'clear-cart'"
    @click="clearCart"
    class="w-full mt-3 text-sm text-red-500 hover:text-red-700 underline"
  >
    <slot>Sepeti Temizle</slot>
  </button>

  <button
    v-else-if="mode === 'remove-itemfrom-cart'"
    @click="removeFromCart(item.id)"
    class="text-red-500 hover:text-red-700 p-2 transition"
    title="Sil"
  >
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
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  </button>

  <button
    v-else-if="mode === 'increase-quantity'"
    @click="item.quantity++"
    class="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-blue-900 font-bold transition"
  >
    <slot>+</slot>
  </button>

  <button
    v-else-if="mode === 'decrease-quantity'"
    @click="item.quantity > 1 ? item.quantity-- : removeFromCart(item.id)"
    class="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-blue-900 font-bold transition"
  >
    <slot>-</slot>
  </button>

  <button
    v-if="mode === 'add-product-add'"
    :disabled="loading"
    type="submit"
    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    {{ loading ? "Ekleniyor..." : "Ürünü Kaydet" }}
  </button>

  <router-link
    v-if="mode === 'nav-all-products'"
    to="/products"
    class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition duration-200 border border-gray-200 rounded-lg hover:border-blue-300"
  >
    <slot>Tüm Ürünler</slot>
  </router-link>

  <button
    v-if="mode === 'add-to-cart'"
    @click="addToCart(product)"
    class="bg-blue-900 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-800 transition shadow-md"
  >
    <slot>Sepete Ekle</slot>
  </button>
</template>
