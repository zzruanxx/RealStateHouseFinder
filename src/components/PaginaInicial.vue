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
    <!-- Hero Section Melhorada -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">🏆</span>
          Portal Imobiliário de Confiança
        </div>
        <h1 class="hero-title">
          <span class="title-highlight">Duarte Consultor Imobiliário</span>
        </h1>
        <p class="hero-subtitle">
          Encontre o imóvel dos seus sonhos com facilidade e segurança
        </p>

        <form @submit.prevent="buscarHero" class="hero-search">
          <div class="search-fields">
            <div class="search-field">
              <input
                type="text"
                v-model="buscaHero.cidade"
                placeholder="Qual cidade você procura?"
                class="search-input"
              />
            </div>
            <div class="search-field">
              <select v-model="buscaHero.tipo_imovel" class="search-select">
                <option value="">Tipo de Imóvel</option>
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="terreno">Terreno</option>
                <option value="comercial">Comercial</option>
                <option value="rural">Rural</option>
              </select>
            </div>
            <button type="submit" class="search-btn">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Buscar
            </button>
          </div>
        </form>

        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-number">1000+</span>
              <span class="stat-label">Imóveis</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-number">50+</span>
              <span class="stat-label">Corretores</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-number">500+</span>
              <span class="stat-label">Negócios</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Destaques com Cards Melhorados -->
    <section class="destaques-section">
      <div class="section-header">
        <h2 class="section-title">Imóveis em Destaque</h2>
        <p class="section-subtitle">Confira as últimas oportunidades</p>
      </div>

      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Carregando imóveis...</p>
      </div>

      <div v-else-if="imoveisDestaque.length === 0" class="empty-state">
        <p>Nenhum imóvel disponível no momento.</p>
      </div>

      <div v-else class="properties-grid">
        <router-link
          v-for="imovel in imoveisDestaque"
          :key="imovel.$id"
          :to="{ name: 'DetalheImovel', params: { id: imovel.$id } }"
          class="property-link"
        >
          <div class="property-card">
            <div class="property-image">
              <img
                v-if="imovel.fotoUrl"
                :src="imovel.fotoUrl"
                :alt="`${imovel.titulo} - ${imovel.cidade}`"
                loading="lazy"
                class="image"
              />
              <div v-else class="image-placeholder">
                <span>Sem foto</span>
              </div>
              <div class="property-type">{{ imovel.tipo_imovel }}</div>
              <div class="property-status">{{ imovel.tipo_anuncio }}</div>
            </div>

            <div class="property-content">
              <h3 class="property-title">{{ imovel.titulo }}</h3>

              <div class="property-price">
                <span class="price-value">
                  {{
                    imovel.tipo_anuncio === 'aluguel'
                      ? formatarPreco(imovel.preco_aluguel)
                      : formatarPreco(imovel.preco_venda)
                  }}
                </span>
                <span v-if="imovel.tipo_anuncio === 'aluguel'" class="price-period">/mês</span>
              </div>

              <div class="property-location">
                <svg class="location-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {{ imovel.bairro }}, {{ imovel.cidade }}
              </div>

              <div class="property-features">
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  {{ imovel.quartos }}
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 6h11M12 12h8M9 18h11M3 6h.01M3 12h.01M3 18h.01"/>
                  </svg>
                  {{ imovel.banheiros }}
                </div>
                <div v-if="imovel.area_util_m2" class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                  </svg>
                  {{ imovel.area_util_m2 }}m²
                </div>
                <div v-if="imovel.vagas_garagem" class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/>
                    <circle cx="7" cy="17" r="2"/>
                    <circle cx="17" cy="17" r="2"/>
                  </svg>
                  {{ imovel.vagas_garagem }}
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <div class="section-footer">
        <router-link to="/busca" class="btn btn-secondary">
          Ver Todos os Imóveis
        </router-link>
      </div>
    </section>

    <!-- Sobre Section Aprimorada -->
    <section class="about-section">
      <div class="about-container">
        <div class="about-header">
          <h2 class="about-title">Por que escolher Duarte Consultor Imobiliário?</h2>
        </div>
        <div class="about-grid">
          <div class="about-card">
            <div class="about-icon">🏠</div>
            <h3>Variedade de Imóveis</h3>
            <p>Encontre apartamentos, casas, terrenos e muito mais em diversas localidades.</p>
          </div>
          <div class="about-card">
            <div class="about-icon">💼</div>
            <h3>Profissionalismo</h3>
            <p>Equipe especializada pronta para atender suas necessidades com excelência.</p>
          </div>
          <div class="about-card">
            <div class="about-icon">🔍</div>
            <h3>Busca Facilitada</h3>
            <p>Sistema de busca inteligente para encontrar o imóvel perfeito rapidamente.</p>
          </div>
          <div class="about-card">
            <div class="about-icon">✅</div>
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

/* Hero Section Aprimorada */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 1rem 4rem;
  margin: -2rem -1rem 2rem -1rem;
  text-align: center;
  overflow: hidden;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23smallGrid)" /></svg>') repeat;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease-out;
}

.badge-icon {
  font-size: 1.2rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1.5rem;
  font-weight: 800;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.title-highlight {
  background: linear-gradient(45deg, #fff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  margin-bottom: 3rem;
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 300;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.hero-search {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: 3rem;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.search-fields {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  margin-bottom: 0;
}

.search-field {
  position: relative;
}

.search-input,
.search-select {
  width: 100%;
  padding: 1.2rem 1rem;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input:focus,
.search-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.2rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  white-space: nowrap;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
}

.stat-content {
  text-align: left;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Animações */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Destaques Section */
.destaques-section {
  padding: 4rem 1rem;
  background: #fafbfc;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.section-subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}
</style>
