<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const voltarHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="not-found-icon">🏚️</div>
      <h1 class="not-found-title">404</h1>
      <h2 class="not-found-subtitle">Página Não Encontrada</h2>
      <p class="not-found-text">
        Ops! Parece que este imóvel não existe ou foi removido.
      </p>
      <div class="not-found-actions">
        <button @click="voltarHome" class="btn btn-primary">
          🏠 Voltar para Home
        </button>
        <router-link to="/busca" class="btn btn-secondary">
          🔍 Buscar Imóveis
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
}

.not-found-icon {
  font-size: 8rem;
  margin-bottom: 1rem;
  animation: shake 2s ease infinite;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

.not-found-title {
  font-size: 6rem;
  font-weight: bold;
  color: #3498db;
  margin: 0;
  line-height: 1;
}

.not-found-subtitle {
  font-size: 2rem;
  color: #2c3e50;
  margin: 1rem 0;
}

.not-found-text {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 1.5rem 0 2rem;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .not-found-icon {
    font-size: 5rem;
  }

  .not-found-title {
    font-size: 4rem;
  }

  .not-found-subtitle {
    font-size: 1.5rem;
  }

  .not-found-actions {
    flex-direction: column;
  }

  .not-found-actions .btn {
    width: 100%;
  }
}
</style>
