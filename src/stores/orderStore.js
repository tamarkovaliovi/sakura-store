import { defineStore } from 'pinia';

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
  
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
       
        id: Math.floor(100000 + Math.random() * 900000).toString(),
        
        
        date: new Date().toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        
        
        items: cartItems.map(item => ({
          id: item.id,
          name: item.title || item.name || 'Bilinmeyen Ürün', 
          quantity: item.quantity,
          price: item.price
        })),

        total: totalPrice,
        status: 'HAZIRLANIYOR',
        statusType: 'status-pending'
      };

    
      this.orders.unshift(newOrder);
      
      
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem('sakura_orders', JSON.stringify(this.orders));
    }
  }
});