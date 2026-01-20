<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { databases, storage, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID, Query } from '../appwrite';

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const imoveis = ref([]);

// Filtros
const filtros = ref({
  texto_busca: route.query.texto_busca || '',
  tipo_anuncio: route.query.tipo_anuncio || '',
  tipo_imovel: route.query.tipo_imovel || '',
  cidade: route.query.cidade || '',
  quartos_min: route.query.quartos_min || '',
  banheiros_min: route.query.banheiros_min || '',
  preco_min: route.query.preco_min || '',
  preco_max: route.query.preco_max || ''
});

const ordenacao = ref(route.query.ordenacao || 'recentes');

const buscarImoveis = async () => {
  isLoading.value = true;
  try {
    // Construir queries dinamicamente
    const queries = [Query.equal('status', 'disponivel')];

    if (filtros.value.tipo_anuncio) {
      queries.push(Query.equal('tipo_anuncio', filtros.value.tipo_anuncio));
    }

    if (filtros.value.tipo_imovel) {
      queries.push(Query.equal('tipo_imovel', filtros.value.tipo_imovel));
    }

    if (filtros.value.cidade) {
      queries.push(Query.equal('cidade', filtros.value.cidade));
    }

    if (filtros.value.quartos_min) {
      queries.push(Query.greaterThanEqual('quartos', parseInt(filtros.value.quartos_min)));
    }

    if (filtros.value.banheiros_min) {
      queries.push(Query.greaterThanEqual('banheiros', parseInt(filtros.value.banheiros_min)));
    }

    if (filtros.value.preco_min) {
      const precoMin = parseFloat(filtros.value.preco_min);
      if (filtros.value.tipo_anuncio === 'aluguel') {
        queries.push(Query.greaterThanEqual('preco_aluguel', precoMin));
      } else if (!filtros.value.tipo_anuncio || filtros.value.tipo_anuncio === 'venda') {
        queries.push(Query.greaterThanEqual('preco_venda', precoMin));
      }
    }

    if (filtros.value.preco_max) {
      const precoMax = parseFloat(filtros.value.preco_max);
      if (filtros.value.tipo_anuncio === 'aluguel') {
        queries.push(Query.lessThanEqual('preco_aluguel', precoMax));
      } else if (!filtros.value.tipo_anuncio || filtros.value.tipo_anuncio === 'venda') {
        queries.push(Query.lessThanEqual('preco_venda', precoMax));
      }
    }

    // Aplicar ordenação
    if (ordenacao.value === 'preco_asc') {
      queries.push(Query.orderAsc(filtros.value.tipo_anuncio === 'aluguel' ? 'preco_aluguel' : 'preco_venda'));
    } else if (ordenacao.value === 'preco_desc') {
      queries.push(Query.orderDesc(filtros.value.tipo_anuncio === 'aluguel' ? 'preco_aluguel' : 'preco_venda'));
    } else {
      queries.push(Query.orderDesc('$createdAt'));
    }

    queries.push(Query.limit(50));

    // Buscar documentos
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      queries
    );

    // Processar resultados e gerar URLs das fotos
    let resultados = response.documents.map(imovel => {
      const fotoUrl = imovel.fotos_storage_ids && imovel.fotos_storage_ids.length > 0
        ? storage.getFilePreview(
            BUCKET_FOTOS_ID,
            imovel.fotos_storage_ids[0],
            400,
            300,
            'center',
            100
          ).href
        : '';

      return {
        ...imovel,
        fotoUrl
      };
    });

    // Filtro de texto (busca no cliente por limitação do Appwrite)
    if (filtros.value.texto_busca) {
      const termo = filtros.value.texto_busca.toLowerCase();
      resultados = resultados.filter(imovel => 
        imovel.titulo.toLowerCase().includes(termo) ||
        (imovel.descricao && imovel.descricao.toLowerCase().includes(termo)) ||
        imovel.cidade.toLowerCase().includes(termo) ||
        imovel.bairro.toLowerCase().includes(termo)
      );
    }

    imoveis.value = resultados;

  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
  } finally {
    isLoading.value = false;
  }
};

const aplicarFiltros = () => {
  // Atualizar URL com query params
  router.push({
    path: '/busca',
    query: {
      ...filtros.value,
      ordenacao: ordenacao.value
    }
  });
  buscarImoveis();
};

const limparFiltros = () => {
  filtros.value = {
    texto_busca: '',
    tipo_anuncio: '',
    tipo_imovel: '',
    cidade: '',
    quartos_min: '',
    banheiros_min: '',
    preco_min: '',
    preco_max: ''
  };
  ordenacao.value = 'recentes';
  router.push({ path: '/busca' });
  buscarImoveis();
};

const formatarPreco = (preco) => {
  if (!preco) return 'Consulte';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco);
};

const voltarParaHome = () => {
  router.push('/');
};

onMounted(() => {
  buscarImoveis();
});
</script>

<template>
  <div class="search-container">
    <div class="page-header">
      <button @click="voltarParaHome" class="back-btn">
        <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar
      </button>
      <h1 class="page-title">Buscar Imóveis</h1>
    </div>

    <!-- Filtros Aprimorados -->
    <div class="filters-section">
      <div class="filters-header">
        <div class="filters-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filtros de Busca
        </div>
      </div>

      <form @submit.prevent="aplicarFiltros" class="filters-form">
        <!-- Campo de busca por texto -->
        <div class="search-field">
          <label class="field-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Buscar por palavra-chave
          </label>
          <input
            type="text"
            v-model="filtros.texto_busca"
            placeholder="Digite título, descrição, cidade ou bairro..."
            class="search-input"
          />
        </div>

        <div class="filters-grid">
          <div class="filter-group">
            <label class="field-label">Tipo de Negócio</label>
            <select v-model="filtros.tipo_anuncio" class="filter-select">
              <option value="">Todos</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="field-label">Tipo de Imóvel</label>
            <select v-model="filtros.tipo_imovel" class="filter-select">
              <option value="">Todos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
              <option value="rural">Rural</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="field-label">Cidade</label>
            <input
              type="text"
              v-model="filtros.cidade"
              placeholder="Ex: São Paulo"
              class="filter-input"
            />
          </div>

          <div class="filter-group">
            <label class="field-label">Quartos (mínimo)</label>
            <input
              type="number"
              v-model="filtros.quartos_min"
              placeholder="1"
              min="0"
              class="filter-input"
            />
          </div>

          <div class="filter-group">
            <label class="field-label">Banheiros (mínimo)</label>
            <input
              type="number"
              v-model="filtros.banheiros_min"
              placeholder="1"
              min="0"
              class="filter-input"
            />
          </div>

          <div class="filter-group">
            <label class="field-label">Preço mínimo (R$)</label>
            <input
              type="number"
              v-model="filtros.preco_min"
              placeholder="100000"
              step="1000"
              class="filter-input"
            />
          </div>

          <div class="filter-group">
            <label class="field-label">Preço máximo (R$)</label>
            <input
              type="number"
              v-model="filtros.preco_max"
              placeholder="500000"
              step="1000"
              class="filter-input"
            />
          </div>

          <div class="filter-group">
            <label class="field-label">Ordenar por</label>
            <select v-model="ordenacao" class="filter-select">
              <option value="recentes">Mais recentes</option>
              <option value="preco_asc">Menor preço</option>
              <option value="preco_desc">Maior preço</option>
            </select>
          </div>
        </div>

        <div class="filters-actions">
          <button type="submit" class="action-btn primary">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Buscar
          </button>
          <button type="button" @click="limparFiltros" class="action-btn secondary">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
            Limpar Filtros
          </button>
        </div>
      </form>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-section">
      <div class="loading-spinner"></div>
      <p>Carregando imóveis...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="imoveis.length === 0" class="empty-section">
      <div class="empty-content">
        <div class="empty-icon">🏠</div>
        <h3>Nenhum imóvel encontrado</h3>
        <p>Não encontramos imóveis com os filtros selecionados.</p>
        <button @click="limparFiltros" class="empty-btn">
          Ver todos os imóveis
        </button>
      </div>
    </div>

    <!-- Resultados -->
    <div v-else class="results-section">
      <div class="results-header">
        <p class="results-count">{{ imoveis.length }} imóvel(is) encontrado(s)</p>
      </div>

      <div class="properties-grid">
        <router-link
          v-for="imovel in imoveis"
          :key="imovel.$id"
          :to="{ name: 'DetalheImovel', params: { id: imovel.$id } }"
          class="property-link"
        >
          <div class="property-card">
            <div class="property-image">
              <img
                v-if="imovel.fotoUrl"
                :src="imovel.fotoUrl"
                :alt="`${imovel.titulo} - ${imovel.cidade}`"
                loading="lazy"
                class="image"
              />
              <div v-else class="image-placeholder">
                <span>Sem foto</span>
              </div>
              <div class="property-type">{{ imovel.tipo_imovel }}</div>
              <div class="property-status">{{ imovel.tipo_anuncio }}</div>
              <div class="property-code">COD. {{ imovel.$id.substring(0, 8).toUpperCase() }}</div>
            </div>

            <div class="property-content">
              <div class="property-type-badge">{{ imovel.tipo_imovel }}</div>
              <h3 class="property-title">{{ imovel.titulo }}</h3>

              <div class="property-price">
                <span class="price-value">
                  {{
                    imovel.tipo_anuncio === 'aluguel'
                      ? formatarPreco(imovel.preco_aluguel)
                      : formatarPreco(imovel.preco_venda)
                  }}
                </span>
                <span v-if="imovel.tipo_anuncio === 'aluguel'" class="price-period">/mês</span>
              </div>

              <div class="property-location">
                <svg class="location-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {{ imovel.bairro }}, {{ imovel.cidade }}
              </div>

              <div class="property-features">
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  {{ imovel.quartos }}
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 6h11M12 12h8M9 18h11M3 6h.01M3 12h.01M3 18h.01"/>
                  </svg>
                  {{ imovel.banheiros }}
                </div>
                <div v-if="imovel.area_util_m2" class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                  </svg>
                  {{ imovel.area_util_m2 }}m²
                </div>
                <div v-if="imovel.vagas_garagem" class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/>
                    <circle cx="7" cy="17" r="2"/>
                    <circle cx="17" cy="17" r="2"/>
                  </svg>
                  {{ imovel.vagas_garagem }}
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  padding: 1rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #6c757d;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.back-icon {
  width: 18px;
  height: 18px;
}

.page-title {
  font-size: 2.2rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 700;
}

/* Filtros Section */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.filters-header {
  margin-bottom: 2rem;
}

.filters-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.title-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
}

.filters-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-field {
  width: 100%;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: #667eea;
}

.search-input {
  width: 100%;
  padding: 1.2rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1.1rem;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-input,
.filter-select {
  padding: 0.9rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filters-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  justify-content: center;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e9ecef;
}

.action-btn.secondary:hover {
  background: #e9ecef;
  color: #495057;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Loading */
.loading-section {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-section {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-content {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-content h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-content p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.empty-btn {
  padding: 1rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

/* Results */
.results-section {
  margin-top: 2rem;
}

.results-header {
  margin-bottom: 2rem;
}

.results-count {
  font-size: 1.1rem;
  color: #7f8c8d;
  text-align: center;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.property-link {
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.property-link:hover {
  transform: translateY(-8px);
}

.property-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
}

.property-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.property-image {
  position: relative;
  height: 220px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.property-card:hover .image {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  font-size: 1.1rem;
}

.property-type,
.property-status,
.property-code {
  position: absolute;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.property-type {
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
}

.property-status {
  top: 12px;
  right: 12px;
  background: #667eea;
  color: white;
}

.property-code {
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.75rem;
  padding: 0.4rem 0.8rem;
  letter-spacing: 0.5px;
  font-family: monospace;
}

.property-content {
  padding: 1.5rem;
}

.property-type-badge {
  display: inline-block;
  background: #ecf0f1;
  color: #2c3e50;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 0.75rem;
}

.property-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.property-price {
  margin-bottom: 0.75rem;
}

.price-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #27ae60;
}

.price-period {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: normal;
}

.property-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.location-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
  flex-shrink: 0;
}

.property-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.feature-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
  flex-shrink: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .search-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .filters-section {
    padding: 2rem 1.5rem;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .filters-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    min-width: auto;
  }

  .properties-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .empty-section {
    padding: 3rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .filters-section {
    padding: 1.5rem 1rem;
  }

  .search-input {
    font-size: 1rem;
    padding: 1rem;
  }

  .filter-input,
  .filter-select {
    padding: 0.8rem;
  }

  .property-card {
    margin: 0 -0.5rem;
  }
}
</style>
