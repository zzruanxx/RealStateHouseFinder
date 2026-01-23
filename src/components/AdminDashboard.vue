<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { databases, storage, account, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID, Query } from '../appwrite';

const router = useRouter();
const isLoading = ref(false);
const imoveis = ref([]);
const user = ref(null);
const showDeleteModal = ref(false);
const imovelToDelete = ref(null);

// Novos estados para filtros e visualização
const filtroStatus = ref('todos');
const filtroTipo = ref('todos');
const filtroTipoAnuncio = ref('todos');
const buscaTexto = ref('');
const ordenacao = ref('recente');
const visualizacao = ref('grid'); // 'grid' ou 'lista'

// Estatísticas computadas
const estatisticas = computed(() => {
  const total = imoveis.value.length;
  const disponiveis = imoveis.value.filter(i => i.status === 'disponivel').length;
  const vendidos = imoveis.value.filter(i => i.status === 'vendido').length;
  const alugados = imoveis.value.filter(i => i.status === 'alugado').length;
  const venda = imoveis.value.filter(i => i.tipo_anuncio === 'venda').length;
  const aluguel = imoveis.value.filter(i => i.tipo_anuncio === 'aluguel').length;
  
  return { total, disponiveis, vendidos, alugados, venda, aluguel };
});

// Imóveis filtrados e ordenados
const imoveisFiltrados = computed(() => {
  let resultado = [...imoveis.value];
  
  // Filtrar por status
  if (filtroStatus.value !== 'todos') {
    resultado = resultado.filter(i => i.status === filtroStatus.value);
  }
  
  // Filtrar por tipo de imóvel
  if (filtroTipo.value !== 'todos') {
    resultado = resultado.filter(i => i.tipo_imovel === filtroTipo.value);
  }
  
  // Filtrar por tipo de anúncio
  if (filtroTipoAnuncio.value !== 'todos') {
    resultado = resultado.filter(i => i.tipo_anuncio === filtroTipoAnuncio.value);
  }
  
  // Buscar por texto
  if (buscaTexto.value.trim()) {
    const busca = buscaTexto.value.toLowerCase();
    resultado = resultado.filter(i => 
      i.titulo.toLowerCase().includes(busca) ||
      i.cidade.toLowerCase().includes(busca) ||
      i.bairro.toLowerCase().includes(busca) ||
      (i.descricao && i.descricao.toLowerCase().includes(busca))
    );
  }
  
  // Ordenar
  switch (ordenacao.value) {
    case 'recente':
      resultado.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
      break;
    case 'antigo':
      resultado.sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt));
      break;
    case 'preco-maior':
      resultado.sort((a, b) => {
        const precoA = a.preco_venda || a.preco_aluguel || 0;
        const precoB = b.preco_venda || b.preco_aluguel || 0;
        return precoB - precoA;
      });
      break;
    case 'preco-menor':
      resultado.sort((a, b) => {
        const precoA = a.preco_venda || a.preco_aluguel || 0;
        const precoB = b.preco_venda || b.preco_aluguel || 0;
        return precoA - precoB;
      });
      break;
  }
  
  return resultado;
});

// Tipos únicos de imóveis
const tiposImoveis = computed(() => {
  const tipos = new Set(imoveis.value.map(i => i.tipo_imovel));
  return Array.from(tipos);
});

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

const alterarStatus = async (imovel, novoStatus) => {
  try {
    await databases.updateDocument(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      imovel.$id,
      { status: novoStatus }
    );
    
    // Atualizar na lista local
    const index = imoveis.value.findIndex(i => i.$id === imovel.$id);
    if (index !== -1) {
      imoveis.value[index].status = novoStatus;
    }
    
    alert(`Status alterado para "${novoStatus}" com sucesso!`);
  } catch (error) {
    console.error('Erro ao alterar status:', error);
    alert('Erro ao alterar status. Por favor, tente novamente.');
  }
};

const limparFiltros = () => {
  filtroStatus.value = 'todos';
  filtroTipo.value = 'todos';
  filtroTipoAnuncio.value = 'todos';
  buscaTexto.value = '';
  ordenacao.value = 'recente';
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
        <h1>Painel Administrativo</h1>
        <p v-if="user" class="user-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          {{ user.name || user.email }}
        </p>
      </div>
      <div class="header-actions">
        <button @click="novoImovel" class="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Novo Imóvel
        </button>
        <button @click="logout" class="btn btn-logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sair
        </button>
      </div>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ estatisticas.total }}</h3>
          <p>Total de Imóveis</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon disponivel">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ estatisticas.disponiveis }}</h3>
          <p>Disponíveis</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon vendido">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ estatisticas.vendidos }}</h3>
          <p>Vendidos</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon alugado">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ estatisticas.alugados }}</h3>
          <p>Alugados</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon venda">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ estatisticas.venda }}</h3>
          <p>Para Venda</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon aluguel">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
        <div class="stat-content">
          <h3>{{ estatisticas.aluguel }}</h3>
          <p>Para Aluguel</p>
        </div>
      </div>
    </div>

    <!-- Filtros e Busca -->
    <div class="filters-section">
      <div class="filters-header">
        <h2>Gerenciar Imóveis</h2>
        <div class="view-toggle">
          <button 
            @click="visualizacao = 'grid'" 
            :class="{ active: visualizacao === 'grid' }"
            class="view-btn"
            title="Visualização em grade">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button 
            @click="visualizacao = 'lista'" 
            :class="{ active: visualizacao === 'lista' }"
            class="view-btn"
            title="Visualização em lista">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="filters-container">
        <div class="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            v-model="buscaTexto" 
            type="text" 
            placeholder="Buscar por título, cidade, bairro..."
            class="search-input"
          />
        </div>

        <select v-model="filtroStatus" class="filter-select">
          <option value="todos">Todos os Status</option>
          <option value="disponivel">Disponível</option>
          <option value="vendido">Vendido</option>
          <option value="alugado">Alugado</option>
        </select>

        <select v-model="filtroTipoAnuncio" class="filter-select">
          <option value="todos">Todos os Tipos</option>
          <option value="venda">Venda</option>
          <option value="aluguel">Aluguel</option>
        </select>

        <select v-model="filtroTipo" class="filter-select">
          <option value="todos">Tipo de Imóvel</option>
          <option v-for="tipo in tiposImoveis" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>

        <select v-model="ordenacao" class="filter-select">
          <option value="recente">Mais Recentes</option>
          <option value="antigo">Mais Antigos</option>
          <option value="preco-maior">Maior Preço</option>
          <option value="preco-menor">Menor Preço</option>
        </select>

        <button @click="limparFiltros" class="btn-clear-filters">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Limpar
        </button>
      </div>

      <div class="results-info">
        <p>
          <strong>{{ imoveisFiltrados.length }}</strong> 
          {{ imoveisFiltrados.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados' }}
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Carregando seus imóveis...</p>
    </div>

    <!-- Lista vazia -->
    <div v-else-if="imoveisFiltrados.length === 0 && imoveis.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <h2>Nenhum imóvel cadastrado</h2>
      <p>Comece cadastrando seu primeiro imóvel!</p>
      <button @click="novoImovel" class="btn btn-primary">
        Cadastrar Imóvel
      </button>
    </div>

    <!-- Sem resultados na busca -->
    <div v-else-if="imoveisFiltrados.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>
      <h2>Nenhum imóvel encontrado</h2>
      <p>Tente ajustar os filtros de busca</p>
      <button @click="limparFiltros" class="btn btn-secondary">
        Limpar Filtros
      </button>
    </div>

    <!-- Lista de imóveis - Visualização Grid -->
    <div v-else-if="visualizacao === 'grid'" class="imoveis-grid">
      <div v-for="imovel in imoveisFiltrados" :key="imovel.$id" class="imovel-card">
        <div class="card-image">
          <img
            v-if="imovel.fotoUrl"
            :src="imovel.fotoUrl"
            :alt="`${imovel.titulo} - ${imovel.cidade}`"
            loading="lazy"
          />
          <div v-else class="image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <span class="card-status-badge" :class="imovel.status">
            {{ imovel.status }}
          </span>
          <div class="card-status-actions">
            <button 
              v-if="imovel.status !== 'disponivel'"
              @click="alterarStatus(imovel, 'disponivel')" 
              class="status-action-btn"
              title="Marcar como disponível">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button 
              v-if="imovel.tipo_anuncio === 'venda' && imovel.status !== 'vendido'"
              @click="alterarStatus(imovel, 'vendido')" 
              class="status-action-btn"
              title="Marcar como vendido">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </button>
            <button 
              v-if="imovel.tipo_anuncio === 'aluguel' && imovel.status !== 'alugado'"
              @click="alterarStatus(imovel, 'alugado')" 
              class="status-action-btn"
              title="Marcar como alugado">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="card-content">
          <h3 class="card-title">{{ imovel.titulo }}</h3>
          <p class="card-type">{{ imovel.tipo_imovel }} - {{ imovel.tipo_anuncio }}</p>
          <p class="card-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {{ imovel.bairro }}, {{ imovel.cidade }}
          </p>
          <p class="card-price">
            {{
              imovel.tipo_anuncio === 'aluguel'
                ? formatarPreco(imovel.preco_aluguel) + '/mês'
                : formatarPreco(imovel.preco_venda)
            }}
          </p>

          <div class="card-specs">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              {{ imovel.quartos }}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 6h11"></path>
                <path d="M9 12h11"></path>
                <path d="M9 18h11"></path>
                <path d="M5 6v.01"></path>
                <path d="M5 12v.01"></path>
                <path d="M5 18v.01"></path>
              </svg>
              {{ imovel.banheiros }}
            </span>
            <span v-if="imovel.area_util_m2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18"></rect>
              </svg>
              {{ imovel.area_util_m2 }}m²
            </span>
          </div>

          <div class="card-actions">
            <button @click="verDetalhes(imovel.$id)" class="btn-card btn-view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Ver
            </button>
            <button @click="editarImovel(imovel.$id)" class="btn-card btn-edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Editar
            </button>
            <button @click="confirmarExclusao(imovel)" class="btn-card btn-delete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de imóveis - Visualização Lista -->
    <div v-else class="imoveis-lista">
      <div v-for="imovel in imoveisFiltrados" :key="imovel.$id" class="imovel-item">
        <div class="imovel-foto">
          <img
            v-if="imovel.fotoUrl"
            :src="imovel.fotoUrl"
            :alt="`${imovel.titulo} - ${imovel.cidade}`"
            loading="lazy"
            class="foto-img"
          />
          <div v-else class="foto-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {{ imovel.bairro }}, {{ imovel.cidade }}
          </p>

          <p class="imovel-preco">
            {{
              imovel.tipo_anuncio === 'aluguel'
                ? formatarPreco(imovel.preco_aluguel) + '/mês'
                : formatarPreco(imovel.preco_venda)
            }}
          </p>

          <div class="imovel-specs">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              {{ imovel.quartos }}
            </span>
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 6h11"></path>
                <path d="M9 12h11"></path>
                <path d="M9 18h11"></path>
              </svg>
              {{ imovel.banheiros }}
            </span>
            <span v-if="imovel.area_util_m2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18"></rect>
              </svg>
              {{ imovel.area_util_m2 }}m²
            </span>
            <span v-if="imovel.vagas_garagem">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 17H4a2 2 0 01-2-2V8a2 2 0 012-2h1m0 11h14m-14 0v1a2 2 0 002 2h10a2 2 0 002-2v-1m0 0h1a2 2 0 002-2V8a2 2 0 00-2-2h-1M5 7h14"></path>
              </svg>
              {{ imovel.vagas_garagem }}
            </span>
          </div>

          <div class="imovel-date">
            Cadastrado em {{ new Date(imovel.$createdAt).toLocaleDateString('pt-BR') }}
          </div>
        </div>

        <div class="imovel-actions">
          <button @click="verDetalhes(imovel.$id)" class="btn-action btn-view" title="Ver detalhes">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Ver
          </button>
          <button @click="editarImovel(imovel.$id)" class="btn-action btn-edit" title="Editar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar
          </button>
          <button @click="confirmarExclusao(imovel)" class="btn-action btn-delete" title="Excluir">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Excluir
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-info {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-logout {
  background: white;
  color: #e74c3c;
  border: 2px solid #e74c3c;
}

.btn-logout:hover {
  background: #e74c3c;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* Estatísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-icon.disponivel {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.stat-icon.vendido {
  background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
  color: white;
}

.stat-icon.alugado {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-icon.venda {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-icon.aluguel {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.stat-content p {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
}

/* Filtros */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-header h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 700;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.view-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.filters-container {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr) auto;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 1rem;
  color: #7f8c8d;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-clear-filters {
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid #e74c3c;
  color: #e74c3c;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-clear-filters:hover {
  background: #e74c3c;
  color: white;
}

.results-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.results-info p {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.9rem;
}

/* Loading e Empty States */
.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
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
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
  color: #7f8c8d;
}

.empty-state h2 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1.5rem;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 1.05rem;
}

/* Grid de imóveis */
.imoveis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.imovel-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.imovel-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.card-image {
  width: 100%;
  height: 220px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.imovel-card:hover .card-image img {
  transform: scale(1.1);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
}

.card-status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
}

.card-status-badge.disponivel {
  background: rgba(39, 174, 96, 0.95);
  color: white;
}

.card-status-badge.vendido,
.card-status-badge.alugado {
  background: rgba(231, 76, 60, 0.95);
  color: white;
}

.card-status-actions {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
}

.status-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.status-action-btn:hover {
  background: white;
  transform: scale(1.1);
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.card-type {
  font-size: 0.85rem;
  color: #7f8c8d;
  text-transform: capitalize;
  margin: 0 0 0.5rem 0;
}

.card-location {
  font-size: 0.9rem;
  color: #555;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.card-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #27ae60;
  margin: 0 0 1rem 0;
  letter-spacing: -0.5px;
}

.card-specs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.card-specs span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: #555;
}

.card-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.btn-card {
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}

.btn-view {
  background: #3498db;
  color: white;
}

.btn-view:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-edit {
  background: #f39c12;
  color: white;
}

.btn-edit:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
  transform: translateY(-2px);
}


/* Lista de imóveis (visualização lista) */
.imoveis-lista {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.imovel-item {
  display: grid;
  grid-template-columns: 240px 1fr auto;
  gap: 2rem;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.imovel-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.imovel-foto {
  width: 240px;
  height: 180px;
  border-radius: 12px;
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
  font-weight: 700;
}

.status-badge {
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
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
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.imovel-preco {
  font-size: 1.5rem;
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

.imovel-specs span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
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
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-action:hover {
  transform: translateY(-2px);
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
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 700;
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
@media (max-width: 1200px) {
  .filters-container {
    grid-template-columns: 1fr 1fr;
  }
  
  .search-box {
    grid-column: 1 / -1;
  }
  
  .btn-clear-filters {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
  }

  .stat-content h3 {
    font-size: 1.5rem;
  }

  .filters-container {
    grid-template-columns: 1fr;
  }

  .imoveis-grid {
    grid-template-columns: 1fr;
  }

  .imovel-item {
    grid-template-columns: 1fr;
    gap: 1rem;
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
  }

  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    padding: 1.25rem;
  }

  .header-left {
    align-items: center;
    text-align: center;
  }

  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .header-actions {
    justify-content: center;
  }

  .btn {
    font-size: 0.85rem;
    padding: 0.6rem 1rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
