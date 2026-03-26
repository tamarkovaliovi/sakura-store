import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import Swal from 'sweetalert2';
import { useAuthStore } from './auth';
import router from '@/router';

export const useCartStore = defineStore('cart', () => {
  
  // --- State ---
  const cart = ref(JSON.parse(localStorage.getItem('my_cart')) || []);
  const favorites = ref(JSON.parse(localStorage.getItem('my_favorites')) || []);
  const appliedCoupon = ref(JSON.parse(localStorage.getItem('my_coupon')) || null);

  // --- Getters ---
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  });

  // --- Actions ---

  const addToCart = (product) => {
    const authStore = useAuthStore(); 

    // Giriş kontrolü
    if (!authStore.user) {
      Swal.fire({
        icon: 'warning',
        title: 'Giriş Yapmalısınız',
        text: 'Sepete ürün eklemek için SakuraStore hesabınıza giriş yapın!',
        confirmButtonColor: '#d63384', 
        confirmButtonText: 'Giriş Yap',
        showCancelButton: true,
        cancelButtonText: 'Daha Sonra'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    const existingItem = cart.value.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      // DÜZELTME: 'images' dizisini koruyoruz ki CartView'da hata almayalım
      cart.value.push({ 
        id: product.id,
        title: product.title || product.name,
        price: product.price,
        // Eğer product.images varsa onu, yoksa tekli image'ı diziye çevirip koyuyoruz
        images: product.images || [product.image], 
        category: product.category, // Kategori bilgisini de ekleyelim
        quantity: 1 
      });
    }

    // Bildirim (Toast)
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      background: '#fff5f7', 
      color: '#d63384',      
      iconColor: '#ffb7c5',  
    });

    Toast.fire({
      icon: 'success',
      title: 'Sepete Eklendi!',
    });
  };

  const removeFromCart = (productId) => {
    cart.value = cart.value.filter(item => item.id !== productId);
  };

  const clearCart = () => {
    cart.value = [];
    appliedCoupon.value = null;
    localStorage.removeItem('my_cart');
    localStorage.removeItem('my_coupon');
  };

  const applyCoupon = (couponCode) => {
    const availableCoupons = {
      'SAKURA20': 0.20,  // %20 indirim
      'MERHABA10': 10,   // 10 birim indirim
      'SPRING15': 0.15   // %15 indirim
    };

    const discountValue = availableCoupons[couponCode];

    if (discountValue !== undefined) {
      appliedCoupon.value = { 
        code: couponCode, 
        value: discountValue 
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

  // --- Watchers ---
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
    cartTotal,
    addToCart, 
    removeFromCart, 
    clearCart, 
    applyCoupon,   
    removeCoupon,  
    toggleFavorite, 
    isFavorite 
  };
});