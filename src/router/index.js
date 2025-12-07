import { createRouter, createWebHistory } from 'vue-router';
import { account } from '../appwrite';

// Import components
import PaginaInicial from '../components/PaginaInicial.vue';
import PaginaBusca from '../components/PaginaBusca.vue';
import DetalheImovel from '../components/DetalheImovel.vue';
import AdminLogin from '../components/AdminLogin.vue';
import AdminDashboard from '../components/AdminDashboard.vue';
import CadastrarImovel from '../components/CadastrarImovel.vue';
import EditarImovel from '../components/EditarImovel.vue';
import NotFound from '../components/NotFound.vue';

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
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cadastrar',
    name: 'CadastrarImovel',
    component: CadastrarImovel,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/editar/:id',
    name: 'EditarImovel',
    component: EditarImovel,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
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
