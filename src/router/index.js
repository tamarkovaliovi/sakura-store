import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Views - Görseldeki dosya isimlerinle birebir eşleşmeli
import HomeView from '../views/HomeView.vue';
import AllProductsView from '../views/AllProductsView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import CartView from '../views/CartView.vue';
import ProductDetailsView from '../views/ProductDetailsView.vue';
import EditProductView from '../views/EditProductView.vue';
import FavoritesView from '../views/FavoritesView.vue';
import OrdersView from '../views/OrdersView.vue';

// Components
import Categories from '../components/Categories.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/Allproducts', name: 'Allproducts', component: AllProductsView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { 
    path: '/profile', 
    name: 'profile', 
    component: ProfileView, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/orders', 
    name: 'orders', 
    component: OrdersView, 
    meta: { requiresAuth: true } 
  },
  { path: '/cart', name: 'cart', component: CartView },
  { path: '/favorites', name: 'favorites', component: FavoritesView },
  
  // Ürün Detay: Konsoldaki "No match" hatasını önlemek için isim 'product-details'
  { 
    path: '/product/:id', 
    name: 'product-details', 
    component: ProductDetailsView 
  },
  
  { 
    path: '/edit-product/:id?', 
    name: 'EditProduct', 
    component: EditProductView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { path: '/kategoriler', name: 'Categories', component: Categories },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// ROUTE GUARD (Sayfa Geçiş Kontrolü)
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("access_token");

  // 1. Zaten giriş yapmışsa Login/Register sayfasına girmesini engelle
  if (token && (to.name === 'login' || to.name === 'register')) {
    return next({ name: 'home' });
  }

  // 2. Token var ama kullanıcı bilgisi Store'da yoksa API'den çek
  // Bu işlem, sayfa yenilendiğinde oturumun devam etmesini sağlar.
  if (token && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch (error) {
      console.error("Kullanıcı doğrulanamadı, oturum siliniyor...");
      localStorage.removeItem("access_token");
      return next({ name: 'login' });
    }
  }

  // 3. Giriş gerektiren sayfalar için kontrol
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' });
  }

  // 4. Admin yetkisi kontrolü
  if (to.meta.requiresAdmin) {
    if (!authStore.user || authStore.user.role !== 'admin') {
      alert("Bu işlem için yönetici yetkisi gereklidir!");
      return next({ name: 'home' }); 
    }
  }

  next(); // Her şey yolundaysa geçişe izin ver
});

export default router;