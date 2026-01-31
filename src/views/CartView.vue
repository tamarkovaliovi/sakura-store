<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />

    <main class="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Alışveriş Sepetim</h1>

      <div v-if="cart.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
        <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Sepetinizde ürün yok</h2>
        <p class="text-gray-500 mb-8">Hemen alışverişe başlayıp harika ürünleri keşfedin.</p>
        <RouterLink to="/products" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 transition">
          Alışverişe Başla
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-4">
          <div v-for="item in cart" :key="item.id" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center transition hover:shadow-md">
            <img :src="item.images ? item.images[0] : 'https://via.placeholder.com/100'" class="w-24 h-24 object-cover rounded-lg border border-gray-200" alt="Product" />
            
            <div class="ml-6 flex-1">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ item.title }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ item.category?.name || 'Genel' }}</p>
                </div>
                <p class="text-lg font-bold text-blue-900">${{ item.price }}</p>
              </div>

              <div class="flex justify-between items-center mt-4">
                <div class="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                  <CustomButton mode="decrease-quantity" :item="item" />
                  <span class="font-medium text-gray-900">{{ item.quantity }}</span>
                  <CustomButton mode="increase-quantity" :item="item" />
                </div>
                
               <CustomButton mode="remove-itemfrom-cart" :item="item" />
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
            <h3 class="text-lg font-bold text-gray-900 mb-6">Sipariş Özeti</h3>
            
            <div class="space-y-4 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>Ara Toplam</span>
                <span>${{ subtotal }}</span>
              </div>
              <div class="flex justify-between">
                <span>Kargo</span>
                <span class="text-green-600">Bedava</span>
              </div>
              <div class="border-t border-gray-100 pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Toplam</span>
                <span>${{ subtotal }}</span>
              </div>
            </div>

            <CustomButton mode="checkout" />
             <CustomButton mode="clear-cart" />

          </div>
        </div>

      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cart, removeFromCart, clearCart } from '../stores/cart'; 
import Header from '@/components/Header.vue';
import AppFooter from '@/components/AppFooter.vue';
import CustomButton from '@/components/CustomButton.vue';


const subtotal = computed(() => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
});
</script>