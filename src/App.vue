<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { account } from './appwrite';

const router = useRouter();
const isLoggedIn = ref(false);

const checkAuth = async () => {
  try {
    await account.get();
    isLoggedIn.value = true;
  } catch (error) {
    isLoggedIn.value = false;
  }
};

const logout = async () => {
  try {
    await account.deleteSession('current');
    isLoggedIn.value = false;
    router.push('/');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

onMounted(() => {
  checkAuth();
});
</script>

<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">Duarte Consultor Imobiliário</router-link>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/busca" class="nav-link">Buscar Imóveis</router-link>
          <template v-if="isLoggedIn">
            <router-link to="/admin/cadastrar" class="nav-link">Cadastrar Imóvel</router-link>
            <button @click="logout" class="nav-link btn-logout">Sair</button>
          </template>
          <template v-else>
            <router-link to="/admin/login" class="nav-link">Admin</router-link>
          </template>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 Duarte Consultor Imobiliário. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.logo a:hover {
  color: #3498db;
}

.nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.nav-link:hover {
  color: #3498db;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  color: #3498db;
}

.btn-logout {
  background: none;
  border: 1px solid white;
  cursor: pointer;
  font-size: 1rem;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 1rem;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}

/* Utility Classes */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem;
  }
}
</style>
