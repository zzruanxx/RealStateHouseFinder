<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  window.scrollTo(0, 0);
});

const escritorios = [
  {
    nome: 'Araruama - Sede',
    endereco: 'Centro', // TODO: Atualizar com endereço específico
    cidade: 'Araruama, RJ',
    telefone: '(22) 99999-9999', // TODO: Atualizar com número real
    email: 'contato@ruanbatista.com.br',
    horario: 'Seg-Sex: 9h-18h | Sáb: 9h-13h'
  },
  {
    nome: 'Búzios',
    endereco: 'Centro',
    cidade: 'Armação dos Búzios, RJ',
    telefone: '(22) 99999-9999',
    email: 'contato@ruanbatista.com.br',
    horario: 'Atendimento por agendamento'
  },
  {
    nome: 'Cabo Frio',
    endereco: 'Centro',
    cidade: 'Cabo Frio, RJ',
    telefone: '(22) 99999-9999',
    email: 'contato@ruanbatista.com.br',
    horario: 'Atendimento por agendamento'
  },
  {
    nome: 'São Pedro da Aldeia',
    endereco: 'Centro',
    cidade: 'São Pedro da Aldeia, RJ',
    telefone: '(22) 99999-9999',
    email: 'contato@ruanbatista.com.br',
    horario: 'Atendimento por agendamento'
  },
  {
    nome: 'Rio das Ostras',
    endereco: 'Centro',
    cidade: 'Rio das Ostras, RJ',
    telefone: '(22) 99999-9999',
    email: 'contato@ruanbatista.com.br',
    horario: 'Atendimento por agendamento'
  },
  {
    nome: 'Barra da Tijuca',
    endereco: 'Barra da Tijuca',
    cidade: 'Rio de Janeiro, RJ',
    telefone: '(22) 99999-9999',
    email: 'contato@ruanbatista.com.br',
    horario: 'Atendimento por agendamento'
  },
  {
    nome: 'Zona Sul',
    endereco: 'Copacabana, Ipanema, Leblon',
    cidade: 'Rio de Janeiro, RJ',
    telefone: '(22) 99999-9999',
    email: 'contato@ruanbatista.com.br',
    horario: 'Atendimento por agendamento'
  }
];
</script>

<template>
  <div class="page-container">
    <div class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">Áreas de Atendimento</h1>
        <p class="hero-subtitle">Presente na Região dos Lagos e Capital do Rio de Janeiro</p>
      </div>
    </div>

    <div class="content-section">
      <div class="section-container">
        <div class="intro-text">
          <p class="text-content">
            Ruan Batista Consultor Imobiliário atende clientes em toda a Região dos Lagos e na capital do 
            Rio de Janeiro, oferecendo consultoria personalizada e conhecimento profundo do mercado local. 
            Entre em contato para agendar uma visita ou reunião.
          </p>
        </div>

        <div class="offices-grid">
          <div v-for="(escritorio, index) in escritorios" :key="index" class="office-card">
            <div class="office-header">
              <div class="office-icon">📍</div>
              <h3 class="office-name">{{ escritorio.nome }}</h3>
            </div>
            
            <div class="office-details">
              <div class="detail-item">
                <span class="detail-icon">📍</span>
                <div class="detail-content">
                  <strong>Endereço:</strong><br>
                  {{ escritorio.endereco }}<br>
                  {{ escritorio.cidade }}
                </div>
              </div>
              
              <div class="detail-item">
                <span class="detail-icon">📞</span>
                <div class="detail-content">
                  <strong>Telefone:</strong><br>
                  <a :href="`tel:${escritorio.telefone.replace(/\D/g, '')}`" class="contact-link">
                    {{ escritorio.telefone }}
                  </a>
                </div>
              </div>
              
              <div class="detail-item">
                <span class="detail-icon">✉️</span>
                <div class="detail-content">
                  <strong>E-mail:</strong><br>
                  <a :href="`mailto:${escritorio.email}`" class="contact-link">
                    {{ escritorio.email }}
                  </a>
                </div>
              </div>
              
              <div class="detail-item">
                <span class="detail-icon">🕐</span>
                <div class="detail-content">
                  <strong>Horário:</strong><br>
                  {{ escritorio.horario }}
                </div>
              </div>
            </div>

            <div class="office-actions">
              <router-link to="/busca" class="btn btn-primary btn-small">
                Ver Imóveis
              </router-link>
            </div>
          </div>
        </div>

        <div class="cta-section">
          <h2 class="cta-title">Não Encontrou um Escritório Próximo?</h2>
          <p class="cta-text">
            Entre em contato conosco e descubra como podemos atendê-lo, independentemente da sua localização.
          </p>
          <div class="cta-buttons">
            <router-link to="/" class="btn btn-primary">
              Fale Conosco
            </router-link>
            <router-link to="/busca" class="btn btn-secondary">
              Buscar Imóveis
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

.offices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-bottom: 5rem;
}

.office-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.office-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.office-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.office-icon {
  font-size: 2rem;
}

.office-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.office-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.detail-icon {
  font-size: 1.2rem;
  min-width: 24px;
}

.detail-content {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
}

.detail-content strong {
  color: #000;
  font-weight: 600;
}

.contact-link {
  color: #000;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.contact-link:hover {
  opacity: 0.7;
}

.office-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.btn-small {
  padding: 0.65rem 1.25rem;
  font-size: 0.95rem;
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

  .offices-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .office-card {
    padding: 1.5rem;
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
