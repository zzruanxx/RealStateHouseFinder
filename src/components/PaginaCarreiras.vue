<script setup>
import { onMounted, ref } from 'vue';

onMounted(() => {
  window.scrollTo(0, 0);
});

const vagasAbertas = [
  {
    titulo: 'Corretor de Imóveis',
    localizacao: 'Região dos Lagos, RJ',
    tipo: 'Parceria',
    descricao: 'Buscamos corretores para atuar na Região dos Lagos com foco em Araruama, Búzios, Cabo Frio, São Pedro da Aldeia e Rio das Ostras.',
    requisitos: ['CRECI ativo', 'Conhecimento da região', 'Habilidades de negociação', 'Proatividade']
  },
  {
    titulo: 'Corretor de Imóveis',
    localizacao: 'Barra da Tijuca e Zona Sul, RJ',
    tipo: 'Parceria',
    descricao: 'Oportunidade para corretores que desejam atuar na Barra da Tijuca e Zona Sul (Copacabana, Ipanema, Leblon).',
    requisitos: ['CRECI ativo', 'Experiência no mercado carioca', 'Relacionamento com clientes', 'Flexibilidade de horários']
  },
  {
    titulo: 'Assistente Comercial',
    localizacao: 'Araruama, RJ',
    tipo: 'Tempo Integral',
    descricao: 'Auxílio nas atividades comerciais, atendimento a clientes e suporte administrativo.',
    requisitos: ['Ensino médio completo', 'Boa comunicação', 'Organização', 'Conhecimento em informática']
  }
];

const formData = ref({
  nome: '',
  email: '',
  telefone: '',
  vaga: '',
  linkedin: '',
  mensagem: ''
});

const handleSubmit = () => {
  if (!formData.value.nome || !formData.value.email || !formData.value.telefone) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.email)) {
    alert('Por favor, insira um email válido.');
    return;
  }

  alert('Candidatura enviada com sucesso! Entraremos em contato em breve.');
  
  formData.value = {
    nome: '',
    email: '',
    telefone: '',
    vaga: '',
    linkedin: '',
    mensagem: ''
  };
};
</script>

<template>
  <div class="page-container">
    <div class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">Trabalhe Conosco</h1>
        <p class="hero-subtitle">Junte-se à equipe Ruan Batista Consultor Imobiliário</p>
      </div>
    </div>

    <div class="content-section">
      <div class="section-container">
        <div class="intro-block">
          <h2 class="section-title">Por Que Trabalhar Conosco?</h2>
          <p class="text-content">
            Com Ruan Batista Consultor Imobiliário, você terá a oportunidade de crescer no mercado imobiliário 
            da Região dos Lagos e Capital do RJ, trabalhando em parceria com um profissional experiente. 
            Oferecemos suporte completo e comissões justas para corretores parceiros.
          </p>
        </div>

        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">💰</div>
            <h3 class="benefit-title">Comissões Justas</h3>
            <p class="benefit-text">Sistema de comissionamento transparente e competitivo</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">📈</div>
            <h3 class="benefit-title">Crescimento na Carreira</h3>
            <p class="benefit-text">Oportunidades de desenvolvimento no mercado imobiliário</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🤝</div>
            <h3 class="benefit-title">Parceria Sólida</h3>
            <p class="benefit-text">Suporte e orientação constante para atingir suas metas</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🎯</div>
            <h3 class="benefit-title">Mercado Aquecido</h3>
            <p class="benefit-text">Atuação em regiões valorizadas e de alta demanda</p>
          </div>
        </div>

        <div class="jobs-section">
          <h2 class="section-title">Vagas Abertas</h2>
          <div class="jobs-grid">
            <div v-for="(vaga, index) in vagasAbertas" :key="index" class="job-card">
              <div class="job-header">
                <h3 class="job-title">{{ vaga.titulo }}</h3>
                <div class="job-meta">
                  <span class="job-location">📍 {{ vaga.localizacao }}</span>
                  <span class="job-type">⏰ {{ vaga.tipo }}</span>
                </div>
              </div>
              
              <p class="job-description">{{ vaga.descricao }}</p>
              
              <div class="job-requirements">
                <strong>Requisitos:</strong>
                <ul class="requirements-list">
                  <li v-for="(req, idx) in vaga.requisitos" :key="idx">{{ req }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="application-section">
          <h2 class="section-title">Candidate-se</h2>
          <p class="text-content">
            Preencha o formulário abaixo com suas informações e entraremos em contato.
          </p>
          
          <form @submit.prevent="handleSubmit" class="application-form">
            <div class="form-row">
              <div class="form-group">
                <label>Nome Completo *</label>
                <input type="text" v-model="formData.nome" required />
              </div>
              <div class="form-group">
                <label>E-mail *</label>
                <input type="email" v-model="formData.email" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Telefone *</label>
                <input type="tel" v-model="formData.telefone" required />
              </div>
              <div class="form-group">
                <label>Vaga de Interesse</label>
                <select v-model="formData.vaga">
                  <option value="">Selecione uma vaga</option>
                  <option v-for="(vaga, index) in vagasAbertas" :key="index" :value="vaga.titulo">
                    {{ vaga.titulo }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>LinkedIn (opcional)</label>
              <input type="url" v-model="formData.linkedin" placeholder="https://linkedin.com/in/seu-perfil" />
            </div>

            <div class="form-group">
              <label>Mensagem / Por que você quer trabalhar conosco?</label>
              <textarea v-model="formData.mensagem" rows="5"></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-submit">
              Enviar Candidatura
            </button>
          </form>
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

.intro-block {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1.5rem;
}

.text-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 5rem;
}

.benefit-card {
  background: #f9f9f9;
  padding: 2.5rem 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.benefit-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.75rem;
}

.benefit-text {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}

.jobs-section {
  margin-bottom: 5rem;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.job-card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.job-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.job-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.job-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.75rem;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.job-location,
.job-type {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.job-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #333;
  margin-bottom: 1.5rem;
}

.job-requirements {
  font-size: 0.95rem;
  color: #333;
}

.job-requirements strong {
  color: #000;
  font-weight: 600;
}

.requirements-list {
  margin-top: 0.75rem;
  margin-left: 1.5rem;
  color: #666;
  line-height: 1.8;
}

.application-section {
  background: #f5f5f5;
  padding: 4rem 2rem;
  border-radius: 12px;
}

.application-section .section-title {
  text-align: center;
}

.application-section .text-content {
  text-align: center;
  margin-bottom: 3rem;
}

.application-form {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #000;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.9rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #000;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.btn-submit {
  margin-top: 1rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
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

  .benefits-grid,
  .jobs-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .application-section {
    padding: 3rem 1.5rem;
  }
}
</style>
