<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { account } from './appwrite';
import { config } from './config';

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
            <router-link to="/admin/dashboard" class="nav-link">Painel Admin</router-link>
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
        <div class="footer-info">
          <h3>{{ config.company.name }}</h3>
          <p>{{ config.company.slogan }}</p>
          <p>📞 {{ config.contact.phoneFormatted }} | 📧 {{ config.contact.email }}</p>
        </div>
        <div class="footer-links">
          <router-link to="/">Home</router-link>
          <router-link to="/busca">Buscar Imóveis</router-link>
          <router-link to="/admin/login">Área do Corretor</router-link>
        </div>
        <p class="footer-copyright">&copy; 2025 {{ config.company.name }}. Todos os direitos reservados.</p>
      </div>
    </footer>

    <!-- Floating WhatsApp Button -->
    <a 
      v-if="!isLoggedIn" 
      :href="`https://wa.me/${config.contact.phone}?text=${encodeURIComponent(config.contact.whatsappMessage)}`"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-float"
      title="Fale conosco pelo WhatsApp"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
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
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #3498db;
}

.footer-info p {
  margin: 0.5rem 0;
  color: #bdc3c7;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #3498db;
}

.footer-copyright {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #bdc3c7;
  font-size: 0.9rem;
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

/* Floating WhatsApp Button */
.whatsapp-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #25D366;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  z-index: 1000;
  transition: all 0.3s;
  text-decoration: none;
}

.whatsapp-float:hover {
  background-color: #20BA5A;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(37, 211, 102, 0.5);
}

.whatsapp-float svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
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
    justify-content: center;
  }

  .nav-link {
    padding: 0.5rem;
  }

  .footer-content {
    text-align: center;
  }

  .footer-info h3 {
    font-size: 1.25rem;
  }

  .footer-info p {
    font-size: 0.9rem;
  }

  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }

  .whatsapp-float {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
  }

  .whatsapp-float svg {
    width: 28px;
    height: 28px;
  }
}
</style>
