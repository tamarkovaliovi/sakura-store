// src/stores/cart.js
import { reactive, watch } from 'vue';

// 1. LocalStorage'dan eski sepeti çek (Varsa)
const savedCart = JSON.parse(localStorage.getItem('my_cart')) || [];

// 2. Sepet verisini reaktif (canlı) yap
export const cart = reactive(savedCart);

// 3. Sepete Ekleme Fonksiyonu
export const addToCart = (product) => {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity++; // Varsa adedini artır
  } else {
    cart.push({ ...product, quantity: 1 }); // Yoksa yeni ekle
  }
};

// 4. Sepetten Silme Fonksiyonu
export const removeFromCart = (productId) => {
  const index = cart.findIndex(item => item.id === productId);
  if (index > -1) {
    cart.splice(index, 1);
  }
};

// 5. Sepeti Temizle
export const clearCart = () => {
  cart.splice(0, cart.length);
};

// 6. Her değişiklikte LocalStorage'a kaydet (Sayfa yenilenince gitmesin)
watch(cart, () => {
  localStorage.setItem('my_cart', JSON.stringify(cart));
}, { deep: true });