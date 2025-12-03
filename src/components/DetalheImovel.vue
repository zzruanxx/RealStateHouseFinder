<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { databases, storage, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID } from '../appwrite';

const route = useRoute();

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

onMounted(() => {
  carregarImovel();
});
</script>

<template>
  <div class="detalhe-container">
    <!-- Back Button -->
    <button @click="$router.push('/busca')" class="btn btn-secondary btn-voltar">
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
        <div class="foto-principal">
          <img
            v-if="fotoAtiva"
            :src="fotoAtiva"
            :alt="imovel.titulo"
            class="foto-principal-img"
          />
          <div v-else class="foto-placeholder">
            <span>Sem foto disponível</span>
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
            <img :src="url" :alt="`Foto ${index + 1}`" />
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
          📍 {{ imovel.bairro }}, {{ imovel.cidade }}
        </p>

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
  width: 100%;
  height: 500px;
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
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

.imovel-localizacao {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
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
}
</style>
