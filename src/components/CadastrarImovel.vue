<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { databases, storage, account, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID, ID, Permission, Role } from '../appwrite';

const router = useRouter();
const isLoading = ref(false);
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

const fotos = ref(null);

const handleFileChange = (event) => {
  fotos.value = event.target.files;
};

const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  isLoading.value = true;

  try {
    // Validação básica
    if (!fotos.value || fotos.value.length === 0) {
      throw new Error('Por favor, selecione pelo menos uma foto.');
    }

    // Upload das fotos
    const fotosStorageIds = [];
    const uploadPromises = Array.from(fotos.value).map(file =>
      storage.createFile(BUCKET_FOTOS_ID, ID.unique(), file)
    );

    const uploadedFiles = await Promise.all(uploadPromises);
    uploadedFiles.forEach(file => {
      fotosStorageIds.push(file.$id);
    });

    // Obter ID do corretor (usuário logado)
    const user = await account.get();
    const corretorId = user.$id;

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
      fotos_storage_ids: fotosStorageIds,
      id_corretor: corretorId
    };

    // Definir permissões
    const permissions = [
      Permission.read(Role.any()),
      Permission.update(Role.user(corretorId)),
      Permission.delete(Role.user(corretorId))
    ];

    // Criar documento
    await databases.createDocument(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      ID.unique(),
      documentData,
      permissions
    );

    success.value = 'Imóvel cadastrado com sucesso!';
    
    // Limpar formulário
    form.value = {
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
    };
    fotos.value = null;
    document.getElementById('fotos').value = '';

    // Redirecionar para dashboard após 2 segundos
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 2000);

  } catch (err) {
    error.value = err.message || 'Erro ao cadastrar imóvel. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
};

const voltarParaDashboard = () => {
  router.push('/admin/dashboard');
};
</script>

<template>
  <div class="cadastro-container">
    <div class="cadastro-card">
      <div class="cadastro-header">
        <button @click="voltarParaDashboard" class="btn btn-secondary btn-voltar">
          ← Voltar
        </button>
        <button @click="logout" class="btn btn-logout">
          🚪 Sair
        </button>
      </div>
      <h1 class="cadastro-title">Cadastrar Imóvel</h1>
      <p class="cadastro-subtitle">Preencha os dados do imóvel para cadastrá-lo no sistema</p>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="cadastro-form">
        <!-- Informações Básicas -->
        <section class="form-section">
          <h2 class="section-title">Informações Básicas</h2>

          <div class="form-group">
            <label for="titulo">Título *</label>
            <input
              type="text"
              id="titulo"
              v-model="form.titulo"
              required
              class="form-input"
              placeholder="Ex: Apartamento 3 quartos no Centro"
            />
          </div>

          <div class="form-group">
            <label for="descricao">Descrição</label>
            <textarea
              id="descricao"
              v-model="form.descricao"
              class="form-textarea"
              rows="4"
              placeholder="Descreva o imóvel..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">Status *</label>
              <select id="status" v-model="form.status" required class="form-select">
                <option value="disponivel">Disponível</option>
                <option value="vendido">Vendido</option>
                <option value="alugado">Alugado</option>
              </select>
            </div>

            <div class="form-group">
              <label for="tipo_anuncio">Tipo de Anúncio *</label>
              <select id="tipo_anuncio" v-model="form.tipo_anuncio" required class="form-select">
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>

            <div class="form-group">
              <label for="tipo_imovel">Tipo de Imóvel *</label>
              <select id="tipo_imovel" v-model="form.tipo_imovel" required class="form-select">
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="terreno">Terreno</option>
                <option value="comercial">Comercial</option>
                <option value="rural">Rural</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Preços -->
        <section class="form-section">
          <h2 class="section-title">Valores</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="preco_venda">Preço de Venda (R$)</label>
              <input
                type="number"
                id="preco_venda"
                v-model="form.preco_venda"
                step="0.01"
                class="form-input"
                placeholder="250000.00"
              />
            </div>

            <div class="form-group">
              <label for="preco_aluguel">Preço de Aluguel (R$)</label>
              <input
                type="number"
                id="preco_aluguel"
                v-model="form.preco_aluguel"
                step="0.01"
                class="form-input"
                placeholder="1500.00"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="valor_condominio">Valor Condomínio (R$)</label>
              <input
                type="number"
                id="valor_condominio"
                v-model="form.valor_condominio"
                step="0.01"
                class="form-input"
                placeholder="350.00"
              />
            </div>

            <div class="form-group">
              <label for="valor_iptu">Valor IPTU (R$)</label>
              <input
                type="number"
                id="valor_iptu"
                v-model="form.valor_iptu"
                step="0.01"
                class="form-input"
                placeholder="200.00"
              />
            </div>
          </div>
        </section>

        <!-- Localização -->
        <section class="form-section">
          <h2 class="section-title">Localização</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="cidade">Cidade *</label>
              <input
                type="text"
                id="cidade"
                v-model="form.cidade"
                required
                class="form-input"
                placeholder="Ex: São Paulo"
              />
            </div>

            <div class="form-group">
              <label for="bairro">Bairro *</label>
              <input
                type="text"
                id="bairro"
                v-model="form.bairro"
                required
                class="form-input"
                placeholder="Ex: Centro"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="endereco">Endereço Completo</label>
            <input
              type="text"
              id="endereco"
              v-model="form.endereco"
              class="form-input"
              placeholder="Ex: Rua Example, 123 - Apto 45"
            />
          </div>
        </section>

        <!-- Características -->
        <section class="form-section">
          <h2 class="section-title">Características</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="area_util_m2">Área Útil (m²)</label>
              <input
                type="number"
                id="area_util_m2"
                v-model="form.area_util_m2"
                class="form-input"
                placeholder="120"
              />
            </div>

            <div class="form-group">
              <label for="quartos">Quartos *</label>
              <input
                type="number"
                id="quartos"
                v-model="form.quartos"
                required
                class="form-input"
                placeholder="3"
              />
            </div>

            <div class="form-group">
              <label for="banheiros">Banheiros *</label>
              <input
                type="number"
                id="banheiros"
                v-model="form.banheiros"
                required
                class="form-input"
                placeholder="2"
              />
            </div>

            <div class="form-group">
              <label for="vagas_garagem">Vagas de Garagem</label>
              <input
                type="number"
                id="vagas_garagem"
                v-model="form.vagas_garagem"
                class="form-input"
                placeholder="2"
              />
            </div>
          </div>
        </section>

        <!-- Fotos -->
        <section class="form-section">
          <h2 class="section-title">Fotos *</h2>

          <div class="form-group">
            <label for="fotos">Selecione as fotos do imóvel</label>
            <input
              type="file"
              id="fotos"
              @change="handleFileChange"
              accept="image/*"
              multiple
              required
              class="form-input"
            />
            <small class="form-hint">Selecione uma ou mais fotos (JPG, PNG)</small>
          </div>
        </section>

        <button type="submit" class="btn btn-primary btn-full" :disabled="isLoading">
          {{ isLoading ? 'Cadastrando...' : 'Cadastrar Imóvel' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.cadastro-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.cadastro-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.cadastro-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.cadastro-title {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 700;
}

.cadastro-subtitle {
  color: #7f8c8d;
  margin-bottom: 2.5rem;
  font-size: 1.05rem;
}

.btn-voltar {
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.btn-voltar:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateX(-4px);
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

.cadastro-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.35rem;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 3px solid #667eea;
  padding-bottom: 0.75rem;
  margin-bottom: 1.25rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
.form-select,
.form-textarea {
  padding: 0.9rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
}

.form-hint {
  color: #7f8c8d;
  font-size: 0.875rem;
}

.success-message {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  color: #155724;
  padding: 1.1rem;
  border-radius: 8px;
  border-left: 4px solid #28a745;
  margin-bottom: 1.5rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
}

.error-message {
  background: linear-gradient(135deg, #fee, #fdd);
  color: #c33;
  padding: 1.1rem;
  border-radius: 8px;
  border-left: 4px solid #c33;
  margin-bottom: 1.5rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(204, 51, 51, 0.1);
}

.btn-full {
  width: 100%;
  margin-top: 1.5rem;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .cadastro-card {
    padding: 2rem 1.5rem;
  }

  .cadastro-title {
    font-size: 1.85rem;
  }

  .cadastro-header {
    justify-content: center;
  }
}
</style>
