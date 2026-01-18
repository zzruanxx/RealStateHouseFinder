<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { databases, storage, account, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID, Query } from '../appwrite';

const router = useRouter();
const isLoading = ref(false);
const imoveis = ref([]);
const user = ref(null);
const showDeleteModal = ref(false);
const imovelToDelete = ref(null);

const logout = async () => {
  try {
    await account.deleteSession('current');
    router.push('/');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    alert('Erro ao fazer logout. Por favor, tente novamente.');
  }
};

const carregarImoveis = async () => {
  isLoading.value = true;
  try {
    // Obter usuário logado
    user.value = await account.get();
    
    // Buscar imóveis do corretor
    const queries = [
      Query.equal('id_corretor', user.value.$id),
      Query.orderDesc('$createdAt'),
      Query.limit(100)
    ];

    const response = await databases.listDocuments(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      queries
    );

    // Processar resultados
    imoveis.value = response.documents.map(imovel => {
      const fotoUrl = imovel.fotos_storage_ids && imovel.fotos_storage_ids.length > 0
        ? storage.getFilePreview(
            BUCKET_FOTOS_ID,
            imovel.fotos_storage_ids[0],
            200,
            150,
            'center',
            80
          ).href
        : '';

      return {
        ...imovel,
        fotoUrl
      };
    });

  } catch (error) {
    console.error('Erro ao carregar imóveis:', error);
    alert('Erro ao carregar seus imóveis. Por favor, tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

const formatarPreco = (preco) => {
  if (!preco) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco);
};

const confirmarExclusao = (imovel) => {
  imovelToDelete.value = imovel;
  showDeleteModal.value = true;
};

const cancelarExclusao = () => {
  showDeleteModal.value = false;
  imovelToDelete.value = null;
};

const excluirImovel = async () => {
  if (!imovelToDelete.value) return;

  try {
    // Excluir fotos do storage
    if (imovelToDelete.value.fotos_storage_ids && imovelToDelete.value.fotos_storage_ids.length > 0) {
      const deletePromises = imovelToDelete.value.fotos_storage_ids.map(fotoId =>
        storage.deleteFile(BUCKET_FOTOS_ID, fotoId).catch(err => {
          console.warn('Erro ao deletar foto:', err);
        })
      );
      await Promise.all(deletePromises);
    }

    // Excluir documento
    await databases.deleteDocument(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      imovelToDelete.value.$id
    );

    // Remover da lista
    imoveis.value = imoveis.value.filter(i => i.$id !== imovelToDelete.value.$id);
    
    showDeleteModal.value = false;
    imovelToDelete.value = null;
    alert('Imóvel excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error);
    alert('Erro ao excluir imóvel. Por favor, tente novamente.');
  }
};

const editarImovel = (imovelId) => {
  router.push({ name: 'EditarImovel', params: { id: imovelId } });
};

const verDetalhes = (imovelId) => {
  router.push({ name: 'DetalheImovel', params: { id: imovelId } });
};

const novoImovel = () => {
  router.push('/admin/cadastrar');
};

onMounted(() => {
  carregarImoveis();
});
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="header-left">
        <h1>Meus Imóveis</h1>
        <p v-if="user" class="user-info">👤 {{ user.name || user.email }}</p>
      </div>
      <div class="header-actions">
        <button @click="novoImovel" class="btn btn-primary">
          <span class="btn-icon">+</span> Cadastrar Novo Imóvel
        </button>
        <button @click="logout" class="btn btn-logout">
          <span class="btn-icon">🚪</span> Sair
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Carregando seus imóveis...</p>
    </div>

    <!-- Lista vazia -->
    <div v-else-if="imoveis.length === 0" class="empty-state">
      <div class="empty-icon">🏠</div>
      <h2>Nenhum imóvel cadastrado</h2>
      <p>Comece cadastrando seu primeiro imóvel!</p>
      <button @click="novoImovel" class="btn btn-primary">
        Cadastrar Imóvel
      </button>
    </div>

    <!-- Lista de imóveis -->
    <div v-else class="imoveis-lista">
      <div v-for="imovel in imoveis" :key="imovel.$id" class="imovel-item">
        <div class="imovel-foto">
          <img
            v-if="imovel.fotoUrl"
            :src="imovel.fotoUrl"
            :alt="`${imovel.titulo} - ${imovel.cidade}`"
            loading="lazy"
            class="foto-img"
          />
          <div v-else class="foto-placeholder">
            <span>Sem foto</span>
          </div>
        </div>

        <div class="imovel-info">
          <div class="imovel-header">
            <h3>{{ imovel.titulo }}</h3>
            <span class="status-badge" :class="imovel.status">
              {{ imovel.status }}
            </span>
          </div>

          <p class="imovel-tipo">
            {{ imovel.tipo_imovel }} - {{ imovel.tipo_anuncio }}
          </p>

          <p class="imovel-localizacao">
            📍 {{ imovel.bairro }}, {{ imovel.cidade }}
          </p>

          <p class="imovel-preco">
            {{
              imovel.tipo_anuncio === 'aluguel'
                ? formatarPreco(imovel.preco_aluguel) + '/mês'
                : formatarPreco(imovel.preco_venda)
            }}
          </p>

          <div class="imovel-specs">
            <span>🛏️ {{ imovel.quartos }}</span>
            <span>🚿 {{ imovel.banheiros }}</span>
            <span v-if="imovel.area_util_m2">📏 {{ imovel.area_util_m2 }}m²</span>
            <span v-if="imovel.vagas_garagem">🚗 {{ imovel.vagas_garagem }}</span>
          </div>

          <div class="imovel-date">
            Cadastrado em {{ new Date(imovel.$createdAt).toLocaleDateString('pt-BR') }}
          </div>
        </div>

        <div class="imovel-actions">
          <button @click="verDetalhes(imovel.$id)" class="btn-action btn-view" title="Ver detalhes">
            👁️ Ver
          </button>
          <button @click="editarImovel(imovel.$id)" class="btn-action btn-edit" title="Editar">
            ✏️ Editar
          </button>
          <button @click="confirmarExclusao(imovel)" class="btn-action btn-delete" title="Excluir">
            🗑️ Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelarExclusao">
      <div class="modal-content" @click.stop>
        <h2>Confirmar Exclusão</h2>
        <p>Tem certeza que deseja excluir o imóvel:</p>
        <p class="modal-imovel-nome"><strong>{{ imovelToDelete?.titulo }}</strong></p>
        <p class="modal-warning">Esta ação não pode ser desfeita!</p>
        
        <div class="modal-actions">
          <button @click="cancelarExclusao" class="btn btn-secondary">
            Cancelar
          </button>
          <button @click="excluirImovel" class="btn btn-danger">
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 700;
}

.user-info {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-logout {
  background: white;
  color: #e74c3c;
  border: 2px solid #e74c3c;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #e74c3c;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
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

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 2px dashed #e0e0e0;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.empty-state h2 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1.5rem;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 2.5rem;
  font-size: 1.05rem;
}

.imoveis-lista {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.imovel-item {
  display: grid;
  grid-template-columns: 220px 1fr auto;
  gap: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #f0f0f0;
}

.imovel-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.imovel-foto {
  width: 220px;
  height: 165px;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  position: relative;
}

.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.imovel-item:hover .foto-img {
  transform: scale(1.05);
}

.foto-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
}

.imovel-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.imovel-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.imovel-header h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.status-badge {
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.disponivel {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  color: #155724;
  border: 1px solid #b1dfbb;
}

.status-badge.vendido,
.status-badge.alugado {
  background: linear-gradient(135deg, #f8d7da, #f5c6cb);
  color: #721c24;
  border: 1px solid #f1b0b7;
}

.imovel-tipo {
  color: #7f8c8d;
  text-transform: capitalize;
  font-size: 0.95rem;
}

.imovel-localizacao {
  color: #555;
  font-size: 0.95rem;
}

.imovel-preco {
  font-size: 1.4rem;
  font-weight: 700;
  color: #27ae60;
  margin-top: 0.5rem;
  letter-spacing: -0.5px;
}

.imovel-specs {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #555;
}

.imovel-date {
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.5rem;
}

.imovel-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: center;
}

.btn-action {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-view {
  background-color: #3498db;
  color: white;
}

.btn-view:hover {
  background-color: #2980b9;
}

.btn-edit {
  background-color: #f39c12;
  color: white;
}

.btn-edit:hover {
  background-color: #e67e22;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #555;
  margin-bottom: 0.5rem;
}

.modal-imovel-nome {
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 1rem 0;
}

.modal-warning {
  color: #e74c3c;
  font-weight: bold;
  margin: 1rem 0 1.5rem 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .imovel-item {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .imovel-foto {
    width: 100%;
    height: 220px;
  }

  .imovel-actions {
    flex-direction: row;
    justify-content: space-between;
  }

  .btn-action {
    flex: 1;
    text-align: center;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    padding: 1.25rem 1.5rem;
  }

  .header-left {
    align-items: center;
    text-align: center;
  }

  .dashboard-header h1 {
    text-align: center;
    font-size: 1.75rem;
  }

  .header-actions {
    justify-content: center;
  }
}
</style>
