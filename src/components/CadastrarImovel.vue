<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { databases, storage, account, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID, ID, Permission, Role } from '../appwrite';

const router = useRouter();
const isLoading = ref(false);
const success = ref('');
const error = ref('');

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
      <button @click="voltarParaDashboard" class="btn btn-secondary btn-voltar">
        ← Voltar
      </button>
      <h1 class="cadastro-title">Cadastrar Imóvel</h1>

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
  padding: 2rem 0;
}

.cadastro-card {
  background: white;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cadastro-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.btn-voltar {
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
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
  font-size: 1.25rem;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
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
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-textarea {
  resize: vertical;
}

.form-hint {
  color: #7f8c8d;
  font-size: 0.875rem;
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
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #c33;
  margin-bottom: 1rem;
}

.btn-full {
  width: 100%;
  margin-top: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
