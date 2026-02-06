import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import CartView from '../views/CartView.vue';
import ProductDetailsView from '../views/ProductDetailsView.vue';
import AddProductView from '../views/EditProductView.vue';
import EditProductView from '../views/EditProductView.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView
    },
    
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/products/:id',
      name: 'product-details',
      component: ProductDetailsView
    },
    
   {
  path: '/edit-product/:id?', 
  name: 'EditProduct',
  component: EditProductView
}
  ]
});
export default router;
 