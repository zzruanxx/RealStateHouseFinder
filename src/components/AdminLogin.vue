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
  min-height: 70vh;
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.btn-voltar {
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.login-title {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  text-align: center;
}

.login-subtitle {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 2rem;
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
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  border-left: 4px solid #c33;
}

.btn-full {
  width: 100%;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
