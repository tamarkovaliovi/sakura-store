import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useCartStore = defineStore('cart', () => {
  
  const cart = ref(JSON.parse(localStorage.getItem('my_cart')) || []);
  const favorites = ref(JSON.parse(localStorage.getItem('my_favorites')) || []);
  
  
  const appliedCoupon = ref(JSON.parse(localStorage.getItem('my_coupon')) || null);

  const addToCart = (product) => {
    const existingItem = cart.value.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
  };

  const removeFromCart = (productId) => {
    cart.value = cart.value.filter(item => item.id !== productId);
  };

  const clearCart = () => {
    cart.value = [];
    appliedCoupon.value = null;
  };

 
  const applyCoupon = (couponCode) => {
   
    const availableCoupons = {
      'SAKURA20': 0.20,  
      'MERHABA10': 10,   
      'SPRING15': 0.15   
    };

    if (availableCoupons[couponCode]) {
      appliedCoupon.value = { 
        code: couponCode, 
        value: availableCoupons[couponCode] 
      };
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    appliedCoupon.value = null;
  };

  const toggleFavorite = (product) => {
    const index = favorites.value.findIndex(p => p.id === product.id);
    if (index > -1) {
      favorites.value.splice(index, 1); 
    } else {
      favorites.value.push(product); 
    }
  };

  const isFavorite = (productId) => {
    return favorites.value.some(p => p.id === productId);
  };

 
  watch(cart, (newCart) => {
    localStorage.setItem('my_cart', JSON.stringify(newCart));
  }, { deep: true });

  watch(favorites, (newFavs) => {
    localStorage.setItem('my_favorites', JSON.stringify(newFavs));
  }, { deep: true });

  
  watch(appliedCoupon, (newCoupon) => {
    localStorage.setItem('my_coupon', JSON.stringify(newCoupon));
  }, { deep: true });

  return { 
    cart, 
    favorites, 
    appliedCoupon, 
    addToCart, 
    removeFromCart, 
    clearCart, 
    applyCoupon,   
    removeCoupon,  
    toggleFavorite, 
    isFavorite 
  };
});