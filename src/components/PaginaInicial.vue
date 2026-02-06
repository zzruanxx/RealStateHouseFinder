<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { databases, storage, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID, Query } from '../appwrite';
import { config } from '../config';

const router = useRouter();

// Busca Hero
const buscaHero = ref({
  searchQuery: ''
});

// Contact Form
const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  topic: '',
  message: ''
});

// Imóveis em Destaque
const imoveisDestaque = ref([]);
const isLoading = ref(false);

const buscarHero = () => {
  router.push({
    path: '/busca',
    query: { q: buscaHero.value.searchQuery }
  });
};

const searchRegion = (region) => {
  router.push({
    path: '/busca',
    query: { cidade: region }
  });
};

const handleContactSubmit = () => {
  // Validate required fields
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.phone || !contactForm.value.message) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactForm.value.email)) {
    alert('Por favor, insira um email válido.');
    return;
  }

  // Sanitize inputs to prevent XSS
  const sanitize = (str) => str.replace(/[<>]/g, '');
  
  // Open WhatsApp with pre-filled message using config phone
  const message = `Olá! Meu nome é ${sanitize(contactForm.value.name)}.
Email: ${sanitize(contactForm.value.email)}
Telefone: ${sanitize(contactForm.value.phone)}
Assunto: ${sanitize(contactForm.value.topic)}
Mensagem: ${sanitize(contactForm.value.message)}`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${config.contact.phone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
  
  // Reset form
  contactForm.value = {
    name: '',
    email: '',
    phone: '',
    topic: '',
    message: ''
  };
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
    <!-- Hero Section SERHANT Style -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="hero-tagline">
          Faça Um Movimento Para Seu Futuro.
        </p>
        <h1 class="hero-title">
          A Marca Imobiliária Mais Seguida e Inscrita do Brasil
        </h1>

        <form @submit.prevent="buscarHero" class="hero-search">
          <input
            type="text"
            v-model="buscaHero.searchQuery"
            placeholder="Pesquisar propriedades e localizações..."
            class="search-input-main"
          />
        </form>
      </div>
    </section>

    <!-- Regions Section -->
    <section class="regions-section">
      <div class="section-container">
        <h2 class="section-title">Nossas Regiões</h2>
        <p class="section-subtitle">Descubra a casa que você está esperando.</p>
        
        <div class="regions-grid">
          <button class="region-card" @click="searchRegion('Araruama')" type="button">
            <div class="region-name">Araruama</div>
          </button>
          <button class="region-card" @click="searchRegion('Búzios')" type="button">
            <div class="region-name">Búzios</div>
          </button>
          <button class="region-card" @click="searchRegion('Cabo Frio')" type="button">
            <div class="region-name">Cabo Frio</div>
          </button>
          <button class="region-card" @click="searchRegion('São Pedro da Aldeia')" type="button">
            <div class="region-name">São Pedro da Aldeia</div>
          </button>
          <button class="region-card" @click="searchRegion('Rio das Ostras')" type="button">
            <div class="region-name">Rio das Ostras</div>
          </button>
          <button class="region-card" @click="searchRegion('Barra da Tijuca')" type="button">
            <div class="region-name">Barra da Tijuca</div>
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Properties Section -->
    <section class="featured-section">
      <div class="section-container">
        <h2 class="section-title">Propriedades em Destaque</h2>
        <p class="section-subtitle">Confira algumas de nossas casas, apartamentos, coberturas e muito mais exclusivos.</p>
        
        <!-- Filters -->
        <div class="filters-container">
          <div class="filter-group">
            <button class="filter-btn active">Comprar</button>
            <button class="filter-btn">Alugar</button>
          </div>
          <div class="filter-group">
            <span class="filter-label">Quartos</span>
            <select class="filter-select">
              <option>Qualquer</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
              <option>4+</option>
              <option>5+</option>
            </select>
          </div>
          <div class="filter-group">
            <span class="filter-label">Banheiros</span>
            <select class="filter-select">
              <option>Qualquer</option>
              <option>1+</option>
              <option>2+</option>
              <option>3+</option>
              <option>4+</option>
              <option>5+</option>
            </select>
          </div>
          <div class="filter-group">
            <span class="filter-label">Tipo</span>
            <select class="filter-select">
              <option>Todos</option>
              <option>Casa</option>
              <option>Apartamento</option>
              <option>Cobertura</option>
              <option>Comercial</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Carregando propriedades...</p>
      </div>

      <div v-else-if="imoveisDestaque.length === 0" class="empty-state">
        <p>Nenhuma propriedade disponível no momento.</p>
      </div>

      <div v-else class="section-container">
        <div class="properties-grid">
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
              </div>

              <div class="property-content">
                <div class="property-status-badge">{{ imovel.tipo_anuncio === 'venda' ? 'À Venda' : 'Para Alugar' }}</div>
                
                <div class="property-price">
                  {{
                    imovel.tipo_anuncio === 'aluguel'
                      ? formatarPreco(imovel.preco_aluguel)
                      : formatarPreco(imovel.preco_venda)
                  }}
                </div>

                <h3 class="property-title">{{ imovel.titulo }}</h3>
                
                <div class="property-location">
                  {{ imovel.bairro }}, {{ imovel.cidade }}
                </div>

                <div class="property-features">
                  <span v-if="imovel.quartos">{{ imovel.quartos }} Quartos</span>
                  <span v-if="imovel.banheiros">{{ imovel.banheiros }} Banheiros</span>
                  <span v-if="imovel.area_util_m2">{{ imovel.area_util_m2 }} m²</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-section">
      <div class="section-container">
        <h2 class="section-title-dark">Por que Ruan Batista Consultor Imobiliário</h2>
        
        <div class="why-grid">
          <div class="why-card">
            <h3>Conhecimento Local</h3>
            <p class="why-subtitle">Especialista da Região.</p>
            <p>Conhecimento profundo do mercado imobiliário da Região dos Lagos e Capital, com expertise em Araruama, Búzios, Cabo Frio, São Pedro da Aldeia, Rio das Ostras, Barra e Zona Sul.</p>
          </div>

          <div class="why-card">
            <h3>Atendimento Personalizado</h3>
            <p class="why-subtitle">Consultoria Individualizada.</p>
            <p>Cada cliente recebe atendimento dedicado e personalizado, com foco em entender necessidades específicas e encontrar o imóvel ideal.</p>
          </div>

          <div class="why-card">
            <h3>Transparência e Confiança</h3>
            <p class="why-subtitle">CRECI 94102.</p>
            <p>Profissionalismo e ética em todas as negociações, com total transparência e compromisso com seus objetivos imobiliários.</p>
          </div>
        </div>

        <div class="stats-section">
          <div class="stat-box">
            <div class="stat-value">CRECI</div>
            <div class="stat-label">94102</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">7+</div>
            <div class="stat-label">cidades atendidas</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">2</div>
            <div class="stat-label">regiões de atuação</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">100%</div>
            <div class="stat-label">dedicação aos clientes</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="section-container">
        <h2 class="section-title-dark">Entre em Contato</h2>
        
        <form class="contact-form" @submit.prevent="handleContactSubmit">
          <div class="form-row">
            <div class="form-group">
              <label>Nome *</label>
              <input type="text" v-model="contactForm.name" required />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" v-model="contactForm.email" required />
            </div>
          </div>
          
          <div class="form-group">
            <label>Telefone *</label>
            <input type="tel" v-model="contactForm.phone" required />
          </div>
          
          <div class="form-group">
            <label>Selecione um Tópico</label>
            <select v-model="contactForm.topic">
              <option>Selecione um Tópico</option>
              <option>Comprar Imóvel</option>
              <option>Vender Imóvel</option>
              <option>Alugar Imóvel</option>
              <option>Informações Gerais</option>
              <option>Tornar-se Corretor</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Sua Mensagem *</label>
            <textarea v-model="contactForm.message" rows="5" required></textarea>
          </div>
          
          <button type="submit" class="submit-btn">Enviar</button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  padding: 0;
  background: #000;
}

/* Hero Section - SERHANT Style */
.hero-section {
  position: relative;
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%), 
              url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect fill="%23111" width="1200" height="600"/></svg>');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 8rem 2rem 6rem;
  text-align: center;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
}

.hero-tagline {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  color: rgba(255,255,255,0.9);
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 3rem;
  line-height: 1.2;
}

.hero-search {
  max-width: 700px;
  margin: 0 auto;
}

.search-input-main {
  width: 100%;
  padding: 1.5rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  background: white;
  color: #000;
}

.search-input-main::placeholder {
  color: #666;
}

/* Regions Section */
.regions-section {
  background: #fff;
  padding: 5rem 2rem;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: #000;
}

.section-subtitle {
  font-size: 1.2rem;
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
}

.regions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.region-card {
  background: #f5f5f5;
  padding: 2.5rem 1.5rem;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.region-card:hover {
  background: #000;
  color: #fff;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.region-name {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Featured Properties Section */
.featured-section {
  background: #f9f9f9;
  padding: 5rem 2rem;
}

.filters-container {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin: 3rem 0;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background: #fff;
  color: #000;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.filter-btn.active,
.filter-btn:hover {
  background: #000;
  color: #fff;
  border-color: #000;
}

.filter-label {
  font-weight: 600;
  color: #000;
  margin-right: 0.5rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #000;
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
  color: #666;
}

/* Properties Grid */
.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.property-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.property-card {
  background: white;
  border-radius: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.property-image {
  position: relative;
  height: 250px;
  background: #f0f0f0;
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
  color: #999;
  font-size: 1.1rem;
  background: #f0f0f0;
}

.property-content {
  padding: 1.5rem;
}

.property-status-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: #000;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.property-price {
  font-size: 1.8rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 0.5rem;
}

.property-title {
  font-size: 1.1rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 0.5rem;
  min-height: 2.5rem;
}

.property-location {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.property-features {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #666;
}

.property-features span {
  font-weight: 500;
}

/* Why Section */
.why-section {
  background: #fff;
  padding: 5rem 2rem;
}

.section-title-dark {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #000;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
}

.why-card {
  text-align: left;
}

.why-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #000;
}

.why-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 1rem;
}

.why-card p {
  color: #666;
  line-height: 1.6;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  text-align: center;
}

.stat-box {
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.stat-value {
  font-size: 3rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  text-transform: lowercase;
}

/* Contact Section */
.contact-section {
  background: #f9f9f9;
  padding: 5rem 2rem;
}

.contact-form {
  max-width: 700px;
  margin: 2rem auto 0;
  background: #fff;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #000;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #000;
}

.submit-btn {
  width: 100%;
  padding: 1.2rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #333;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 5rem 1rem 4rem;
  }

  .regions-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .filters-container {
    flex-direction: column;
    gap: 1rem;
  }

  .properties-grid {
    grid-template-columns: 1fr;
  }

  .why-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .contact-form {
    padding: 2rem 1.5rem;
  }
}
</style>
