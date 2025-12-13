<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { databases, storage, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID } from '../appwrite';

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const imovel = ref(null);
const fotosUrls = ref([]);
const fotoAtiva = ref('');

// Formulário de contato
const formContato = ref({
  nome: '',
  email: '',
  telefone: '',
  mensagem: ''
});
const contatoEnviado = ref(false);

const carregarImovel = async () => {
  isLoading.value = true;
  try {
    // Buscar documento
    const response = await databases.getDocument(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      route.params.id
    );

    imovel.value = response;

    // Gerar URLs das fotos
    if (response.fotos_storage_ids && response.fotos_storage_ids.length > 0) {
      fotosUrls.value = response.fotos_storage_ids.map(fotoId =>
        storage.getFilePreview(
          BUCKET_FOTOS_ID,
          fotoId,
          800,
          600,
          'center',
          100
        ).href
      );
      fotoAtiva.value = fotosUrls.value[0];
    }

  } catch (error) {
    console.error('Erro ao carregar imóvel:', error);
  } finally {
    isLoading.value = false;
  }
};

const selecionarFoto = (url) => {
  fotoAtiva.value = url;
};

const formatarPreco = (preco) => {
  if (!preco) return 'Consulte';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco);
};

const enviarContato = () => {
  // Aqui você pode implementar o envio do formulário
  // Por exemplo, salvar em uma coleção de leads no Appwrite
  console.log('Formulário de contato:', formContato.value);
  contatoEnviado.value = true;

  // Limpar formulário
  setTimeout(() => {
    formContato.value = {
      nome: '',
      email: '',
      telefone: '',
      mensagem: ''
    };
    contatoEnviado.value = false;
  }, 3000);
};

const voltarParaBusca = () => {
  router.push('/busca');
};

// Lightbox
const showLightbox = ref(false);
const lightboxIndex = ref(0);

const abrirLightbox = (index) => {
  lightboxIndex.value = index;
  showLightbox.value = true;
  document.body.style.overflow = 'hidden';
};

const fecharLightbox = () => {
  showLightbox.value = false;
  document.body.style.overflow = '';
};

const proximaFoto = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % fotosUrls.value.length;
};

const fotoAnterior = () => {
  lightboxIndex.value = (lightboxIndex.value - 1 + fotosUrls.value.length) % fotosUrls.value.length;
};

// WhatsApp
const contatarWhatsApp = () => {
  const telefone = '5511999999999'; // Configure o número do corretor
  const mensagem = `Olá! Tenho interesse no imóvel: ${imovel.value.titulo}`;
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
};

// Compartilhar
const compartilhar = async () => {
  const url = window.location.href;
  const texto = `Confira este imóvel: ${imovel.value.titulo}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: imovel.value.titulo,
        text: texto,
        url: url
      });
    } catch (error) {
      copiarLink();
    }
  } else {
    copiarLink();
  }
};

const copiarLink = () => {
  navigator.clipboard.writeText(window.location.href);
  alert('Link copiado para a área de transferência!');
};

onMounted(() => {
  carregarImovel();
});
</script>

<template>
  <div class="detalhe-container">
    <!-- Back Button -->
    <button @click="voltarParaBusca" class="btn btn-secondary btn-voltar">
      ← Voltar para busca
    </button>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Carregando imóvel...</p>
    </div>

    <!-- Conteúdo do Imóvel -->
    <div v-else-if="imovel" class="detalhe-content">
      <!-- Galeria de Fotos -->
      <div class="galeria-section">
        <div class="foto-principal" @click="abrirLightbox(fotosUrls.indexOf(fotoAtiva))">
          <img
            v-if="fotoAtiva"
            :src="fotoAtiva"
            :alt="`Foto principal - ${imovel.titulo}`"
            loading="lazy"
            class="foto-principal-img"
          />
          <div v-else class="foto-placeholder">
            <span>Sem foto disponível</span>
          </div>
          <div v-if="fotoAtiva" class="foto-zoom-hint">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
            </svg>
            Clique para ampliar
          </div>
        </div>

        <div v-if="fotosUrls.length > 1" class="miniaturas">
          <div
            v-for="(url, index) in fotosUrls"
            :key="index"
            @click="selecionarFoto(url)"
            class="miniatura"
            :class="{ active: url === fotoAtiva }"
          >
            <img :src="url" :alt="`Foto ${index + 1} - ${imovel.titulo}`" loading="lazy" />
          </div>
        </div>
      </div>

      <!-- Informações Principais -->
      <div class="info-section">
        <div class="info-header">
          <h1 class="imovel-titulo">{{ imovel.titulo }}</h1>
          <span class="imovel-badge">{{ imovel.tipo_anuncio }}</span>
        </div>

        <p class="imovel-localizacao">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          {{ imovel.bairro }}, {{ imovel.cidade }}
        </p>
        
        <p v-if="imovel.endereco" class="imovel-endereco">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          {{ imovel.endereco }}
        </p>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="contatarWhatsApp" class="btn btn-whatsapp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>
          <button @click="compartilhar" class="btn btn-share">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Compartilhar
          </button>
        </div>

        <div class="preco-section">
          <div class="preco-principal">
            <span class="preco-label">
              {{ imovel.tipo_anuncio === 'aluguel' ? 'Aluguel' : 'Venda' }}
            </span>
            <span class="preco-valor">
              {{
                imovel.tipo_anuncio === 'aluguel'
                  ? formatarPreco(imovel.preco_aluguel)
                  : formatarPreco(imovel.preco_venda)
              }}
              <span v-if="imovel.tipo_anuncio === 'aluguel'" class="preco-periodo">/mês</span>
            </span>
          </div>

          <div v-if="imovel.valor_condominio || imovel.valor_iptu" class="custos-adicionais">
            <div v-if="imovel.valor_condominio" class="custo-item">
              <span class="custo-label">Condomínio:</span>
              <span class="custo-valor">{{ formatarPreco(imovel.valor_condominio) }}</span>
            </div>
            <div v-if="imovel.valor_iptu" class="custo-item">
              <span class="custo-label">IPTU:</span>
              <span class="custo-valor">{{ formatarPreco(imovel.valor_iptu) }}</span>
            </div>
          </div>
        </div>

        <!-- Especificações -->
        <div class="specs-section">
          <h2 class="section-title">Características</h2>
          <div class="specs-grid">
            <div class="spec-card">
              <span class="spec-icon">🛏️</span>
              <span class="spec-value">{{ imovel.quartos }}</span>
              <span class="spec-label">Quarto(s)</span>
            </div>
            <div class="spec-card">
              <span class="spec-icon">🚿</span>
              <span class="spec-value">{{ imovel.banheiros }}</span>
              <span class="spec-label">Banheiro(s)</span>
            </div>
            <div v-if="imovel.area_util_m2" class="spec-card">
              <span class="spec-icon">📏</span>
              <span class="spec-value">{{ imovel.area_util_m2 }}</span>
              <span class="spec-label">m²</span>
            </div>
            <div v-if="imovel.vagas_garagem" class="spec-card">
              <span class="spec-icon">🚗</span>
              <span class="spec-value">{{ imovel.vagas_garagem }}</span>
              <span class="spec-label">Vaga(s)</span>
            </div>
          </div>
        </div>

        <!-- Descrição -->
        <div v-if="imovel.descricao" class="descricao-section">
          <h2 class="section-title">Descrição</h2>
          <p class="descricao-texto">{{ imovel.descricao }}</p>
        </div>

        <!-- Formulário de Contato -->
        <div class="contato-section">
          <h2 class="section-title">Tenho Interesse</h2>
          <p class="contato-subtitle">Preencha o formulário abaixo para mais informações</p>

          <div v-if="contatoEnviado" class="success-message">
            Mensagem enviada com sucesso! Entraremos em contato em breve.
          </div>

          <form @submit.prevent="enviarContato" class="contato-form">
            <div class="form-row">
              <div class="form-group">
                <label for="nome">Nome *</label>
                <input
                  type="text"
                  id="nome"
                  v-model="formContato.nome"
                  required
                  class="form-input"
                  placeholder="Seu nome"
                />
              </div>

              <div class="form-group">
                <label for="email">E-mail *</label>
                <input
                  type="email"
                  id="email"
                  v-model="formContato.email"
                  required
                  class="form-input"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                v-model="formContato.telefone"
                class="form-input"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div class="form-group">
              <label for="mensagem">Mensagem</label>
              <textarea
                id="mensagem"
                v-model="formContato.mensagem"
                class="form-textarea"
                rows="4"
                placeholder="Gostaria de mais informações sobre este imóvel..."
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-full">
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Erro -->
    <div v-else class="error-message">
      <p>Imóvel não encontrado.</p>
      <router-link to="/busca" class="btn btn-secondary">
        Voltar para busca
      </router-link>
    </div>

    <!-- Lightbox -->
    <div v-if="showLightbox" class="lightbox-overlay" @click="fecharLightbox">
      <div class="lightbox-content" @click.stop>
        <button @click="fecharLightbox" class="lightbox-close">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        
        <button @click.stop="fotoAnterior" class="lightbox-nav lightbox-prev">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        
        <img :src="fotosUrls[lightboxIndex]" :alt="`Foto ${lightboxIndex + 1}`" class="lightbox-image" />
        
        <button @click.stop="proximaFoto" class="lightbox-nav lightbox-next">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
        
        <div class="lightbox-counter">
          {{ lightboxIndex + 1 }} / {{ fotosUrls.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detalhe-container {
  padding: 1rem 0;
}

.btn-voltar {
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
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

.detalhe-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Galeria */
.galeria-section {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.foto-principal {
  position: relative;
  width: 100%;
  height: 500px;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  cursor: pointer;
}

.foto-principal:hover .foto-zoom-hint {
  opacity: 1;
}

.foto-zoom-hint {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.foto-principal-img {
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
  font-size: 1.2rem;
}

.miniaturas {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.miniatura {
  flex-shrink: 0;
  width: 100px;
  height: 75px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.miniatura:hover {
  border-color: #3498db;
}

.miniatura.active {
  border-color: #3498db;
}

.miniatura img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Informações */
.info-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.imovel-titulo {
  font-size: 2rem;
  color: #2c3e50;
}

.imovel-badge {
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
}

.imovel-localizacao,
.imovel-endereco {
  font-size: 1.05rem;
  color: #555;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.imovel-localizacao svg,
.imovel-endereco svg {
  color: #3498db;
  flex-shrink: 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.btn-whatsapp {
  background-color: #25D366;
  color: white;
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  padding: 1rem 1.5rem;
  transition: all 0.3s;
}

.btn-whatsapp:hover {
  background-color: #20BA5A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

.btn-share {
  background-color: #3498db;
  color: white;
  flex: 1;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-share:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* Preço */
.preco-section {
  border: 2px solid #3498db;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.preco-principal {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.preco-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.preco-valor {
  font-size: 2.5rem;
  font-weight: bold;
  color: #27ae60;
}

.preco-periodo {
  font-size: 1rem;
  color: #7f8c8d;
}

.custos-adicionais {
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.custo-item {
  display: flex;
  flex-direction: column;
}

.custo-label {
  color: #7f8c8d;
  font-size: 0.875rem;
}

.custo-valor {
  font-weight: 600;
  color: #2c3e50;
}

/* Especificações */
.section-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.specs-section {
  margin-bottom: 2rem;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.spec-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.spec-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.spec-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.spec-label {
  font-size: 0.875rem;
  color: #7f8c8d;
}

/* Descrição */
.descricao-section {
  margin-bottom: 2rem;
}

.descricao-texto {
  line-height: 1.8;
  color: #555;
  white-space: pre-wrap;
}

/* Contato */
.contato-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 2rem;
}

.contato-subtitle {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.contato-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-textarea {
  resize: vertical;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #28a745;
  margin-bottom: 1rem;
}

.error-message {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
}

.btn-full {
  width: 100%;
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  user-select: none;
}

.lightbox-close {
  position: absolute;
  top: -50px;
  right: 0;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.3s;
}

.lightbox-close:hover {
  transform: scale(1.1);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  padding: 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.lightbox-nav:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.lightbox-prev {
  left: -60px;
}

.lightbox-next {
  right: -60px;
}

.lightbox-counter {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 1.1rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .foto-principal {
    height: 300px;
  }

  .imovel-titulo {
    font-size: 1.5rem;
  }

  .preco-valor {
    font-size: 2rem;
  }

  .custos-adicionais {
    flex-direction: column;
    gap: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-whatsapp,
  .btn-share {
    min-width: 100%;
  }

  .lightbox-prev {
    left: 10px;
  }

  .lightbox-next {
    right: 10px;
  }

  .lightbox-close {
    top: 10px;
    right: 10px;
  }

  .lightbox-counter {
    bottom: 10px;
  }
}
</style>
