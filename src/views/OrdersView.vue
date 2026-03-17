<template>
  <Header />

  <div class="min-h-screen bg-gray-50 py-10 font-sans">
    <div class="max-w-4xl mx-auto px-4">
      <div
        v-if="orderStore.hasOrders"
        class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 animate-fade-in"
      >
        <div>
          <h2 class="text-3xl font-black text-indigo-900 tracking-tight uppercase">
            Siparişlerim
          </h2>
          <p class="text-gray-400 text-sm italic">
            Geçmişten günümüze tüm SakuraStore alışverişleriniz.
          </p>
        </div>

        <div class="flex gap-4">
          <div
            class="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-center"
          >
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Toplam Harcama
            </p>
            <p class="text-xl font-black text-indigo-900">${{ totalSpending }}</p>
          </div>
          <button
            @click="clearHistory"
            class="p-3 bg-white text-gray-400 hover:text-red-500 rounded-2xl shadow-sm border border-gray-100 transition-all hover:scale-110"
            title="Geçmişi Temizle"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        v-if="!orderStore.hasOrders"
        class="bg-white rounded-[2.5rem] p-16 text-center shadow-sm border border-gray-100 animate-fade-in"
      >
        <div class="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-24 w-24 text-pink-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 class="text-2xl font-black text-gray-800 mb-3 tracking-tight">
          HENÜZ SİPARİŞİNİZ YOK
        </h3>
        <p class="text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed">
          SakuraStore koleksiyonuna göz atmak ister misiniz? Harika ürünler seni bekliyor!
        </p>
        <router-link
          to="/"
          class="inline-block bg-indigo-900 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-800 transition-all transform hover:-translate-y-1"
        >
          ALIŞVERİŞE BAŞLA
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="order in orderStore.orders"
          :key="order.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow animate-slide-up"
        >
          <div
            class="bg-gray-50/50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-gray-100"
          >
            <div class="flex gap-10">
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Sipariş No
                </p>
                <p class="text-sm font-bold text-gray-800">#{{ order.id }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Tarih
                </p>
                <p class="text-sm font-semibold text-gray-700">{{ order.date }}</p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Toplam
                </p>
                <p class="text-sm font-black text-indigo-900">${{ order.total }}</p>
              </div>
            </div>
            <div
              class="px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider"
              :class="
                order.statusType === 'status-pending'
                  ? 'status-badge-pending'
                  : 'status-badge-success'
              "
            >
              {{ order.status }}
            </div>
          </div>

          <div class="p-6">
            <div
              v-for="(item, index) in order.items.slice(0, 2)"
              :key="index"
              class="flex justify-between items-center py-3 border-b border-dashed border-gray-100 last:border-0"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-sm shadow-pink-200"
                ></div>
                <span class="text-gray-700 font-medium">{{ item.name }}</span>
                <span class="text-gray-400 text-xs font-bold">x{{ item.quantity }}</span>
              </div>
              <span class="font-bold text-gray-900">${{ item.price }}</span>
            </div>
            <p
              v-if="order.items.length > 2"
              class="text-[10px] text-gray-400 mt-2 font-bold uppercase"
            >
              + {{ order.items.length - 2 }} Ürün Daha...
            </p>
          </div>

          <div class="px-6 py-4 bg-white border-t border-gray-50 text-right">
            <button
              @click="openOrderDetails(order)"
              class="text-pink-500 font-bold text-sm hover:text-pink-600 transition-all flex items-center gap-1 ml-auto group"
            >
              Detayları İncele
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="selectedOrder"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
  >
    <div
      class="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up"
    >
      <div class="bg-indigo-900 p-6 text-white flex justify-between items-center">
        <h3 class="text-xl font-bold uppercase tracking-tighter">Sipariş Detayı</h3>
        <button
          @click="selectedOrder = null"
          class="text-white/80 hover:text-white text-2xl transition-colors"
        >
          ✕
        </button>
      </div>

      <div class="p-8">
        <div class="flex justify-between mb-6 border-b border-gray-100 pb-4">
          <div>
            <p class="text-[10px] font-bold text-gray-400 uppercase">Sipariş No</p>
            <p class="font-bold text-gray-800">#{{ selectedOrder.id }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-bold text-gray-400 uppercase">Tarih</p>
            <p class="font-bold text-gray-800">{{ selectedOrder.date }}</p>
          </div>
        </div>

        <div class="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          <div
            v-for="(item, idx) in selectedOrder.items"
            :key="idx"
            class="group flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-pink-50 transition-all border border-transparent hover:border-pink-100"
          >
            <div class="flex flex-col">
              <router-link
                :to="`/products/${item.id}`"
                class="text-indigo-900 font-bold text-sm hover:text-pink-600 transition-colors flex items-center gap-2"
              >
                {{ item.name }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </router-link>
              <span
                class="text-pink-500 text-[10px] font-black uppercase tracking-widest mt-1"
                >Adet: {{ item.quantity }}</span
              >
            </div>
            <span class="font-black text-indigo-900 text-lg">${{ item.price }}</span>
          </div>
        </div>

        <div
          class="bg-indigo-50 p-5 rounded-2xl flex justify-between items-center border border-indigo-100 shadow-inner"
        >
          <span class="font-bold text-indigo-900 uppercase text-xs tracking-widest"
            >Toplam Tutar</span
          >
          <span class="text-2xl font-black text-indigo-900"
            >${{ selectedOrder.total }}</span
          >
        </div>
      </div>

      <div class="p-6 bg-gray-50 text-center">
        <button
          @click="selectedOrder = null"
          class="w-full bg-indigo-900 text-white py-4 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-indigo-100"
        >
          KAPAT
        </button>
      </div>
    </div>
  </div>

  <AppFooter />
</template>

<script setup>
import { ref, computed } from "vue";
import { useOrderStore } from "@/stores/orderStore";
import Header from "@/components/Header.vue";
import AppFooter from "@/components/AppFooter.vue";

const orderStore = useOrderStore();
const selectedOrder = ref(null);

const openOrderDetails = (order) => {
  selectedOrder.value = order;
};

const totalSpending = computed(() => {
  return orderStore.orders
    .reduce((sum, order) => sum + Number(order.total), 0)
    .toFixed(2);
});

const clearHistory = () => {
  if (
    confirm(
      "Tüm sipariş geçmişinizi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
    )
  ) {
    orderStore.orders = [];
    localStorage.removeItem("sakura_orders");
  }
};
</script>

<style scoped>
.font-sans {
  font-family: "Inter", sans-serif;
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.status-badge-pending {
  background-color: #fffaf0;
  color: #dd6b20;
  font-size: 10px;
  font-weight: 800;
}
.status-badge-success {
  background-color: #f0fff4;
  color: #38a169;
  font-size: 10px;
  font-weight: 800;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e0;
}
</style>
