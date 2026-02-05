<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="page-container">
    <div class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">Sobre a Duarte Consultoria</h1>
        <p class="hero-subtitle">Excelência e Inovação em Consultoria Imobiliária</p>
      </div>
    </div>

    <div class="content-section">
      <div class="section-container">
        <div class="content-block">
          <h2 class="section-title">Nossa História</h2>
          <p class="text-content">
            A Duarte Consultoria Imobiliária nasceu com o propósito de revolucionar o mercado imobiliário brasileiro, 
            trazendo inovação, transparência e excelência em cada negócio. Desde o início, nossa missão tem sido 
            conectar pessoas aos seus sonhos, seja na compra, venda ou aluguel de imóveis.
          </p>
          <p class="text-content">
            Com uma equipe altamente qualificada e tecnologia de ponta, nos tornamos referência no setor, 
            atendendo clientes em todo o Brasil com profissionalismo e dedicação incomparáveis.
          </p>
        </div>

        <div class="content-block">
          <h2 class="section-title">Nossos Valores</h2>
          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon">🎯</div>
              <h3 class="value-title">Excelência</h3>
              <p class="value-text">
                Comprometimento absoluto com a qualidade em cada detalhe de nossos serviços.
              </p>
            </div>
            <div class="value-card">
              <div class="value-icon">🤝</div>
              <h3 class="value-title">Confiança</h3>
              <p class="value-text">
                Transparência e integridade em todas as nossas relações comerciais.
              </p>
            </div>
            <div class="value-card">
              <div class="value-icon">💡</div>
              <h3 class="value-title">Inovação</h3>
              <p class="value-text">
                Tecnologia e criatividade para entregar soluções únicas no mercado.
              </p>
            </div>
            <div class="value-card">
              <div class="value-icon">❤️</div>
              <h3 class="value-title">Paixão</h3>
              <p class="value-text">
                Dedicação genuína em ajudar nossos clientes a realizarem seus sonhos.
              </p>
            </div>
          </div>
        </div>

        <div class="content-block">
          <h2 class="section-title">Por Que Escolher a Duarte?</h2>
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-number">01</div>
              <div class="feature-content">
                <h3 class="feature-title">Experiência Comprovada</h3>
                <p class="feature-text">
                  Anos de experiência no mercado imobiliário com milhares de negócios bem-sucedidos.
                </p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-number">02</div>
              <div class="feature-content">
                <h3 class="feature-title">Tecnologia Avançada</h3>
                <p class="feature-text">
                  Plataforma digital completa com ferramentas modernas para facilitar sua busca.
                </p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-number">03</div>
              <div class="feature-content">
                <h3 class="feature-title">Atendimento Personalizado</h3>
                <p class="feature-text">
                  Equipe dedicada pronta para entender suas necessidades e oferecer as melhores soluções.
                </p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-number">04</div>
              <div class="feature-content">
                <h3 class="feature-title">Portfólio Exclusivo</h3>
                <p class="feature-text">
                  Acesso aos imóveis mais desejados em localidades privilegiadas de todo o Brasil.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="cta-section">
          <h2 class="cta-title">Pronto para Encontrar o Imóvel Perfeito?</h2>
          <p class="cta-text">
            Entre em contato com nossa equipe e descubra como podemos ajudar você.
          </p>
          <div class="cta-buttons">
            <router-link to="/busca" class="btn btn-primary">
              Buscar Imóveis
            </router-link>
            <router-link to="/" class="btn btn-secondary">
              Voltar para Home
            </router-link>
          </div>
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

.content-block {
  margin-bottom: 5rem;
}

.section-title {
  font-size: 2.5rem;
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
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.value-card {
  background: #f9f9f9;
  padding: 2.5rem 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.value-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1rem;
}

.value-text {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin-top: 3rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.feature-item {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.feature-number {
  font-size: 3rem;
  font-weight: 700;
  color: #e0e0e0;
  min-width: 80px;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.75rem;
}

.feature-text {
  font-size: 1.05rem;
  color: #666;
  line-height: 1.7;
}

.cta-section {
  background: #f5f5f5;
  padding: 4rem 2rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 5rem;
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
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero-banner {
    padding: 4rem 1.5rem 3rem;
  }

  .content-section {
    padding: 3rem 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .values-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-item {
    flex-direction: column;
    gap: 1rem;
  }

  .feature-number {
    font-size: 2rem;
    min-width: auto;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .cta-buttons .btn {
    width: 100%;
  }
}
</style>
