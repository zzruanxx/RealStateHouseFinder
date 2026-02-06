<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  window.scrollTo(0, 0);
});

const buscarImoveis = () => {
  router.push('/busca');
};

// Áreas de atuação
const areas = [
  {
    nome: 'Araruama',
    tipo: 'Sede Principal',
    descricao: 'Especialista no mercado local'
  },
  {
    nome: 'Búzios',
    tipo: 'Região dos Lagos',
    descricao: 'Imóveis de alto padrão e temporada'
  },
  {
    nome: 'Cabo Frio',
    tipo: 'Região dos Lagos',
    descricao: 'Residencial e comercial'
  },
  {
    nome: 'São Pedro da Aldeia',
    tipo: 'Região dos Lagos',
    descricao: 'Casas, apartamentos e terrenos'
  },
  {
    nome: 'Rio das Ostras',
    tipo: 'Região dos Lagos',
    descricao: 'Imóveis residenciais e comerciais'
  },
  {
    nome: 'Barra da Tijuca',
    tipo: 'Capital - RJ',
    descricao: 'Imóveis de alto padrão'
  },
  {
    nome: 'Zona Sul',
    tipo: 'Capital - RJ',
    descricao: 'Copacabana, Ipanema, Leblon'
  }
];
</script>

<template>
  <div class="page-container">
    <div class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">Ruan Batista</h1>
        <p class="hero-subtitle">Consultor Imobiliário - CRECI 94102</p>
      </div>
    </div>

    <div class="content-section">
      <div class="section-container">
        <!-- Apresentação -->
        <div class="intro-section">
          <div class="profile-card">
            <div class="profile-photo">
              <div class="photo-placeholder">👨‍💼</div>
            </div>
            
            <div class="profile-info">
              <h2 class="profile-name">Ruan Batista</h2>
              <p class="profile-creci">CRECI 94102</p>
              <p class="profile-title">Consultor Imobiliário Especializado</p>
              
              <div class="profile-stats">
                <div class="stat-item">
                  <span class="stat-icon">📍</span>
                  <span class="stat-label">Região dos Lagos e Capital RJ</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">🏠</span>
                  <span class="stat-label">Especialista em Imóveis</span>
                </div>
                <div class="stat-item">
                  <span class="stat-icon">⭐</span>
                  <span class="stat-label">Atendimento Personalizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sobre Mim -->
        <div class="content-block">
          <h2 class="section-title">Sobre Mim</h2>
          <p class="text-content">
            Sou consultor imobiliário com expertise na Região dos Lagos e na Capital do Rio de Janeiro. 
            Minha atuação se concentra em Araruama e municípios vizinhos como Búzios, Cabo Frio, 
            São Pedro da Aldeia e Rio das Ostras, além de atender clientes na Barra da Tijuca e Zona Sul do Rio.
          </p>
          <p class="text-content">
            Com CRECI 94102, ofereço consultoria completa e personalizada para quem busca comprar, vender ou 
            alugar imóveis nessas regiões. Meu compromisso é entender as necessidades de cada cliente e 
            encontrar as melhores oportunidades do mercado imobiliário.
          </p>
        </div>

        <!-- Áreas de Atuação -->
        <div class="content-block">
          <h2 class="section-title">Áreas de Atuação</h2>
          <div class="areas-grid">
            <div v-for="(area, index) in areas" :key="index" class="area-card">
              <div class="area-icon">📍</div>
              <h3 class="area-name">{{ area.nome }}</h3>
              <p class="area-type">{{ area.tipo }}</p>
              <p class="area-description">{{ area.descricao }}</p>
            </div>
          </div>
        </div>

        <!-- Serviços -->
        <div class="content-block">
          <h2 class="section-title">Serviços Oferecidos</h2>
          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon">🏡</div>
              <h3 class="service-title">Compra de Imóveis</h3>
              <p class="service-text">
                Auxílio completo na busca e aquisição do imóvel ideal, com análise de documentação e negociação.
              </p>
            </div>
            <div class="service-card">
              <div class="service-icon">💼</div>
              <h3 class="service-title">Venda de Imóveis</h3>
              <p class="service-text">
                Avaliação de mercado, marketing profissional e acompanhamento de todo o processo de venda.
              </p>
            </div>
            <div class="service-card">
              <div class="service-icon">🔑</div>
              <h3 class="service-title">Locação</h3>
              <p class="service-text">
                Intermediação de aluguéis residenciais e comerciais com total segurança e transparência.
              </p>
            </div>
            <div class="service-card">
              <div class="service-icon">📊</div>
              <h3 class="service-title">Consultoria</h3>
              <p class="service-text">
                Análise de investimentos, avaliação de imóveis e orientação sobre o mercado imobiliário.
              </p>
            </div>
          </div>
        </div>

        <!-- Diferenciais -->
        <div class="content-block highlight">
          <h2 class="section-title">Meus Diferenciais</h2>
          <div class="benefits-list">
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span class="benefit-text">Conhecimento profundo do mercado local da Região dos Lagos</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span class="benefit-text">Experiência com imóveis de alto padrão na Capital</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span class="benefit-text">Atendimento personalizado e dedicado a cada cliente</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span class="benefit-text">Transparência e ética em todas as negociações</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span class="benefit-text">Acompanhamento completo em todo o processo</span>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="cta-section">
          <h2 class="cta-title">Vamos Encontrar o Imóvel Ideal Para Você?</h2>
          <p class="cta-text">
            Entre em contato e descubra as melhores oportunidades na Região dos Lagos e no Rio de Janeiro.
          </p>
          <button @click="buscarImoveis" class="btn btn-primary">
            Ver Imóveis Disponíveis
          </button>
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
  background: linear-gradient(135deg, #000 0%, #333 100%);
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

.intro-section {
  margin-bottom: 5rem;
}

.profile-card {
  display: flex;
  gap: 3rem;
  align-items: center;
  background: #f9f9f9;
  padding: 3rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.profile-photo {
  flex-shrink: 0;
}

.photo-placeholder {
  width: 180px;
  height: 180px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
  border: 3px solid #e0e0e0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 0.5rem;
}

.profile-creci {
  font-size: 1.1rem;
  color: #666;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.profile-title {
  font-size: 1.3rem;
  color: #000;
  font-weight: 500;
  margin-bottom: 2rem;
}

.profile-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #333;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-label {
  font-weight: 500;
}

.content-block {
  margin-bottom: 5rem;
}

.content-block.highlight {
  background: #f5f5f5;
  padding: 3rem;
  border-radius: 12px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 2rem;
  text-align: center;
}

.text-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 1.5rem;
}

.areas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.area-card {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.area-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.area-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.area-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.5rem;
}

.area-type {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.area-description {
  font-size: 0.95rem;
  color: #333;
  line-height: 1.5;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}

.service-card {
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  text-align: center;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  border-color: #000;
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.service-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1rem;
}

.service-text {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  font-size: 1.1rem;
  color: #333;
}

.benefit-icon {
  color: #27ae60;
  font-weight: 700;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.benefit-text {
  line-height: 1.6;
}

.cta-section {
  background: #000;
  color: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 3rem;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-text {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-section .btn-primary {
  background: white;
  color: #000;
}

.cta-section .btn-primary:hover {
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .hero-banner {
    padding: 4rem 1.5rem 3rem;
  }

  .content-section {
    padding: 3rem 1.5rem;
  }

  .profile-card {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
    gap: 2rem;
  }

  .profile-name {
    font-size: 2rem;
  }

  .profile-stats {
    align-items: center;
  }

  .areas-grid,
  .services-grid {
    grid-template-columns: 1fr;
  }

  .benefit-item {
    font-size: 1rem;
  }
}
</style>
