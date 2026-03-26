import { defineStore } from 'pinia';

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    // LocalStorage'dan verileri çek, yoksa boş dizi başlat
    orders: JSON.parse(localStorage.getItem('sakura_orders') || '[]'),
  }),
  
  getters: {
    hasOrders: (state) => state.orders.length > 0,
  },

  actions: {
    /**
     * @param {Array} cartItems - Sepetteki ürünlerin listesi
     * @param {Number} totalPrice - Toplam tutar
     */
    addOrder(cartItems, totalPrice) {
      const newOrder = {
        // 6 haneli rastgele bir sipariş numarası
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        
        // Tarih formatı: GG.AA.YYYY
        date: new Date().toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        
        // DÜZELTME: OrdersView.vue ile uyum için 'title' anahtarını kullanıyoruz
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title || item.name || 'Bilinmeyen Ürün', 
          quantity: item.quantity,
          price: item.price
        })),

        total: totalPrice,
        status: 'HAZIRLANIYOR',
        statusType: 'status-pending'
      };

      // Yeni siparişi en başa ekle
      this.orders.unshift(newOrder);
      
      // LocalStorage senkronizasyonu
      this.saveToLocalStorage();
    },

    // Sipariş geçmişini temizlemek için OrdersView'da kullandığımız metod
    clearOrders() {
      this.orders = [];
      localStorage.removeItem('sakura_orders');
    },

    saveToLocalStorage() {
      localStorage.setItem('sakura_orders', JSON.stringify(this.orders));
    }
  }
});