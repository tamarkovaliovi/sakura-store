// src/stores/cart.js
import { ref, watch } from 'vue';

// 1. Güvenli yükleme: LocalStorage verisini hata kontrolüyle çekiyoruz
const getSavedCart = () => {
  try {
    const data = localStorage.getItem('my_cart');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Sepet verisi okunamadı, sıfırlanıyor.");
    return [];
  }
};

// 2. 'ref' kullanımı dizilerde daha stabil bir reaktiflik sağlar
export const cart = ref(getSavedCart());

// 3. Sepete Ekleme
export const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    // API'den gelen veriye göre 'images' veya 'title' kontrolü eklenebilir
    cart.value.push({ ...product, quantity: 1 });
  }
};

// 4. Adet Azaltma (Kullanıcı sepet sayfasında '-' tuşuna basarsa)
export const decreaseQuantity = (productId) => {
  const item = cart.value.find(item => item.id === productId);
  if (item && item.quantity > 1) {
    item.quantity--;
  } else {
    removeFromCart(productId); // Adet 1'den küçükse sepetten sil
  }
};

// 5. Sepetten Tamamen Silme
export const removeFromCart = (productId) => {
  cart.value = cart.value.filter(item => item.id !== productId);
};

// 6. Sepeti Temizle
export const clearCart = () => {
  cart.value = [];
};

// 7. LocalStorage Kaydı
watch(cart, (newCart) => {
  localStorage.setItem('my_cart', JSON.stringify(newCart));
}, { deep: true });