import { defineStore } from 'pinia';

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    // LocalStorage'dan siparişleri yükle
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
        // Benzersiz sipariş numarası
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        
        // Sipariş tarihi (Daha temiz bir görünüm için)
        date: new Date().toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        
        // Ürün verilerini eşleştirme
        // ÖNEMLİ: Görselde isim görünmediği için item.title'ın doğruluğundan emin oluyoruz
        items: cartItems.map(item => ({
          name: item.title || item.name || 'Bilinmeyen Ürün', 
          quantity: item.quantity,
          price: item.price
        })),

        total: totalPrice,
        status: 'HAZIRLANIYOR',
        statusType: 'status-pending'
      };

      // Yeni siparişi listenin en başına ekle
      this.orders.unshift(newOrder);
      
      // Kaydet
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem('sakura_orders', JSON.stringify(this.orders));
    }
  }
});