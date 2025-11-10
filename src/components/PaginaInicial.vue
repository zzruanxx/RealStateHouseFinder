<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { databases, storage, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID, Query } from '../appwrite';

const router = useRouter();

// Busca Hero
const buscaHero = ref({
  cidade: '',
  tipo_imovel: ''
});

// Imóveis em Destaque
const imoveisDestaque = ref([]);
const isLoading = ref(false);

const buscarHero = () => {
  const query = {};
  if (buscaHero.value.cidade) {
    query.cidade = buscaHero.value.cidade;
  }
  if (buscaHero.value.tipo_imovel) {
    query.tipo_imovel = buscaHero.value.tipo_imovel;
  }

  router.push({
    path: '/busca',
    query
  });
};

const carregarImoveisDestaque = async () => {
  isLoading.value = true;
  try {
    const queries = [
      Query.equal('status', 'disponivel'),
      Query.orderDesc('$createdAt'),
      Query.limit(6)
    ];

    const response = await databases.listDocuments(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      queries
    );

    // Processar resultados e gerar URLs das fotos
    imoveisDestaque.value = response.documents.map(imovel => {
      const fotoUrl = imovel.fotos_storage_ids && imovel.fotos_storage_ids.length > 0
        ? storage.getFilePreview(
            BUCKET_FOTOS_ID,
            imovel.fotos_storage_ids[0],
            400,
            300,
            'center',
            100
          ).href
        : '';

      return {
        ...imovel,
        fotoUrl
      };
    });

  } catch (error) {
    console.error('Erro ao carregar imóveis em destaque:', error);
  } finally {
    isLoading.value = false;
  }
};

const formatarPreco = (preco) => {
  if (!preco) return 'Consulte';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco);
};

onMounted(() => {
  carregarImoveisDestaque();
});
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Duarte Consultor Imobiliário</h1>
        <p class="hero-subtitle">Encontre o imóvel dos seus sonhos</p>

        <form @submit.prevent="buscarHero" class="hero-busca">
          <div class="hero-busca-fields">
            <input
              type="text"
              v-model="buscaHero.cidade"
              placeholder="Cidade"
              class="hero-input"
            />
            <select v-model="buscaHero.tipo_imovel" class="hero-select">
              <option value="">Tipo de Imóvel</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
              <option value="rural">Rural</option>
            </select>
            <button type="submit" class="btn btn-primary hero-btn">
              Buscar Imóveis
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Destaques -->
    <section class="destaques-section">
      <h2 class="destaques-title">Imóveis em Destaque</h2>
      <p class="destaques-subtitle">Confira as últimas oportunidades</p>

      <!-- Loading -->
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>Carregando imóveis...</p>
      </div>

      <!-- Sem Resultados -->
      <div v-else-if="imoveisDestaque.length === 0" class="no-results">
        <p>Nenhum imóvel disponível no momento.</p>
      </div>

      <!-- Grid de Imóveis -->
      <div v-else class="imoveis-grid">
        <router-link
          v-for="imovel in imoveisDestaque"
          :key="imovel.$id"
          :to="{ name: 'DetalheImovel', params: { id: imovel.$id } }"
          class="imovel-card-link"
        >
          <div class="imovel-card">
            <div class="imovel-foto">
              <img
                v-if="imovel.fotoUrl"
                :src="imovel.fotoUrl"
                :alt="imovel.titulo"
                class="foto-img"
              />
              <div v-else class="foto-placeholder">
                <span>Sem foto</span>
              </div>
              <span class="imovel-badge">{{ imovel.tipo_anuncio }}</span>
            </div>

            <div class="imovel-content">
              <h3 class="imovel-titulo">{{ imovel.titulo }}</h3>

              <p class="imovel-preco">
                {{
                  imovel.tipo_anuncio === 'aluguel'
                    ? formatarPreco(imovel.preco_aluguel)
                    : formatarPreco(imovel.preco_venda)
                }}
                <span v-if="imovel.tipo_anuncio === 'aluguel'">/mês</span>
              </p>

              <p class="imovel-localizacao">
                📍 {{ imovel.bairro }}, {{ imovel.cidade }}
              </p>

              <div class="imovel-specs">
                <span class="spec-item">🛏️ {{ imovel.quartos }} quarto(s)</span>
                <span class="spec-item">🚿 {{ imovel.banheiros }} banheiro(s)</span>
                <span v-if="imovel.area_util_m2" class="spec-item">
                  📏 {{ imovel.area_util_m2 }} m²
                </span>
                <span v-if="imovel.vagas_garagem" class="spec-item">
                  🚗 {{ imovel.vagas_garagem }} vaga(s)
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <div class="destaques-footer">
        <router-link to="/busca" class="btn btn-secondary">
          Ver Todos os Imóveis
        </router-link>
      </div>
    </section>

    <!-- Sobre Section -->
    <section class="sobre-section">
      <div class="sobre-content">
        <h2 class="sobre-title">Por que escolher Duarte Consultor Imobiliário?</h2>
        <div class="sobre-grid">
          <div class="sobre-card">
            <div class="sobre-icon">🏠</div>
            <h3>Variedade de Imóveis</h3>
            <p>Encontre apartamentos, casas, terrenos e muito mais em diversas localidades.</p>
          </div>
          <div class="sobre-card">
            <div class="sobre-icon">💼</div>
            <h3>Profissionalismo</h3>
            <p>Equipe especializada pronta para atender suas necessidades com excelência.</p>
          </div>
          <div class="sobre-card">
            <div class="sobre-icon">🔍</div>
            <h3>Busca Facilitada</h3>
            <p>Sistema de busca inteligente para encontrar o imóvel perfeito rapidamente.</p>
          </div>
          <div class="sobre-card">
            <div class="sobre-icon">✅</div>
            <h3>Confiança</h3>
            <p>Anos de experiência no mercado imobiliário garantindo sua tranquilidade.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  padding: 0;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5rem 1rem;
  margin: -2rem -1rem 2rem -1rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.hero-busca {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hero-busca-fields {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
}

.hero-input,
.hero-select {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.hero-input:focus,
.hero-select:focus {
  outline: none;
  border-color: #3498db;
}

.hero-btn {
  padding: 1rem 2rem;
  white-space: nowrap;
}

/* Destaques Section */
.destaques-section {
  padding: 3rem 0;
}

.destaques-title {
  font-size: 2.5rem;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.destaques-subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.imoveis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.imovel-card-link {
  text-decoration: none;
  color: inherit;
}

.imovel-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.imovel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.imovel-foto {
  position: relative;
  height: 200px;
  background-color: #f0f0f0;
}

.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.foto-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
}

.imovel-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
}

.imovel-content {
  padding: 1.5rem;
}

.imovel-titulo {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.imovel-preco {
  font-size: 1.5rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 0.5rem;
}

.imovel-localizacao {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.imovel-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.spec-item {
  font-size: 0.9rem;
  color: #555;
}

.destaques-footer {
  text-align: center;
  margin-top: 2rem;
}

/* Sobre Section */
.sobre-section {
  background: white;
  padding: 4rem 1rem;
  margin: 3rem -1rem 0 -1rem;
}

.sobre-content {
  max-width: 1200px;
  margin: 0 auto;
}

.sobre-title {
  font-size: 2rem;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 3rem;
}

.sobre-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.sobre-card {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  transition: transform 0.3s;
}

.sobre-card:hover {
  transform: translateY(-4px);
}

.sobre-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.sobre-card h3 {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.sobre-card p {
  color: #7f8c8d;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-busca-fields {
    grid-template-columns: 1fr;
  }

  .imoveis-grid {
    grid-template-columns: 1fr;
  }

  .sobre-grid {
    grid-template-columns: 1fr;
  }
}
</style>
