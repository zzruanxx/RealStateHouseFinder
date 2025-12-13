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
        <div class="hero-badge">🏆 Portal Imobiliário de Confiança</div>
        <h1 class="hero-title">Duarte Consultor Imobiliário</h1>
        <p class="hero-subtitle">Encontre o imóvel dos seus sonhos com facilidade e segurança</p>

        <form @submit.prevent="buscarHero" class="hero-busca">
          <div class="hero-busca-fields">
            <input
              type="text"
              v-model="buscaHero.cidade"
              placeholder="Qual cidade você procura?"
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Buscar
            </button>
          </div>
        </form>

        <div class="hero-stats">
          <div class="stat-item">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            <span class="stat-label">Milhares de Imóveis</span>
          </div>
          <div class="stat-item">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="stat-label">Corretores Especializados</span>
          </div>
          <div class="stat-item">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span class="stat-label">Negócios Realizados</span>
          </div>
        </div>
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
                :alt="`${imovel.titulo} - ${imovel.cidade}`"
                loading="lazy"
                class="foto-img"
              />
              <div v-else class="foto-placeholder">
                <span>Sem foto</span>
              </div>
              <span class="imovel-badge">{{ imovel.tipo_anuncio }}</span>
            </div>

            <div class="imovel-content">
              <span class="imovel-tipo">{{ imovel.tipo_imovel }}</span>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {{ imovel.bairro }}, {{ imovel.cidade }}
              </p>

              <div class="imovel-specs">
                <span class="spec-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  {{ imovel.quartos }}
                </span>
                <span class="spec-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 6h11M12 12h8M9 18h11M3 6h.01M3 12h.01M3 18h.01"/>
                  </svg>
                  {{ imovel.banheiros }}
                </span>
                <span v-if="imovel.area_util_m2" class="spec-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                  </svg>
                  {{ imovel.area_util_m2 }}m²
                </span>
                <span v-if="imovel.vagas_garagem" class="spec-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/>
                    <circle cx="7" cy="17" r="2"/>
                    <circle cx="17" cy="17" r="2"/>
                  </svg>
                  {{ imovel.vagas_garagem }}
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
  padding: 6rem 1rem 4rem;
  margin: -2rem -1rem 2rem -1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="none"/><circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" stroke-width="1" fill="none"/></svg>') repeat;
  opacity: 0.3;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 300;
}

.hero-busca {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  margin-bottom: 3rem;
}

.hero-busca-fields {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
}

.hero-input,
.hero-select {
  padding: 1.1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.hero-input:focus,
.hero-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.hero-btn {
  padding: 1.1rem 2.5rem;
  white-space: nowrap;
  font-weight: 600;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.hero-btn:hover {
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  padding-top: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.stat-item svg {
  opacity: 0.9;
}

.stat-label {
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 0.9;
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

.imovel-tipo {
  display: inline-block;
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 0.75rem;
}

.imovel-titulo {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: #2c3e50;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  min-height: 2.8em;
}

.imovel-preco {
  font-size: 1.75rem;
  font-weight: 700;
  color: #27ae60;
  margin-bottom: 0.75rem;
}

.imovel-preco span {
  font-size: 0.875rem;
  font-weight: normal;
  color: #7f8c8d;
}

.imovel-localizacao {
  color: #7f8c8d;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.imovel-localizacao svg {
  flex-shrink: 0;
  color: #3498db;
}

.imovel-specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.spec-item {
  font-size: 0.9rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.spec-item svg {
  color: #3498db;
  flex-shrink: 0;
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
  .hero-section {
    padding: 4rem 1rem 3rem;
  }

  .hero-badge {
    font-size: 0.8rem;
    padding: 0.4rem 1rem;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .hero-busca {
    padding: 1.5rem;
  }

  .hero-busca-fields {
    grid-template-columns: 1fr;
  }

  .hero-btn {
    width: 100%;
    justify-content: center;
  }

  .hero-stats {
    gap: 1.5rem;
    padding-top: 1.5rem;
  }

  .stat-item svg {
    width: 28px;
    height: 28px;
  }

  .stat-label {
    font-size: 0.85rem;
  }

  .imoveis-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .sobre-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .hero-stats {
    gap: 1rem;
  }

  .stat-item {
    gap: 0.5rem;
  }

  .stat-item svg {
    width: 24px;
    height: 24px;
  }

  .stat-label {
    font-size: 0.8rem;
  }
}
</style>
