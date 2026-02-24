<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  window.scrollTo(0, 0);
});

const corretores = [
  {
    nome: 'Ana Paula Silva',
    creci: 'CRECI 12345-SP',
    especialidade: 'Imóveis de Alto Padrão',
    foto: '👩‍💼',
    cidade: 'São Paulo, SP',
    experiencia: '12 anos',
    vendas: '250+ imóveis',
    avaliacao: 4.9
  },
  {
    nome: 'Carlos Eduardo Santos',
    creci: 'CRECI 67890-RJ',
    especialidade: 'Imóveis Comerciais',
    foto: '👨‍💼',
    cidade: 'Rio de Janeiro, RJ',
    experiencia: '8 anos',
    vendas: '180+ imóveis',
    avaliacao: 4.8
  },
  {
    nome: 'Mariana Costa',
    creci: 'CRECI 11223-MG',
    especialidade: 'Apartamentos e Coberturas',
    foto: '👩‍💼',
    cidade: 'Belo Horizonte, MG',
    experiencia: '10 anos',
    vendas: '320+ imóveis',
    avaliacao: 5.0
  },
  {
    nome: 'Roberto Ferreira',
    creci: 'CRECI 44556-PR',
    especialidade: 'Casas e Terrenos',
    foto: '👨‍💼',
    cidade: 'Curitiba, PR',
    experiencia: '15 anos',
    vendas: '400+ imóveis',
    avaliacao: 4.9
  },
  {
    nome: 'Juliana Oliveira',
    creci: 'CRECI 77889-RS',
    especialidade: 'Imóveis Residenciais',
    foto: '👩‍💼',
    cidade: 'Porto Alegre, RS',
    experiencia: '6 anos',
    vendas: '150+ imóveis',
    avaliacao: 4.7
  },
  {
    nome: 'Fernando Almeida',
    creci: 'CRECI 99001-DF',
    especialidade: 'Lançamentos',
    foto: '👨‍💼',
    cidade: 'Brasília, DF',
    experiencia: '9 anos',
    vendas: '200+ imóveis',
    avaliacao: 4.8
  }
];

const filtros = ref({
  cidade: '',
  especialidade: ''
});

const corretoresFiltrados = ref(corretores);

const aplicarFiltros = () => {
  corretoresFiltrados.value = corretores.filter(corretor => {
    const matchCidade = !filtros.value.cidade || corretor.cidade.includes(filtros.value.cidade);
    const matchEspecialidade = !filtros.value.especialidade || corretor.especialidade.includes(filtros.value.especialidade);
    return matchCidade && matchEspecialidade;
  });
};

const limparFiltros = () => {
  filtros.value = {
    cidade: '',
    especialidade: ''
  };
  corretoresFiltrados.value = corretores;
};

const buscarImoveis = () => {
  router.push('/busca');
};
</script>

<template>
  <div class="page-container">
    <div class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">Nossos Corretores</h1>
        <p class="hero-subtitle">Profissionais qualificados prontos para ajudar você a encontrar o imóvel perfeito</p>
      </div>
    </div>

    <div class="content-section">
      <div class="section-container">
        <div class="intro-text">
          <p class="text-content">
            Conheça nossa equipe de corretores altamente qualificados e experientes. Cada profissional é especializado 
            em diferentes segmentos do mercado imobiliário para oferecer o melhor atendimento às suas necessidades.
          </p>
        </div>

        <div class="filters-section">
          <h3 class="filters-title">Filtrar Corretores</h3>
          <div class="filters-container">
            <div class="filter-group">
              <label>Cidade</label>
              <select v-model="filtros.cidade" @change="aplicarFiltros">
                <option value="">Todas as cidades</option>
                <option value="São Paulo">São Paulo</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="Belo Horizonte">Belo Horizonte</option>
                <option value="Curitiba">Curitiba</option>
                <option value="Porto Alegre">Porto Alegre</option>
                <option value="Brasília">Brasília</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Especialidade</label>
              <select v-model="filtros.especialidade" @change="aplicarFiltros">
                <option value="">Todas as especialidades</option>
                <option value="Alto Padrão">Imóveis de Alto Padrão</option>
                <option value="Comerciais">Imóveis Comerciais</option>
                <option value="Apartamentos">Apartamentos e Coberturas</option>
                <option value="Casas">Casas e Terrenos</option>
                <option value="Residenciais">Imóveis Residenciais</option>
                <option value="Lançamentos">Lançamentos</option>
              </select>
            </div>
            <button @click="limparFiltros" class="btn btn-secondary">
              Limpar Filtros
            </button>
          </div>
        </div>

        <div class="brokers-grid">
          <div v-for="(corretor, index) in corretoresFiltrados" :key="index" class="broker-card">
            <div class="broker-photo">
              <div class="photo-placeholder">{{ corretor.foto }}</div>
            </div>
            
            <div class="broker-info">
              <h3 class="broker-name">{{ corretor.nome }}</h3>
              <p class="broker-creci">{{ corretor.creci }}</p>
              <p class="broker-specialty">{{ corretor.especialidade }}</p>
              
              <div class="broker-stats">
                <div class="stat-item">
                  <span class="stat-icon">📍</span>
                  <span class="stat-value">{{ corretor.cidade }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">⏱️</span>
                  <span class="stat-value">{{ corretor.experiencia }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">🏠</span>
                  <span class="stat-value">{{ corretor.vendas }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">⭐</span>
                  <span class="stat-value">{{ corretor.avaliacao }}/5</span>
                </div>
              </div>
              
              <button @click="buscarImoveis" class="btn btn-primary btn-contact">
                Ver Imóveis
              </button>
            </div>
          </div>
        </div>

        <div v-if="corretoresFiltrados.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Nenhum corretor encontrado</h3>
          <p>Tente ajustar os filtros para encontrar corretores disponíveis.</p>
          <button @click="limparFiltros" class="btn btn-secondary">
            Limpar Filtros
          </button>
        </div>

        <div class="cta-section">
          <h2 class="cta-title">Quer Fazer Parte do Nosso Time?</h2>
          <p class="cta-text">
            Estamos sempre procurando por profissionais qualificados para se juntar à nossa equipe.
          </p>
          <router-link to="/carreiras" class="btn btn-primary">
            Ver Oportunidades
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  background: white;
}

.hero-banner {
  background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)),
              url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;
  color: white;
  padding: 6rem 2rem 4rem;
  text-align: center;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  opacity: 0.9;
  font-weight: 400;
}

.content-section {
  padding: 5rem 2rem;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.intro-text {
  text-align: center;
  margin-bottom: 4rem;
}

.text-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
}

.filters-section {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 4rem;
}

.filters-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1.5rem;
}

.filters-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #000;
  font-size: 0.95rem;
}

.filter-group select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: white;
}

.filter-group select:focus {
  outline: none;
  border-color: #000;
}

.brokers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-bottom: 5rem;
}

.broker-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.broker-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.broker-photo {
  margin-bottom: 1.5rem;
}

.photo-placeholder {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border: 3px solid #e0e0e0;
}

.broker-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.broker-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.broker-creci {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.broker-specialty {
  font-size: 1rem;
  color: #000;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 20px;
  display: inline-block;
  margin: 0.5rem auto;
}

.broker-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border-radius: 6px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #333;
}

.stat-icon {
  font-size: 1.1rem;
}

.stat-value {
  font-weight: 500;
}

.btn-contact {
  margin-top: 1rem;
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.cta-section {
  background: #f5f5f5;
  padding: 4rem 2rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 3rem;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1rem;
}

.cta-text {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .hero-banner {
    padding: 4rem 1.5rem 3rem;
  }

  .content-section {
    padding: 3rem 1.5rem;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-container .btn {
    width: 100%;
  }

  .brokers-grid {
    grid-template-columns: 1fr;
  }

  .broker-stats {
    grid-template-columns: 1fr;
  }
}
</style>
