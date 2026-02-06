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
        <h1 class="hero-title">Termos de Uso</h1>
        <p class="hero-subtitle">Última atualização: Fevereiro de 2026</p>
      </div>
    </div>

    <div class="content-section">
      <div class="section-container">
        <div class="legal-content">
          <section class="legal-section">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o portal da Ruan Batista Consultor Imobiliário, você concorda em cumprir e estar vinculado 
              aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, 
              não utilize nosso serviço.
            </p>
          </section>

          <section class="legal-section">
            <h2>2. Uso do Serviço</h2>
            <p>
              Nosso portal fornece informações sobre imóveis disponíveis para venda e aluguel. Você concorda em usar 
              o serviço apenas para fins legais e de acordo com estes Termos de Uso.
            </p>
            <h3>Você concorda em NÃO:</h3>
            <ul>
              <li>Usar o serviço de forma que viole qualquer lei ou regulamento aplicável</li>
              <li>Enviar ou transmitir qualquer conteúdo ofensivo, difamatório ou ilegal</li>
              <li>Tentar obter acesso não autorizado ao sistema ou à rede</li>
              <li>Interferir ou interromper o serviço ou servidores</li>
              <li>Usar o serviço para fins comerciais sem nossa autorização</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>3. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo presente neste portal, incluindo textos, gráficos, logotipos, imagens, áudio, vídeo e 
              software, é propriedade da Ruan Batista Consultor Imobiliário ou de seus fornecedores de conteúdo e está 
              protegido pelas leis de direitos autorais brasileiras e internacionais.
            </p>
          </section>

          <section class="legal-section">
            <h2>4. Informações sobre Imóveis</h2>
            <p>
              Nos esforçamos para manter as informações sobre imóveis precisas e atualizadas. No entanto, não 
              garantimos a exatidão, completude ou atualidade de qualquer informação apresentada. As características 
              dos imóveis podem estar sujeitas a alterações sem aviso prévio.
            </p>
          </section>

          <section class="legal-section">
            <h2>5. Cadastro e Conta</h2>
            <p>
              Para acessar recursos específicos do portal, como o painel administrativo, pode ser necessário criar 
              uma conta. Você é responsável por:
            </p>
            <ul>
              <li>Manter a confidencialidade de suas informações de conta</li>
              <li>Todas as atividades que ocorrem em sua conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>6. Limitação de Responsabilidade</h2>
            <p>
              A Ruan Batista Consultor Imobiliário não será responsável por quaisquer danos diretos, indiretos, incidentais, 
              especiais, consequenciais ou punitivos resultantes do uso ou incapacidade de usar o serviço, incluindo, 
              mas não se limitando a:
            </p>
            <ul>
              <li>Perda de lucros ou receitas</li>
              <li>Perda de dados ou informações</li>
              <li>Interrupção de negócios</li>
              <li>Erros ou omissões no conteúdo</li>
            </ul>
          </section>

          <section class="legal-section">
            <h2>7. Links para Sites de Terceiros</h2>
            <p>
              Nosso portal pode conter links para sites de terceiros. Não somos responsáveis pelo conteúdo, políticas 
              de privacidade ou práticas de sites de terceiros. Recomendamos que você leia os termos e políticas de 
              qualquer site de terceiros que visitar.
            </p>
          </section>

          <section class="legal-section">
            <h2>8. Modificações dos Termos</h2>
            <p>
              Reservamos o direito de modificar ou substituir estes Termos de Uso a qualquer momento. É sua 
              responsabilidade revisar periodicamente estes termos. O uso continuado do serviço após quaisquer 
              alterações constitui aceitação dessas alterações.
            </p>
          </section>

          <section class="legal-section">
            <h2>9. Lei Aplicável</h2>
            <p>
              Estes Termos de Uso são regidos e interpretados de acordo com as leis do Brasil, sem considerar 
              conflitos de disposições legais. Você concorda em se submeter à jurisdição exclusiva dos tribunais 
              brasileiros para resolver qualquer disputa relacionada a estes termos.
            </p>
          </section>

          <section class="legal-section">
            <h2>10. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <ul class="contact-list">
              <li><strong>E-mail:</strong> contato@ruanbatista.com.br</li>
              <li><strong>Telefone:</strong> (22) 99999-9999</li>
              <li><strong>Endereço:</strong> Araruama, RJ - Região dos Lagos</li>
            </ul>
          </section>

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

.legal-section h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
  margin: 1.5rem 0 1rem;
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

.contact-list {
  list-style: none;
  margin-left: 0;
}

.contact-list li {
  margin-bottom: 0.5rem;
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

  .legal-section h3 {
    font-size: 1.2rem;
  }

  .legal-section p,
  .legal-section li {
    font-size: 1rem;
  }
}
</style>
