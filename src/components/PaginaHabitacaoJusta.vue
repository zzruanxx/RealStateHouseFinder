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
        <h1 class="hero-title">Declaração de Habitação Justa</h1>
        <p class="hero-subtitle">Compromisso com Igualdade e Não Discriminação</p>
      </div>
    </div>

    <div class="content-section">
      <div class="section-container">
        <div class="legal-content">
          <section class="legal-section">
            <h2>Nosso Compromisso</h2>
            <p>
              A Ruan Batista Consultor Imobiliário está comprometida em fornecer oportunidades iguais de habitação para 
              todas as pessoas, em conformidade com as leis federais, estaduais e municipais de habitação justa. 
              Não discriminamos e proibimos a discriminação contra qualquer pessoa por motivos de:
            </p>
            <ul class="highlight-list">
              <li>Raça ou cor</li>
              <li>Religião</li>
              <li>Origem nacional ou étnica</li>
              <li>Sexo ou gênero</li>
              <li>Estado civil</li>
              <li>Orientação sexual</li>
              <li>Identidade de gênero</li>
              <li>Idade</li>
              <li>Deficiência física ou mental</li>
              <li>Situação familiar</li>
              <li>Fonte de renda</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>Práticas Proibidas</h2>
            <p>
              De acordo com as leis de habitação justa, é ilegal fazer o seguinte com base nas características 
              protegidas mencionadas acima:
            </p>
            <ul>
              <li>Recusar alugar ou vender habitação</li>
              <li>Recusar negociar para habitação</li>
              <li>Tornar a habitação indisponível</li>
              <li>Negar uma habitação</li>
              <li>Definir termos, condições ou privilégios diferentes para aluguel ou venda de uma habitação</li>
              <li>Fornecer serviços ou instalações diferentes em conexão com uma habitação</li>
              <li>Falsamente negar que a habitação está disponível para inspeção, aluguel ou venda</li>
              <li>Para fins lucrativos, persuadir os proprietários a vender ou alugar (blockbusting)</li>
              <li>Negar acesso ou associação a qualquer organização relacionada à venda ou aluguel de habitação</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>Acessibilidade</h2>
            <p>
              Estamos comprometidos em fornecer habitação acessível para pessoas com deficiência. Isso inclui:
            </p>
            <ul>
              <li>Permitir que os inquilinos façam modificações razoáveis nas instalações</li>
              <li>Fazer acomodações razoáveis em regras, políticas, práticas ou serviços</li>
              <li>Garantir que novos edifícios multifamiliares sejam acessíveis</li>
              <li>Fornecer informações acessíveis sobre propriedades disponíveis</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>Publicidade</h2>
            <p>
              Toda a publicidade de imóveis em nosso portal segue os princípios de habitação justa. Não fazemos, 
              imprimimos ou publicamos anúncios que:
            </p>
            <ul>
              <li>Indicam qualquer preferência, limitação ou discriminação baseada em características protegidas</li>
              <li>Usam palavras, frases, fotografias, ilustrações ou símbolos que sugerem discriminação</li>
              <li>Direcionam ou desencorajam a investigação de moradia por qualquer grupo protegido</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>Processo de Seleção</h2>
            <p>
              Nosso processo de seleção de inquilinos e compradores é baseado em critérios objetivos e não 
              discriminatórios, incluindo:
            </p>
            <ul>
              <li>Histórico de crédito e capacidade financeira</li>
              <li>Histórico de aluguel anterior</li>
              <li>Verificação de emprego e renda</li>
              <li>Referências pessoais e profissionais</li>
            </ul>
            <p>
              Esses critérios são aplicados de forma consistente a todos os candidatos, independentemente de suas 
              características protegidas.
            </p>
          </section>

          <section class="legal-section">
            <h2>Treinamento</h2>
            <p>
              Todos os nossos corretores e funcionários recebem treinamento regular sobre leis de habitação justa 
              e práticas não discriminatórias. Estamos comprometidos em:
            </p>
            <ul>
              <li>Manter conhecimento atualizado sobre leis de habitação justa</li>
              <li>Implementar políticas que promovam igualdade de oportunidades</li>
              <li>Revisar regularmente nossas práticas para garantir conformidade</li>
              <li>Responder prontamente a quaisquer preocupações sobre discriminação</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>Como Denunciar Discriminação</h2>
            <p>
              Se você acredita que foi discriminado em uma transação imobiliária, você pode:
            </p>
            <ul>
              <li><strong>Entrar em Contato Conosco:</strong> privacidade@duarte.com.br ou (11) 1234-5678</li>
              <li><strong>Ministério Público:</strong> Apresentar uma queixa junto ao Ministério Público</li>
              <li><strong>Defensoria Pública:</strong> Buscar assistência jurídica gratuita</li>
              <li><strong>Conselho Regional de Corretores de Imóveis (CRECI):</strong> Registrar reclamação</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>Compromisso Contínuo</h2>
            <p>
              A Ruan Batista Consultor Imobiliário reafirma seu compromisso contínuo com a habitação justa e igualdade 
              de oportunidades. Acreditamos que todas as pessoas merecem acesso justo e igual a oportunidades de 
              habitação, e trabalharemos incansavelmente para garantir que esse princípio seja mantido em todas as 
              nossas operações.
            </p>
          </section>

          <div class="logo-section">
            <div class="equal-housing-logo">
              <div class="logo-icon">⚖️</div>
              <p class="logo-text">Oportunidade Igual de Habitação</p>
            </div>
          </div>

          <div class="back-section">
            <router-link to="/" class="btn btn-secondary">
              ← Voltar para Home
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
  font-size: clamp(1rem, 2vw, 1.2rem);
  opacity: 0.9;
  font-weight: 400;
}

.content-section {
  padding: 5rem 2rem;
}

.section-container {
  max-width: 900px;
  margin: 0 auto;
}

.legal-content {
  background: white;
}

.legal-section {
  margin-bottom: 3rem;
}

.legal-section h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1rem;
}

.legal-section p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 1rem;
}

.legal-section ul {
  margin-left: 2rem;
  margin-top: 1rem;
}

.legal-section li {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 0.75rem;
}

.highlight-list {
  background: #f9f9f9;
  padding: 1.5rem 2rem 1.5rem 3rem;
  border-left: 4px solid #000;
  border-radius: 4px;
}

.logo-section {
  text-align: center;
  margin: 4rem 0;
  padding: 3rem;
  background: #f9f9f9;
  border-radius: 12px;
}

.equal-housing-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  font-size: 4rem;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.back-section {
  text-align: center;
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid #e0e0e0;
}

@media (max-width: 768px) {
  .hero-banner {
    padding: 4rem 1.5rem 3rem;
  }

  .content-section {
    padding: 3rem 1.5rem;
  }

  .legal-section h2 {
    font-size: 1.5rem;
  }

  .legal-section p,
  .legal-section li {
    font-size: 1rem;
  }

  .logo-section {
    padding: 2rem 1.5rem;
  }
}
</style>
