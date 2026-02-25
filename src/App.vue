<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { account } from './appwrite';
import { config } from './config';

const router = useRouter();
const isLoggedIn = ref(false);
const user = ref(null);

// Verificar estado de autenticação
const checkAuth = async () => {
  try {
    user.value = await account.get();
    isLoggedIn.value = true;
  } catch (error) {
    isLoggedIn.value = false;
    user.value = null;
  }
};

// Logout
const logout = async () => {
  try {
    await account.deleteSession('current');
    isLoggedIn.value = false;
    user.value = null;
    router.push('/');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

// WhatsApp
const openWhatsApp = () => {
  const message = encodeURIComponent(config.contact.whatsappMessage);
  const url = `https://wa.me/${config.contact.phone}?text=${message}`;
  window.open(url, '_blank');
};

// Efeito de digitação da logo
const logoText = ref('');
const fullLogoText = 'R.B Consultoria Imobiliária';
const typingComplete = ref(false);

const startTypingEffect = () => {
  let i = 0;
  typingComplete.value = false;
  logoText.value = '';
  const interval = setInterval(() => {
    if (i < fullLogoText.length) {
      logoText.value += fullLogoText.charAt(i);
      i++;
    } else {
      typingComplete.value = true;
      clearInterval(interval);
    }
  }, 80);
};

onMounted(() => {
  startTypingEffect();
});

onUnmounted(() => {
  clearInterval(startTypingEffect);
});
</script>

<template>
  <div id="app">
    <!-- Header -->
    <header class="app-header">
      <nav class="nav-container">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            <span class="logo-link">
              <span class="logo-typing">{{ logoText }}<span v-if="!typingComplete" class="typing-cursor">|</span></span>
            </span>
          </router-link>
        </div>

        <div class="nav-menu">
          <router-link to="/venda" class="nav-link">Comprar</router-link>
          <router-link to="/locacao" class="nav-link">Alugar</router-link>
          <router-link to="/admin/cadastrar" class="nav-link">Vender</router-link>
          <router-link to="/sobre-mim" class="nav-link">Sobre Mim</router-link>

          <div v-if="isLoggedIn" class="nav-auth">
            <router-link to="/admin/dashboard" class="nav-link admin-link">Painel</router-link>
            <button @click="logout" class="logout-btn">Sair</button>
          </div>

          <div v-else class="nav-auth">
            <router-link to="/admin/login" class="nav-link login-link">Área Admin</router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer Estilo SERHANT -->
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h4 class="footer-heading">Navegação</h4>
            <ul class="footer-list">
              <li><router-link to="/venda" class="footer-link">Comprar</router-link></li>
              <li><router-link to="/locacao" class="footer-link">Alugar</router-link></li>
              <li><router-link to="/admin/cadastrar" class="footer-link">Vender</router-link></li>
              <li><router-link to="/busca" class="footer-link">Lançamentos</router-link></li>
              <li><router-link to="/sobre-mim" class="footer-link">Sobre Mim</router-link></li>
              <li><a :href="`tel:${config.contact.phone}`" class="footer-link">Contato</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-heading">Serviços</h4>
            <ul class="footer-list">
              <li><router-link to="/sobre-mim" class="footer-link">Consultoria</router-link></li>
              <li><router-link to="/sobre-mim" class="footer-link">Avaliação de Imóveis</router-link></li>
              <li><router-link to="/sobre-mim" class="footer-link">Assessoria</router-link></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-heading">Informações</h4>
            <ul class="footer-list">
              <li><router-link to="/sobre-mim" class="footer-link">Sobre Mim</router-link></li>
              <li><router-link to="/sobre" class="footer-link">Empresa</router-link></li>
              <li><router-link to="/carreiras" class="footer-link">Carreiras</router-link></li>
              <li v-if="isLoggedIn"><router-link to="/admin/dashboard" class="footer-link">Painel Admin</router-link></li>
              <li v-else><router-link to="/admin/login" class="footer-link">Área do Corretor</router-link></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-heading">Recursos</h4>
            <ul class="footer-list">
              <li><router-link to="/busca" class="footer-link">Buscar Imóveis</router-link></li>
              <li><router-link to="/sobre-mim" class="footer-link">Áreas de Atuação</router-link></li>
              <li><router-link to="/sobre" class="footer-link">Blog</router-link></li>
              <li><router-link to="/sobre" class="footer-link">Dicas</router-link></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-heading">Contato</h4>
            <ul class="footer-list">
              <li>
                <a :href="`tel:${config.contact.phone}`" class="footer-link contact-link">
                  {{ config.contact.phoneFormatted }}
                </a>
              </li>
              <li>
                <a :href="`mailto:${config.contact.email}`" class="footer-link contact-link">
                  {{ config.contact.email }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-divider"></div>
          <p class="copyright">
            © {{ new Date().getFullYear() }} Ruan Batista Consultor Imobiliário. Todos os direitos reservados.
          </p>
          <p class="footer-disclaimer">
            RUAN BATISTA, o logotipo e várias outras marcas comerciais, logotipos, designs e slogans são marcas da Ruan Batista Consultor Imobiliário - CRECI 94102.
          </p>
          <div class="footer-legal">
            <router-link to="/termos" class="footer-legal-link">Termos de Uso</router-link>
            <router-link to="/privacidade" class="footer-legal-link">Política de Privacidade</router-link>
            <router-link to="/habitacao-justa" class="footer-legal-link">Declaração de Habitação Justa</router-link>
          </div>
        </div>
      </div>
    </footer>

    <!-- WhatsApp Flutuante -->
    <div v-if="!isLoggedIn" class="whatsapp-float" @click="openWhatsApp">
      <div class="whatsapp-pulse"></div>
      <div class="whatsapp-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>
      <div class="whatsapp-tooltip">
        <span>Fale conosco</span>
      </div>
    </div>
  </div>
</template>

<style>
/* Reset e variáveis globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #000;
  --secondary-color: #333;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
  --dark-color: #000;
  --light-color: #fff;
  --gray-color: #666;
  --border-color: #ddd;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--dark-color);
  background: #fff;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e0e0e0;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.nav-brand .brand-link {
  text-decoration: none;
  color: var(--dark-color);
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.brand-text {
  color: #000;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--dark-color);
  font-weight: 500;
  font-size: 1rem;
  transition: var(--transition-normal);
  position: relative;
  padding: 0.5rem 0;
}

.nav-link:hover {
  color: #666;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-link {
  background: var(--primary-color);
  color: white !important;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
}

.admin-link:hover {
  background: var(--secondary-color);
}

.login-link {
  border: 1px solid #000;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
}

.login-link:hover {
  background: #000;
  color: #fff !important;
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--danger-color);
  color: var(--danger-color);
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: var(--transition-normal);
}

.logout-btn:hover {
  background: var(--danger-color);
  color: white;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 0;
}

/* Footer */
.app-footer {
  background: #000;
  color: white;
  margin-top: 0;
  padding: 4rem 0 2rem;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-list {
  list-style: none;
}

.footer-list li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: #999;
  text-decoration: none;
  font-size: 0.95rem;
  transition: var(--transition-normal);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-link:hover {
  color: white;
}

.contact-link {
  padding: 0.25rem 0;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 2rem;
  text-align: center;
}

.copyright {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.footer-disclaimer {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 1.5rem auto;
  max-width: 900px;
}

.footer-legal {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.footer-legal-link {
  color: #999;
  text-decoration: none;
  font-size: 0.9rem;
  transition: var(--transition-normal);
}

.footer-legal-link:hover {
  color: white;
}

/* WhatsApp Flutuante */
.whatsapp-float {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.3);
  transition: var(--transition-normal);
  z-index: 1000;
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
}

.whatsapp-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #25D366;
  animation: whatsappPulse 2s infinite;
}

.whatsapp-icon {
  position: relative;
  z-index: 1;
  color: white;
  font-size: 1.5rem;
}

@keyframes whatsappPulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.whatsapp-tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--dark-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  font-size: 0.9rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition-normal);
  pointer-events: none;
}

.whatsapp-tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: var(--dark-color);
}

.whatsapp-float:hover .whatsapp-tooltip {
  opacity: 1;
  visibility: visible;
}

/* Botões globais */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-normal);
  white-space: nowrap;
}

.btn-primary {
  background: #000;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: #333;
}

.btn-secondary {
  background: #fff;
  color: #000;
  border: 2px solid #000;
}

.btn-secondary:hover {
  background: #000;
  color: #fff;
  transform: translateY(-1px);
}

/* Responsividade */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    height: 70px;
  }

  .nav-menu {
    gap: 1rem;
    font-size: 0.9rem;
  }

  .nav-link {
    padding: 0.5rem;
  }

  .nav-auth {
    gap: 0.5rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .whatsapp-float {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 56px;
    height: 56px;
  }

  .whatsapp-icon {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .nav-link {
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
  }

  .logout-btn, .login-link, .admin-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .footer-container {
    padding: 3rem 1rem 2rem;
  }

  .footer-legal {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
