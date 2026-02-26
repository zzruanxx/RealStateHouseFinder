<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const imoveisVenda = ref([
  {
    id: 1,
    titulo: 'Casa de Alto Padrão em Araruama',
    tipo_imovel: 'casa',
    preco_venda: 850000,
    quartos: 4,
    banheiros: 3,
    area_util_m2: 250,
    vagas_garagem: 3,
    bairro: 'Condomínio Pedra de Itaúna',
    cidade: 'Araruama',
    descricao: 'Magnífica residência em condomínio fechado às margens da Lagoa de Araruama. Quatro suítes, sala ampla com lareira, cozinha gourmet, piscina aquecida, sauna, quadra de tênis e jardim tropical. Acabamento premium em toda a extensão.'
  },
  {
    id: 2,
    titulo: 'Apartamento 3 Quartos em Cabo Frio',
    tipo_imovel: 'apartamento',
    preco_venda: 480000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 105,
    vagas_garagem: 2,
    bairro: 'Braga',
    cidade: 'Cabo Frio',
    descricao: 'Excelente apartamento no bairro Braga com três quartos, sendo uma suíte, sala com varanda, cozinha planejada e dois banheiros. Condomínio com piscina, academia e salão de festas. A poucos metros do Canal e do comércio.'
  },
  {
    id: 3,
    titulo: 'Terreno com Vista para o Mar em Búzios',
    tipo_imovel: 'terreno',
    preco_venda: 950000,
    quartos: 0,
    banheiros: 0,
    area_util_m2: 800,
    vagas_garagem: 0,
    bairro: 'Ferradura',
    cidade: 'Armação dos Búzios',
    descricao: 'Terreno privilegiado na Ferradura com vista panorâmica para o mar. 800m² totalmente planos com murada e projeto arquitetônico aprovado. Documentação regularizada e escritura em cartório. Oportunidade única para construir a mansão dos sonhos.'
  },
  {
    id: 4,
    titulo: 'Casa em Condomínio em São Pedro da Aldeia',
    tipo_imovel: 'casa',
    preco_venda: 620000,
    quartos: 4,
    banheiros: 3,
    area_util_m2: 200,
    vagas_garagem: 3,
    bairro: 'Balneário',
    cidade: 'São Pedro da Aldeia',
    descricao: 'Bela casa em condomínio fechado com segurança 24h. Quatro quartos (duas suítes), três banheiros, sala em dois ambientes, cozinha americana, piscina privativa e churrasqueira. Amplo jardim e espaço para festas ao ar livre.'
  },
  {
    id: 5,
    titulo: 'Apartamento Cobertura em Cabo Frio',
    tipo_imovel: 'apartamento',
    preco_venda: 1200000,
    quartos: 4,
    banheiros: 4,
    area_util_m2: 280,
    vagas_garagem: 3,
    bairro: 'Centro',
    cidade: 'Cabo Frio',
    descricao: 'Luxuosa cobertura duplex com terraço de 100m², piscina privativa e vista de 360° para o mar e o canal. Quatro suítes, sala de estar e jantar, home theater, adega e cozinha gourmet. O ápice do luxo e sofisticação em Cabo Frio.'
  },
  {
    id: 6,
    titulo: 'Casa à Beira da Lagoa em Araruama',
    tipo_imovel: 'casa',
    preco_venda: 750000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 180,
    vagas_garagem: 2,
    bairro: 'Areal',
    cidade: 'Araruama',
    descricao: 'Rara oportunidade à beira da Lagoa de Araruama. Casa com acesso direto à lagoa, píer privativo, três quartos com suíte, sala panorâmica, cozinha equipada e garagem. Trampolim, área de lazer ao ar livre e jardim.'
  },
  {
    id: 7,
    titulo: 'Apartamento 2 Quartos em Arraial do Cabo',
    tipo_imovel: 'apartamento',
    preco_venda: 350000,
    quartos: 2,
    banheiros: 1,
    area_util_m2: 72,
    vagas_garagem: 1,
    bairro: 'Praia dos Anjos',
    cidade: 'Arraial do Cabo',
    descricao: 'Ótimo apartamento a 300 metros da Praia dos Anjos. Dois quartos, sala, cozinha e banheiro. Condomínio com piscina e área de lazer. Ideal para quem busca qualidade de vida à beira-mar com excelente custo-benefício.'
  },
  {
    id: 8,
    titulo: 'Villa de Luxo em Búzios',
    tipo_imovel: 'casa',
    preco_venda: 3500000,
    quartos: 5,
    banheiros: 6,
    area_util_m2: 500,
    vagas_garagem: 4,
    bairro: 'Joá',
    cidade: 'Armação dos Búzios',
    descricao: 'Villa de luxo no exclusivo bairro do Joá em Búzios. Cinco suítes master, seis banheiros, sala de cinema, adega climatizada, piscina olímpica com cascata, área de churrasco e heliponto. Propriedade única para quem exige o melhor.'
  },
  {
    id: 9,
    titulo: 'Terreno em Condomínio em São Pedro da Aldeia',
    tipo_imovel: 'terreno',
    preco_venda: 180000,
    quartos: 0,
    banheiros: 0,
    area_util_m2: 360,
    vagas_garagem: 0,
    bairro: 'Jardim Esperança',
    cidade: 'São Pedro da Aldeia',
    descricao: 'Terreno plano em condomínio fechado com infraestrutura completa. 360m², rua pavimentada, rede de esgoto, água e energia. Condomínio com portaria 24h, piscina e área de lazer. Localização central com fácil acesso à RJ-106.'
  },
  {
    id: 10,
    titulo: 'Casa em Saquarema Próxima à Praia',
    tipo_imovel: 'casa',
    preco_venda: 430000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 140,
    vagas_garagem: 2,
    bairro: 'Itaúna',
    cidade: 'Saquarema',
    descricao: 'Casa a 400m da famosa Praia de Itaúna. Três quartos, sala espaçosa, cozinha equipada, área gourmet e garagem para dois veículos. Quintal com espaço para piscina. Ideal para surfistas e amantes do mar.'
  },
  {
    id: 11,
    titulo: 'Apartamento Garden em Araruama',
    tipo_imovel: 'apartamento',
    preco_venda: 410000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 140,
    vagas_garagem: 2,
    bairro: 'Balneário Boa Vista',
    cidade: 'Araruama',
    descricao: 'Apartamento garden com área privativa de 100m², três quartos (suíte master), duas vagas de garagem e cozinha planejada. Condomínio com piscina, academia e salão de festas. Vista para área verde e fácil acesso à lagoa.'
  },
  {
    id: 12,
    titulo: 'Prédio Comercial em Cabo Frio',
    tipo_imovel: 'comercial',
    preco_venda: 2200000,
    quartos: 0,
    banheiros: 8,
    area_util_m2: 600,
    vagas_garagem: 10,
    bairro: 'Centro',
    cidade: 'Cabo Frio',
    descricao: 'Prédio comercial de três pavimentos no centro de Cabo Frio. 600m², oito banheiros, dez vagas de garagem, elevador e sistema de segurança. Localização estratégica com alta visibilidade. Ideal para clínicas, escritórios ou galeria comercial.'
  },
  {
    id: 13,
    titulo: 'Casa em Condomínio em Iguaba Grande',
    tipo_imovel: 'casa',
    preco_venda: 390000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 130,
    vagas_garagem: 2,
    bairro: 'Condomínio Verdes Lagos',
    cidade: 'Iguaba Grande',
    descricao: 'Ótima casa em condomínio fechado no Verdes Lagos. Três quartos com suíte, sala ampla, cozinha americana, área gourmet com churrasqueira e piscina. Condomínio com pista de caminhada, quadra e segurança 24h.'
  },
  {
    id: 14,
    titulo: 'Apartamento Vista Mar em Cabo Frio',
    tipo_imovel: 'apartamento',
    preco_venda: 780000,
    quartos: 3,
    banheiros: 3,
    area_util_m2: 130,
    vagas_garagem: 2,
    bairro: 'Ogiva',
    cidade: 'Cabo Frio',
    descricao: 'Deslumbrante apartamento com vista panorâmica para o mar na Praia das Dunas. Três suítes, sala de estar e jantar integradas, cozinha gourmet e duas vagas de garagem. Condomínio com piscina, academia e quadra.'
  },
  {
    id: 15,
    titulo: 'Casa Térrea em Araruama',
    tipo_imovel: 'casa',
    preco_venda: 320000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 110,
    vagas_garagem: 1,
    bairro: 'Centro',
    cidade: 'Araruama',
    descricao: 'Casa térrea bem localizada no centro de Araruama. Três quartos, sala, cozinha, dois banheiros e garagem. Quintal murado com área para churrasqueira. Documentação regularizada, próxima a escolas, mercados e transportes.'
  },
  {
    id: 16,
    titulo: 'Terreno Frente à Lagoa em Araruama',
    tipo_imovel: 'terreno',
    preco_venda: 650000,
    quartos: 0,
    banheiros: 0,
    area_util_m2: 1200,
    vagas_garagem: 0,
    bairro: 'Praia Seca',
    cidade: 'Araruama',
    descricao: 'Terreno excepcional na Praia Seca com frente para a Lagoa de Araruama. 1200m² de frente para a lagoa com píer. Escritura em cartório, documentação regularizada. Ideal para residência de alto padrão ou empreendimento de lazer.'
  },
  {
    id: 17,
    titulo: 'Apartamento 1 Quarto em São Pedro da Aldeia',
    tipo_imovel: 'apartamento',
    preco_venda: 195000,
    quartos: 1,
    banheiros: 1,
    area_util_m2: 45,
    vagas_garagem: 1,
    bairro: 'Porto da Aldeia',
    cidade: 'São Pedro da Aldeia',
    descricao: 'Apartamento compacto com um quarto, sala, cozinha e banheiro. Uma vaga de garagem. Condomínio com piscina. Excelente opção para primeiro imóvel ou investimento. Próximo à lagoa e ao centro da cidade.'
  },
  {
    id: 18,
    titulo: 'Casa Duplex em Búzios',
    tipo_imovel: 'casa',
    preco_venda: 1450000,
    quartos: 4,
    banheiros: 4,
    area_util_m2: 300,
    vagas_garagem: 3,
    bairro: 'Geribá',
    cidade: 'Armação dos Búzios',
    descricao: 'Impressionante casa duplex próxima à Praia de Geribá. Quatro suítes com varanda individual, sala de estar e jantar em pé-duplo, cozinha de chef, adega, piscina com raia, jacuzzi e espaço de meditação com jardim zen.'
  },
  {
    id: 19,
    titulo: 'Imóvel Comercial em Araruama',
    tipo_imovel: 'comercial',
    preco_venda: 450000,
    quartos: 0,
    banheiros: 3,
    area_util_m2: 200,
    vagas_garagem: 5,
    bairro: 'Centro',
    cidade: 'Araruama',
    descricao: 'Imóvel comercial de esquina em pleno centro de Araruama. 200m² em dois pavimentos, três banheiros, cinco vagas de estacionamento. Ponto privilegiado com alto fluxo. Ideal para supermercado, academia, escola ou clínica.'
  },
  {
    id: 20,
    titulo: 'Casa em Saquarema com Vista para o Mar',
    tipo_imovel: 'casa',
    preco_venda: 560000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 160,
    vagas_garagem: 2,
    bairro: 'Boqueirão',
    cidade: 'Saquarema',
    descricao: 'Casa com vista privilegiada para o mar no alto do morro de Saquarema. Três quartos (suíte), sala de estar com lareira e varanda panorâmica, cozinha equipada, área gourmet e garagem para dois veículos.'
  },
  {
    id: 21,
    titulo: 'Apartamento 2 Quartos em Iguaba Grande',
    tipo_imovel: 'apartamento',
    preco_venda: 270000,
    quartos: 2,
    banheiros: 2,
    area_util_m2: 80,
    vagas_garagem: 1,
    bairro: 'Vila Náutica',
    cidade: 'Iguaba Grande',
    descricao: 'Apartamento com dois quartos (suíte), sala, cozinha e dois banheiros. Uma vaga de garagem coberta. Condomínio com piscina, salão de festas e academia. Localizado na Vila Náutica, próximo à orla da lagoa.'
  },
  {
    id: 22,
    titulo: 'Casa Nova em Araruama',
    tipo_imovel: 'casa',
    preco_venda: 390000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 120,
    vagas_garagem: 2,
    bairro: 'Pontinha',
    cidade: 'Araruama',
    descricao: 'Casa nova (2024) com três quartos, sendo uma suíte com closet, dois banheiros sociais, sala integrada, cozinha americana e área de serviço. Duas vagas de garagem cobertas. Acabamento moderno de alto padrão.'
  },
  {
    id: 23,
    titulo: 'Terreno em Cabo Frio para Construção',
    tipo_imovel: 'terreno',
    preco_venda: 290000,
    quartos: 0,
    banheiros: 0,
    area_util_m2: 450,
    vagas_garagem: 0,
    bairro: 'Jardim Peró',
    cidade: 'Cabo Frio',
    descricao: 'Terreno plano de 450m² no Jardim Peró, a 1km da Praia do Peró. Documentação regularizada, infraestrutura de rua completa. Zoneamento residencial unifamiliar. Ótimo investimento na área mais valorizada de Cabo Frio.'
  },
  {
    id: 24,
    titulo: 'Chalé Rústico em Arraial do Cabo',
    tipo_imovel: 'casa',
    preco_venda: 480000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 150,
    vagas_garagem: 2,
    bairro: 'Praia Grande',
    cidade: 'Arraial do Cabo',
    descricao: 'Charmoso chalé rústico com acabamento em pedra e madeira de lei, a 500m da Praia Grande. Três quartos, dois banheiros, lareira na sala, cozinha artesanal, piscina natural com pedras e quintal arborizado.'
  },
  {
    id: 25,
    titulo: 'Studio Alto Padrão em Búzios',
    tipo_imovel: 'apartamento',
    preco_venda: 380000,
    quartos: 1,
    banheiros: 1,
    area_util_m2: 48,
    vagas_garagem: 1,
    bairro: 'Manguinhos',
    cidade: 'Armação dos Búzios',
    descricao: 'Studio de alto padrão com vista para a Praia de Manguinhos. Decoração contemporânea, cozinha gourmet planejada, banheiro com banheira de imersão e sacada privativa. Condomínio com piscina, academia e business center.'
  },
  {
    id: 26,
    titulo: 'Casa com Piscina em São Pedro da Aldeia',
    tipo_imovel: 'casa',
    preco_venda: 520000,
    quartos: 4,
    banheiros: 3,
    area_util_m2: 190,
    vagas_garagem: 3,
    bairro: 'Balneário São Pedro',
    cidade: 'São Pedro da Aldeia',
    descricao: 'Casa espaçosa com quatro quartos (duas suítes), três banheiros e piscina com cascata. Área gourmet coberta, churrasqueira, jardim e garagem para três veículos. Próxima à lagoa e ao comércio de São Pedro da Aldeia.'
  },
  {
    id: 27,
    titulo: 'Apartamento 4 Quartos em Cabo Frio',
    tipo_imovel: 'apartamento',
    preco_venda: 870000,
    quartos: 4,
    banheiros: 3,
    area_util_m2: 160,
    vagas_garagem: 2,
    bairro: 'Algodoal',
    cidade: 'Cabo Frio',
    descricao: 'Suntuoso apartamento com quatro quartos (três suítes), três banheiros e vista para o canal. Sala de estar e jantar integradas, varanda gourmet, duas vagas de garagem. Condomínio com piscina, sauna, academia e espaço kids.'
  },
  {
    id: 28,
    titulo: 'Terreno Industrial em Araruama',
    tipo_imovel: 'terreno',
    preco_venda: 320000,
    quartos: 0,
    banheiros: 0,
    area_util_m2: 2000,
    vagas_garagem: 0,
    bairro: 'Distrito Industrial',
    cidade: 'Araruama',
    descricao: 'Terreno no Distrito Industrial de Araruama. 2000m², escritura em cartório, zoneamento industrial, acesso por via pavimentada, rede elétrica trifásica disponível. Ideal para galpão, depósito ou pequena indústria.'
  },
  {
    id: 29,
    titulo: 'Casa em Condomínio em Saquarema',
    tipo_imovel: 'casa',
    preco_venda: 490000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 155,
    vagas_garagem: 2,
    bairro: 'Vilatur',
    cidade: 'Saquarema',
    descricao: 'Casa em condomínio fechado em Vilatur, a 600m da praia. Três quartos com suíte master, duas casas de banho, sala espaçosa, churrasqueira e piscina privativa. Condomínio com acesso privado à praia.'
  },
  {
    id: 30,
    titulo: 'Mansão Frente ao Mar em Arraial do Cabo',
    tipo_imovel: 'casa',
    preco_venda: 4200000,
    quartos: 6,
    banheiros: 7,
    area_util_m2: 650,
    vagas_garagem: 5,
    bairro: 'Praia do Forno',
    cidade: 'Arraial do Cabo',
    descricao: 'Extraordinária mansão com frente direta para a cristalina Praia do Forno. Seis suítes, sete banheiros, sala de cinema, adega, cozinha profissional, piscina com vista para o mar, spa, academia e estacionamento privativo para cinco veículos. A propriedade mais exclusiva de Arraial do Cabo.'
  }
]);

const filtroTipo = ref('');
const filtroCidade = ref('');
const filtroQuartos = ref('');
const filtroPrecoMax = ref('');

const imoveisFiltrados = computed(() => {
  return imoveisVenda.value.filter(imovel => {
    if (filtroTipo.value && imovel.tipo_imovel !== filtroTipo.value) return false;
    if (filtroCidade.value && imovel.cidade !== filtroCidade.value) return false;
    if (filtroQuartos.value && imovel.quartos < parseInt(filtroQuartos.value)) return false;
    if (filtroPrecoMax.value && imovel.preco_venda > parseFloat(filtroPrecoMax.value)) return false;
    return true;
  });
});

const cidades = computed(() => {
  return [...new Set(imoveisVenda.value.map(i => i.cidade))].sort();
});

const limparFiltros = () => {
  filtroTipo.value = '';
  filtroCidade.value = '';
  filtroQuartos.value = '';
  filtroPrecoMax.value = '';
};

const formatarPreco = (preco) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);
};

const voltarParaHome = () => {
  router.push('/');
};

const verDetalhes = (id) => {
  router.push(`/venda/${id}`);
};
</script>

<template>
  <div class="venda-container">
    <div class="page-header">
      <button @click="voltarParaHome" class="back-btn">
        <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar
      </button>
      <div class="header-text">
        <h1 class="page-title">Imóveis à Venda</h1>
        <p class="page-subtitle">Araruama e Região dos Lagos – {{ imoveisFiltrados.length }} imóveis disponíveis</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters-section">
      <div class="filters-grid">
        <div class="filter-group">
          <label class="field-label">Tipo de Imóvel</label>
          <select v-model="filtroTipo" class="filter-select">
            <option value="">Todos</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="field-label">Cidade</label>
          <select v-model="filtroCidade" class="filter-select">
            <option value="">Todas</option>
            <option v-for="cidade in cidades" :key="cidade" :value="cidade">{{ cidade }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="field-label">Quartos (mín.)</label>
          <select v-model="filtroQuartos" class="filter-select">
            <option value="">Qualquer</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="field-label">Preço máximo (R$)</label>
          <input type="number" v-model="filtroPrecoMax" placeholder="Ex: 500000" class="filter-input" />
        </div>
        <div class="filter-group filter-action">
          <button @click="limparFiltros" class="clear-btn">Limpar Filtros</button>
        </div>
      </div>
    </div>

    <!-- Grid de Imóveis -->
    <div v-if="imoveisFiltrados.length === 0" class="empty-section">
      <div class="empty-icon">🏠</div>
      <h3>Nenhum imóvel encontrado</h3>
      <p>Tente ajustar os filtros para ver mais resultados.</p>
      <button @click="limparFiltros" class="clear-btn-large">Ver todos os imóveis</button>
    </div>

    <div v-else class="properties-grid">
      <div
        v-for="imovel in imoveisFiltrados"
        :key="imovel.id"
        class="property-card"
      >
        <div class="property-image">
          <div class="image-placeholder">
            <span class="placeholder-icon">🏠</span>
          </div>
          <div class="property-badge venda">À Venda</div>
          <div class="property-type-tag">{{ imovel.tipo_imovel }}</div>
        </div>

        <div class="property-content">
          <h3 class="property-title">{{ imovel.titulo }}</h3>
          <div class="property-price">
            <span class="price-value">{{ formatarPreco(imovel.preco_venda) }}</span>
          </div>
          <div class="property-location">
            <svg class="location-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {{ imovel.bairro }}, {{ imovel.cidade }}
          </div>
          <p class="property-description">{{ imovel.descricao }}</p>
          <div class="property-features">
            <div v-if="imovel.quartos > 0" class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {{ imovel.quartos }} {{ imovel.quartos === 1 ? 'Quarto' : 'Quartos' }}
            </div>
            <div v-if="imovel.banheiros > 0" class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 6h11M12 12h8M9 18h11M3 6h.01M3 12h.01M3 18h.01"/>
              </svg>
              {{ imovel.banheiros }} {{ imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros' }}
            </div>
            <div class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
              </svg>
              {{ imovel.area_util_m2 }}m²
            </div>
            <div v-if="imovel.vagas_garagem > 0" class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/>
                <circle cx="7" cy="17" r="2"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
              {{ imovel.vagas_garagem }} {{ imovel.vagas_garagem === 1 ? 'Vaga' : 'Vagas' }}
            </div>
          </div>
          <button class="contact-btn" @click="verDetalhes(imovel.id)">
            Tenho Interesse
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.venda-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
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
  flex-shrink: 0;
}

.back-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.back-icon {
  width: 18px;
  height: 18px;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 2.2rem;
  color: #2c3e50;
  margin: 0 0 0.5rem;
  font-weight: 700;
}

.page-subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
}

/* Filtros */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.filter-select,
.filter-input {
  padding: 0.9rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-action {
  justify-content: flex-end;
}

.clear-btn {
  padding: 0.9rem 1.5rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #6c757d;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #e9ecef;
  color: #495057;
}

/* Empty State */
.empty-section {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-section h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-section p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.clear-btn-large {
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

.clear-btn-large:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

/* Properties Grid */
.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

.property-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.property-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.property-image {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.placeholder-icon {
  font-size: 4rem;
  opacity: 0.5;
}

.property-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.property-badge.venda {
  background: #e74c3c;
  color: white;
}

.property-type-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  text-transform: capitalize;
}

.property-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.property-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.75rem;
  line-height: 1.4;
}

.property-price {
  margin-bottom: 0.75rem;
}

.price-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #e74c3c;
}

.property-location {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.location-icon {
  width: 14px;
  height: 14px;
  color: #667eea;
  flex-shrink: 0;
}

.property-description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.property-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
  padding: 1rem 0;
  border-top: 1px solid #ecf0f1;
  border-bottom: 1px solid #ecf0f1;
  margin-bottom: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #555;
  font-weight: 500;
}

.feature-icon {
  width: 14px;
  height: 14px;
  color: #667eea;
  flex-shrink: 0;
}

.contact-btn {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .properties-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
