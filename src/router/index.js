import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '../views/HomeView.vue';
import AllProductsView from '../views/AllProductsView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import CartView from '../views/CartView.vue';
import ProductDetailsView from '../views/ProductDetailsView.vue';
import EditProductView from '../views/EditProductView.vue';
import CategoriesView from '../components/Categories.vue';
import FavoritesView from '../views/FavoritesView.vue';
import OrdersView from '../views/OrdersView.vue';

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
  { path: '/products/:id', name: 'product-details', component: ProductDetailsView },
  { 
    path: '/edit-product/:id?', 
    name: 'EditProduct', 
    component: EditProductView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { path: '/kategoriler', name: 'Categories', component: CategoriesView },
 
{
  path: '/product/:id',
  name: 'ProductDetails', 
  component: () => import('../views/ProductDetailsView.vue')
}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});


router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("user_token");
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' });
  }
  if (token && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch (error) {
      localStorage.removeItem("user_token");
      return next({ name: 'login' });
    }
  }

  if (to.meta.requiresAdmin) {
    if (authStore.user?.role !== 'admin') {
      alert("Bu işlem için Moderatör yetkisi gereklidir!");
      return next({ name: 'home' }); 
    }
  }

  next(); 
});

export default router;