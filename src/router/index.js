import { createRouter, createWebHistory } from 'vue-router';
import { account } from '../appwrite';

// Import components
import PaginaInicial from '../components/PaginaInicial.vue';
import PaginaBusca from '../components/PaginaBusca.vue';
import DetalheImovel from '../components/DetalheImovel.vue';
import AdminLogin from '../components/AdminLogin.vue';
import CadastrarImovel from '../components/CadastrarImovel.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PaginaInicial
  },
  {
    path: '/busca',
    name: 'Busca',
    component: PaginaBusca
  },
  {
    path: '/imovel/:id',
    name: 'DetalheImovel',
    component: DetalheImovel
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/cadastrar',
    name: 'CadastrarImovel',
    component: CadastrarImovel,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard for Authentication
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      await account.get();
      next();
    } catch (error) {
      next('/admin/login');
    }
  } else {
    next();
  }
});

export default router;
