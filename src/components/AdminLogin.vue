<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { account } from '../appwrite';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    await account.createEmailPasswordSession(email.value, password.value);
    router.push('/admin/dashboard');
  } catch (err) {
    error.value = err.message || 'Erro ao fazer login. Verifique suas credenciais.';
  } finally {
    isLoading.value = false;
  }
};

const voltarParaHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <button @click="voltarParaHome" class="btn btn-secondary btn-voltar">
        ← Voltar
      </button>
      <h1 class="login-title">Login Administrativo</h1>
      <p class="login-subtitle">Acesse o painel de cadastro de imóveis</p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="seu@email.com"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="••••••••"
            required
            class="form-input"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="isLoading">
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 75vh;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.btn-voltar {
  margin-bottom: 2rem;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.btn-voltar:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateX(-4px);
}

.login-title {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: #2c3e50;
  text-align: center;
  font-weight: 700;
}

.login-subtitle {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 1.05rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.form-input {
  padding: 0.9rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  background: linear-gradient(135deg, #fee, #fdd);
  color: #c33;
  padding: 0.9rem;
  border-radius: 8px;
  border-left: 4px solid #c33;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(204, 51, 51, 0.1);
}

.btn-full {
  width: 100%;
  padding: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 1.75rem;
  }
}
</style>
