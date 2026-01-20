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
              <div class="property-code">COD. {{ imovel.$id.substring(0, 8).toUpperCase() }}</div>
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

/* Cards de imóveis na home */
.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.property-link {
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.property-link:hover {
  transform: translateY(-8px);
}

.property-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  border: 1px solid #edf2f7;
}

.property-card:hover {
  box-shadow: 0 12px 38px rgba(0, 0, 0, 0.12);
}

.property-image {
  position: relative;
  height: 220px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.property-card:hover .image {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  font-size: 1.1rem;
}

.property-type,
.property-status,
.property-code {
  position: absolute;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.2px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.property-type {
  top: 14px;
  left: 14px;
  background: rgba(255, 255, 255, 0.92);
  color: #2c3e50;
}

.property-status {
  top: 14px;
  right: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.property-code {
  bottom: 14px;
  right: 14px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 0.75rem;
  padding: 0.45rem 0.85rem;
  letter-spacing: 0.5px;
  font-family: monospace;
}

.property-content {
  padding: 1.6rem;
}

.property-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.property-price {
  margin-bottom: 0.85rem;
}

.price-value {
  font-size: 1.9rem;
  font-weight: 800;
  color: #27ae60;
}

.price-period {
  font-size: 0.95rem;
  color: #7f8c8d;
  font-weight: 500;
}

.property-location {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #7f8c8d;
  font-size: 0.98rem;
  margin-bottom: 1.1rem;
}

.location-icon {
  width: 17px;
  height: 17px;
  color: #667eea;
  flex-shrink: 0;
}

.property-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
  padding-top: 1.1rem;
  border-top: 1px solid #ecf0f1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #4b5563;
  font-weight: 600;
}

.feature-icon {
  width: 17px;
  height: 17px;
  color: #667eea;
  flex-shrink: 0;
}

.section-footer {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

/* Sobre a Duarte */
.about-section {
  padding: 5rem 1rem;
  background: linear-gradient(180deg, #f8f9ff 0%, #eef2ff 100%);
  position: relative;
  overflow: hidden;
}

.about-section::before,
.about-section::after {
  content: '';
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.14), transparent 60%);
  filter: blur(30px);
  z-index: 0;
}

.about-section::after {
  right: -80px;
  bottom: -120px;
  background: radial-gradient(circle at 70% 70%, rgba(118, 75, 162, 0.16), transparent 60%);
}

.about-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 2.5rem;
}

.about-header {
  text-align: center;
  max-width: 820px;
  margin: 0 auto;
}

.about-title {
  font-size: clamp(2rem, 4vw, 2.6rem);
  color: #111827;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.about-card {
  background: white;
  padding: 1.75rem;
  border-radius: 16px;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.08);
  border: 1px solid #edf2f7;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.about-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
}

.about-card:hover::before {
  opacity: 1;
}

.about-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 10px 25px rgba(118, 75, 162, 0.25);
}

.about-card h3 {
  font-size: 1.1rem;
  color: #111827;
  margin-bottom: 0.5rem;
}

.about-card p {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 900px) {
  .hero-section {
    padding: 4rem 1rem 3rem;
    min-height: auto;
  }

  .search-fields {
    grid-template-columns: 1fr;
  }

  .search-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .about-section {
    padding: 3.5rem 1rem;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-card {
    padding: 1.25rem;
  }
}
</style>
