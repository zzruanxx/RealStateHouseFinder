<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { databases, storage, account, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID, ID } from '../appwrite';

const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const isLoadingData = ref(true);
const success = ref('');
const error = ref('');

const logout = async () => {
  try {
    await account.deleteSession('current');
    router.push('/');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    alert('Erro ao fazer logout. Por favor, tente novamente.');
  }
};

// Form fields
const form = ref({
  titulo: '',
  descricao: '',
  status: 'disponivel',
  tipo_anuncio: 'venda',
  tipo_imovel: 'apartamento',
  preco_venda: '',
  preco_aluguel: '',
  valor_condominio: '',
  valor_iptu: '',
  cidade: '',
  bairro: '',
  endereco: '',
  area_util_m2: '',
  quartos: '',
  banheiros: '',
  vagas_garagem: ''
});

const fotosExistentes = ref([]);
const fotosExistentesUrls = ref([]);
const fotosParaRemover = ref([]);
const novasFotos = ref(null);

const carregarImovel = async () => {
  isLoadingData.value = true;
  try {
    const response = await databases.getDocument(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      route.params.id
    );

    // Preencher formulário
    form.value = {
      titulo: response.titulo || '',
      descricao: response.descricao || '',
      status: response.status || 'disponivel',
      tipo_anuncio: response.tipo_anuncio || 'venda',
      tipo_imovel: response.tipo_imovel || 'apartamento',
      preco_venda: response.preco_venda || '',
      preco_aluguel: response.preco_aluguel || '',
      valor_condominio: response.valor_condominio || '',
      valor_iptu: response.valor_iptu || '',
      cidade: response.cidade || '',
      bairro: response.bairro || '',
      endereco: response.endereco || '',
      area_util_m2: response.area_util_m2 || '',
      quartos: response.quartos || '',
      banheiros: response.banheiros || '',
      vagas_garagem: response.vagas_garagem || ''
    };

    // Carregar fotos existentes
    fotosExistentes.value = response.fotos_storage_ids || [];
    
    if (fotosExistentes.value.length > 0) {
      fotosExistentesUrls.value = fotosExistentes.value.map(fotoId => ({
        id: fotoId,
        url: storage.getFilePreview(
          BUCKET_FOTOS_ID,
          fotoId,
          400,
          300,
          'center',
          100
        ).href
      }));
    }

  } catch (err) {
    console.error('Erro ao carregar imóvel:', err);
    error.value = 'Erro ao carregar dados do imóvel.';
  } finally {
    isLoadingData.value = false;
  }
};

const handleFileChange = (event) => {
  novasFotos.value = event.target.files;
};

const removerFotoExistente = (fotoId) => {
  fotosParaRemover.value.push(fotoId);
  fotosExistentesUrls.value = fotosExistentesUrls.value.filter(f => f.id !== fotoId);
  fotosExistentes.value = fotosExistentes.value.filter(id => id !== fotoId);
};

const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  isLoading.value = true;

  try {
    // Validação básica
    if (fotosExistentes.value.length === 0 && (!novasFotos.value || novasFotos.value.length === 0)) {
      throw new Error('O imóvel deve ter pelo menos uma foto.');
    }

    // Processar novas fotos
    let novosFotosIds = [...fotosExistentes.value];
    
    if (novasFotos.value && novasFotos.value.length > 0) {
      const uploadPromises = Array.from(novasFotos.value).map(file =>
        storage.createFile(BUCKET_FOTOS_ID, ID.unique(), file)
      );

      const uploadedFiles = await Promise.all(uploadPromises);
      uploadedFiles.forEach(file => {
        novosFotosIds.push(file.$id);
      });
    }

    // Remover fotos marcadas para remoção
    if (fotosParaRemover.value.length > 0) {
      const deletePromises = fotosParaRemover.value.map(fotoId =>
        storage.deleteFile(BUCKET_FOTOS_ID, fotoId).catch(err => {
          console.warn('Erro ao deletar foto:', err);
        })
      );
      await Promise.all(deletePromises);
    }

    // Preparar dados do documento
    const documentData = {
      titulo: form.value.titulo,
      descricao: form.value.descricao,
      status: form.value.status,
      tipo_anuncio: form.value.tipo_anuncio,
      tipo_imovel: form.value.tipo_imovel,
      preco_venda: form.value.preco_venda ? parseFloat(form.value.preco_venda) : null,
      preco_aluguel: form.value.preco_aluguel ? parseFloat(form.value.preco_aluguel) : null,
      valor_condominio: form.value.valor_condominio ? parseFloat(form.value.valor_condominio) : null,
      valor_iptu: form.value.valor_iptu ? parseFloat(form.value.valor_iptu) : null,
      cidade: form.value.cidade,
      bairro: form.value.bairro,
      endereco: form.value.endereco || '',
      area_util_m2: form.value.area_util_m2 ? parseInt(form.value.area_util_m2) : null,
      quartos: parseInt(form.value.quartos),
      banheiros: parseInt(form.value.banheiros),
      vagas_garagem: form.value.vagas_garagem ? parseInt(form.value.vagas_garagem) : 0,
      fotos_storage_ids: novosFotosIds
    };

    // Atualizar documento
    await databases.updateDocument(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      route.params.id,
      documentData
    );

    success.value = 'Imóvel atualizado com sucesso!';
    
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 2000);

  } catch (err) {
    console.error('Erro ao atualizar imóvel:', err);
    error.value = err.message || 'Erro ao atualizar imóvel. Por favor, tente novamente.';
  } finally {
    isLoading.value = false;
  }
};

const cancelar = () => {
  router.push('/admin/dashboard');
};

onMounted(() => {
  carregarImovel();
});
</script>

<template>
  <div class="editar-container">
    <div class="editar-card">
      <div class="editar-header">
        <div class="header-left">
          <h1>Editar Imóvel</h1>
        </div>
        <div class="header-actions">
          <button @click="cancelar" class="btn btn-secondary">
            ← Voltar
          </button>
          <button @click="logout" class="btn btn-logout">
            🚪 Sair
          </button>
        </div>
      </div>

    <!-- Loading inicial -->
    <div v-if="isLoadingData" class="loading">
      <div class="spinner"></div>
      <p>Carregando dados do imóvel...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="editar-form">
      <!-- Mensagens -->
      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Informações Básicas -->
      <div class="form-section">
        <h2>Informações Básicas</h2>

        <div class="form-grid">
          <div class="form-group full-width">
            <label for="titulo">Título do Anúncio *</label>
            <input
              type="text"
              id="titulo"
              v-model="form.titulo"
              placeholder="Ex: Apartamento 3 quartos no centro"
              required
              class="form-input"
            />
          </div>

          <div class="form-group full-width">
            <label for="descricao">Descrição</label>
            <textarea
              id="descricao"
              v-model="form.descricao"
              placeholder="Descreva o imóvel..."
              rows="4"
              class="form-input"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="status">Status *</label>
            <select id="status" v-model="form.status" required class="form-input">
              <option value="disponivel">Disponível</option>
              <option value="vendido">Vendido</option>
              <option value="alugado">Alugado</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tipo_anuncio">Tipo de Anúncio *</label>
            <select id="tipo_anuncio" v-model="form.tipo_anuncio" required class="form-input">
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tipo_imovel">Tipo de Imóvel *</label>
            <select id="tipo_imovel" v-model="form.tipo_imovel" required class="form-input">
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
              <option value="rural">Rural</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Valores -->
      <div class="form-section">
        <h2>Valores</h2>

        <div class="form-grid">
          <div class="form-group" v-if="form.tipo_anuncio === 'venda'">
            <label for="preco_venda">Preço de Venda (R$)</label>
            <input
              type="number"
              id="preco_venda"
              v-model="form.preco_venda"
              placeholder="500000"
              step="0.01"
              class="form-input"
            />
          </div>

          <div class="form-group" v-if="form.tipo_anuncio === 'aluguel'">
            <label for="preco_aluguel">Preço do Aluguel (R$)</label>
            <input
              type="number"
              id="preco_aluguel"
              v-model="form.preco_aluguel"
              placeholder="2000"
              step="0.01"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="valor_condominio">Valor do Condomínio (R$)</label>
            <input
              type="number"
              id="valor_condominio"
              v-model="form.valor_condominio"
              placeholder="350"
              step="0.01"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="valor_iptu">Valor do IPTU (R$)</label>
            <input
              type="number"
              id="valor_iptu"
              v-model="form.valor_iptu"
              placeholder="150"
              step="0.01"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Localização -->
      <div class="form-section">
        <h2>Localização</h2>

        <div class="form-grid">
          <div class="form-group">
            <label for="cidade">Cidade *</label>
            <input
              type="text"
              id="cidade"
              v-model="form.cidade"
              placeholder="São Paulo"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="bairro">Bairro *</label>
            <input
              type="text"
              id="bairro"
              v-model="form.bairro"
              placeholder="Centro"
              required
              class="form-input"
            />
          </div>

          <div class="form-group full-width">
            <label for="endereco">Endereço Completo</label>
            <input
              type="text"
              id="endereco"
              v-model="form.endereco"
              placeholder="Rua Example, 123"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Características -->
      <div class="form-section">
        <h2>Características</h2>

        <div class="form-grid">
          <div class="form-group">
            <label for="area_util_m2">Área Útil (m²)</label>
            <input
              type="number"
              id="area_util_m2"
              v-model="form.area_util_m2"
              placeholder="80"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="quartos">Quartos *</label>
            <input
              type="number"
              id="quartos"
              v-model="form.quartos"
              placeholder="3"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="banheiros">Banheiros *</label>
            <input
              type="number"
              id="banheiros"
              v-model="form.banheiros"
              placeholder="2"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="vagas_garagem">Vagas de Garagem</label>
            <input
              type="number"
              id="vagas_garagem"
              v-model="form.vagas_garagem"
              placeholder="1"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <!-- Fotos -->
      <div class="form-section">
        <h2>Fotos do Imóvel</h2>

        <!-- Fotos existentes -->
        <div v-if="fotosExistentesUrls.length > 0" class="fotos-existentes">
          <h3>Fotos Atuais</h3>
          <div class="fotos-grid">
            <div v-for="foto in fotosExistentesUrls" :key="foto.id" class="foto-item">
              <img :src="foto.url" alt="Foto do imóvel" />
              <button
                type="button"
                @click="removerFotoExistente(foto.id)"
                class="btn-remover-foto"
                title="Remover foto"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Upload de novas fotos -->
        <div class="form-group full-width">
          <label for="fotos">Adicionar Novas Fotos</label>
          <input
            type="file"
            id="fotos"
            @change="handleFileChange"
            accept="image/*"
            multiple
            class="form-input"
          />
          <small class="form-help">Selecione uma ou mais imagens (JPG, PNG, WEBP)</small>
        </div>
      </div>

      <!-- Botões -->
      <div class="form-actions">
        <button type="button" @click="cancelar" class="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>
    </form>
    </div>
  </div>
</template>

<style scoped>
.editar-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.editar-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.editar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-left h1 {
  font-size: 2.25rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-logout {
  background: white;
  color: #e74c3c;
  border: 2px solid #e74c3c;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #e74c3c;
  color: white;
  transform: translateY(-2px);
}

.loading {
  text-align: center;
  padding: 5rem 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.editar-form {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.success-message {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  color: #155724;
  padding: 1.1rem;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
}

.error-message {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  color: #721c24;
  padding: 1.1rem;
  border-radius: 8px;
  border-left: 4px solid #dc3545;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.1);
}

.form-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.form-section h2 {
  font-size: 1.35rem;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-input {
  padding: 0.9rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea.form-input {
  resize: vertical;
  min-height: 120px;
}

.form-help {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.fotos-existentes {
  margin-bottom: 1.5rem;
}

.fotos-existentes h3 {
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.fotos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.foto-item {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.foto-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remover-foto {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  transition: background-color 0.3s;
}

.btn-remover-foto:hover {
  background-color: rgba(192, 57, 43, 1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 2px solid #f0f0f0;
}

.form-actions .btn {
  padding: 0.9rem 2rem;
  font-size: 1.05rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .editar-card {
    padding: 2rem 1.5rem;
  }

  .editar-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left h1 {
    font-size: 1.85rem;
    text-align: center;
  }

  .header-actions {
    justify-content: center;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
