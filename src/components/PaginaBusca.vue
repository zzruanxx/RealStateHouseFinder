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
  <div class="busca-container">
    <div class="page-header">
      <button @click="voltarParaHome" class="btn btn-secondary btn-voltar">
        ← Voltar
      </button>
      <h1 class="busca-title">Buscar Imóveis</h1>
    </div>

    <!-- Formulário de Filtros -->
    <div class="filtros-card">
      <h2 class="filtros-title">Filtros de Busca</h2>
      <form @submit.prevent="aplicarFiltros" class="filtros-form">
        <!-- Busca por texto -->
        <div class="form-group full-width">
          <label for="texto_busca">Buscar por palavra-chave</label>
          <input
            type="text"
            id="texto_busca"
            v-model="filtros.texto_busca"
            placeholder="Digite título, descrição, cidade ou bairro..."
            class="form-input"
          />
        </div>

        <div class="filtros-row">
          <div class="form-group">
            <label for="tipo_anuncio">Tipo de Negócio</label>
            <select id="tipo_anuncio" v-model="filtros.tipo_anuncio" class="form-select">
              <option value="">Todos</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
          </div>

          <div class="form-group">
            <label for="tipo_imovel">Tipo de Imóvel</label>
            <select id="tipo_imovel" v-model="filtros.tipo_imovel" class="form-select">
              <option value="">Todos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
              <option value="rural">Rural</option>
            </select>
          </div>

          <div class="form-group">
            <label for="cidade">Cidade</label>
            <input
              type="text"
              id="cidade"
              v-model="filtros.cidade"
              placeholder="Ex: São Paulo"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="quartos_min">Quartos (mínimo)</label>
            <input
              type="number"
              id="quartos_min"
              v-model="filtros.quartos_min"
              placeholder="1"
              min="0"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="banheiros_min">Banheiros (mínimo)</label>
            <input
              type="number"
              id="banheiros_min"
              v-model="filtros.banheiros_min"
              placeholder="1"
              min="0"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="preco_min">Preço mínimo (R$)</label>
            <input
              type="number"
              id="preco_min"
              v-model="filtros.preco_min"
              placeholder="100000"
              step="1000"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="preco_max">Preço máximo (R$)</label>
            <input
              type="number"
              id="preco_max"
              v-model="filtros.preco_max"
              placeholder="500000"
              step="1000"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="ordenacao">Ordenar por</label>
            <select id="ordenacao" v-model="ordenacao" class="form-select">
              <option value="recentes">Mais recentes</option>
              <option value="preco_asc">Menor preço</option>
              <option value="preco_desc">Maior preço</option>
            </select>
          </div>
        </div>

        <div class="filtros-actions">
          <button type="submit" class="btn btn-primary">🔍 Buscar</button>
          <button type="button" @click="limparFiltros" class="btn btn-secondary">
            🗑️ Limpar Filtros
          </button>
        </div>
      </form>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Carregando imóveis...</p>
    </div>

    <!-- Sem Resultados -->
    <div v-else-if="imoveis.length === 0" class="no-results">
      <p>Nenhum imóvel encontrado com os filtros selecionados.</p>
      <button @click="limparFiltros" class="btn btn-secondary">
        Ver todos os imóveis
      </button>
    </div>

    <!-- Resultados -->
    <div v-else class="resultados">
      <p class="resultados-count">{{ imoveis.length }} imóvel(is) encontrado(s)</p>

      <div class="imoveis-grid">
        <router-link
          v-for="imovel in imoveis"
          :key="imovel.$id"
          :to="{ name: 'DetalheImovel', params: { id: imovel.$id } }"
          class="imovel-card-link"
        >
          <div class="imovel-card">
            <div class="imovel-foto">
              <img
                v-if="imovel.fotoUrl"
                :src="imovel.fotoUrl"
                :alt="imovel.titulo"
                class="foto-img"
              />
              <div v-else class="foto-placeholder">
                <span>Sem foto</span>
              </div>
              <span class="imovel-badge">{{ imovel.tipo_anuncio }}</span>
            </div>

            <div class="imovel-content">
              <h3 class="imovel-titulo">{{ imovel.titulo }}</h3>

              <p class="imovel-preco">
                {{
                  imovel.tipo_anuncio === 'aluguel'
                    ? formatarPreco(imovel.preco_aluguel)
                    : formatarPreco(imovel.preco_venda)
                }}
                <span v-if="imovel.tipo_anuncio === 'aluguel'">/mês</span>
              </p>

              <p class="imovel-localizacao">
                📍 {{ imovel.bairro }}, {{ imovel.cidade }}
              </p>

              <div class="imovel-specs">
                <span class="spec-item">🛏️ {{ imovel.quartos }} quarto(s)</span>
                <span class="spec-item">🚿 {{ imovel.banheiros }} banheiro(s)</span>
                <span v-if="imovel.area_util_m2" class="spec-item">
                  📏 {{ imovel.area_util_m2 }} m²
                </span>
                <span v-if="imovel.vagas_garagem" class="spec-item">
                  🚗 {{ imovel.vagas_garagem }} vaga(s)
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.busca-container {
  padding: 1rem 0;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-voltar {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.busca-title {
  font-size: 2rem;
  margin-bottom: 0;
  color: #2c3e50;
}

.filtros-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filtros-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.filtros-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filtros-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
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
  font-size: 0.9rem;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3498db;
}

.filtros-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
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

.no-results {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
}

.no-results p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #7f8c8d;
}

.resultados-count {
  margin-bottom: 1rem;
  color: #7f8c8d;
}

.imoveis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.imovel-card-link {
  text-decoration: none;
  color: inherit;
}

.imovel-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.imovel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.imovel-foto {
  position: relative;
  height: 200px;
  background-color: #f0f0f0;
}

.foto-img {
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
}

.imovel-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
}

.imovel-content {
  padding: 1.5rem;
}

.imovel-titulo {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.imovel-preco {
  font-size: 1.5rem;
  font-weight: bold;
  color: #27ae60;
  margin-bottom: 0.5rem;
}

.imovel-localizacao {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.imovel-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.spec-item {
  font-size: 0.9rem;
  color: #555;
}

@media (max-width: 768px) {
  .filtros-row {
    grid-template-columns: 1fr;
  }

  .imoveis-grid {
    grid-template-columns: 1fr;
  }
}
</style>
