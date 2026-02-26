<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const imoveisLocacao = ref([
  {
    id: 1,
    titulo: 'Apartamento Vista para a Lagoa em Araruama',
    tipo_imovel: 'apartamento',
    preco_aluguel: 1800,
    quartos: 2,
    banheiros: 1,
    area_util_m2: 65,
    vagas_garagem: 1,
    bairro: 'Centro',
    cidade: 'Araruama',
    descricao: 'Lindo apartamento com vista privilegiada para a Lagoa de Araruama. Totalmente reformado, com sala de estar e jantar integradas, cozinha americana, área de serviço e varanda gourmet. Prédio com piscina, churrasqueira e playground.'
  },
  {
    id: 2,
    titulo: 'Casa de Praia em Cabo Frio',
    tipo_imovel: 'casa',
    preco_aluguel: 3200,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 120,
    vagas_garagem: 2,
    bairro: 'Peró',
    cidade: 'Cabo Frio',
    descricao: 'Espaçosa casa de praia no bairro Peró, a 300 metros da praia. Imóvel com três dormitórios, sendo uma suíte, piscina privativa, churrasqueira coberta e garagem para dois veículos. Ideal para famílias que buscam qualidade de vida.'
  },
  {
    id: 3,
    titulo: 'Kitnet Mobiliada em Búzios',
    tipo_imovel: 'apartamento',
    preco_aluguel: 1400,
    quartos: 1,
    banheiros: 1,
    area_util_m2: 30,
    vagas_garagem: 0,
    bairro: 'Centro',
    cidade: 'Armação dos Búzios',
    descricao: 'Kitnet completamente mobiliada no coração de Búzios, a poucos passos da Rua das Pedras. Ótima localização para quem deseja explorar o vibrante cenário gastronômico e cultural da cidade. Wi-Fi incluso.'
  },
  {
    id: 4,
    titulo: 'Casa com Piscina em São Pedro da Aldeia',
    tipo_imovel: 'casa',
    preco_aluguel: 2600,
    quartos: 4,
    banheiros: 3,
    area_util_m2: 180,
    vagas_garagem: 3,
    bairro: 'Balneário',
    cidade: 'São Pedro da Aldeia',
    descricao: 'Ampla casa em condomínio fechado com quatro quartos, três banheiros e piscina privativa. Churrasqueira, jardim amplo e garagem coberta para três veículos. Condomínio com portaria 24h, área de lazer completa e segurança.'
  },
  {
    id: 5,
    titulo: 'Apartamento 2 Quartos em Arraial do Cabo',
    tipo_imovel: 'apartamento',
    preco_aluguel: 2000,
    quartos: 2,
    banheiros: 2,
    area_util_m2: 75,
    vagas_garagem: 1,
    bairro: 'Praia dos Anjos',
    cidade: 'Arraial do Cabo',
    descricao: 'Apartamento de dois quartos a menos de 500 metros da Praia dos Anjos. Vista parcial para o mar, varanda, cozinha equipada. Condomínio com academia, salão de festas e portaria 24h. Próximo a restaurantes e comércios.'
  },
  {
    id: 6,
    titulo: 'Casa Térrea em Iguaba Grande',
    tipo_imovel: 'casa',
    preco_aluguel: 1500,
    quartos: 2,
    banheiros: 1,
    area_util_m2: 80,
    vagas_garagem: 1,
    bairro: 'Vila Nova',
    cidade: 'Iguaba Grande',
    descricao: 'Casa térrea com dois quartos, sala, cozinha e banheiro. Quintal com área de serviço e garagem. Localizada em rua tranquila, próximo a escolas, mercados e transporte público. Aceita animais de pequeno porte.'
  },
  {
    id: 7,
    titulo: 'Apartamento Cobertura em Cabo Frio',
    tipo_imovel: 'apartamento',
    preco_aluguel: 5500,
    quartos: 3,
    banheiros: 3,
    area_util_m2: 200,
    vagas_garagem: 2,
    bairro: 'Braga',
    cidade: 'Cabo Frio',
    descricao: 'Magnífica cobertura duplex no bairro Braga com terraço privativo de 80m², piscina e churrasqueira. Três suítes, sala em dois ambientes com vista panorâmica para o canal. Lazer completo no condomínio.'
  },
  {
    id: 8,
    titulo: 'Studio em Búzios com Vista para o Mar',
    tipo_imovel: 'apartamento',
    preco_aluguel: 2200,
    quartos: 1,
    banheiros: 1,
    area_util_m2: 38,
    vagas_garagem: 1,
    bairro: 'Manguinhos',
    cidade: 'Armação dos Búzios',
    descricao: 'Studio moderno com vista deslumbrante para a Praia de Manguinhos. Ambiente integrado, totalmente mobiliado, ar-condicionado e internet de alta velocidade. Condomínio com piscina, academia e quadra de tênis.'
  },
  {
    id: 9,
    titulo: 'Casa em Condomínio em Araruama',
    tipo_imovel: 'casa',
    preco_aluguel: 3000,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 150,
    vagas_garagem: 2,
    bairro: 'Praia Seca',
    cidade: 'Araruama',
    descricao: 'Casa em condomínio fechado na Praia Seca, Araruama. Três quartos com suíte master, sala ampla, cozinha com ilha, área gourmet coberta e piscina privativa. Rua sem saída, ambiente tranquilo e familiar.'
  },
  {
    id: 10,
    titulo: 'Sala Comercial em Araruama',
    tipo_imovel: 'comercial',
    preco_aluguel: 2500,
    quartos: 0,
    banheiros: 2,
    area_util_m2: 90,
    vagas_garagem: 3,
    bairro: 'Centro',
    cidade: 'Araruama',
    descricao: 'Excelente sala comercial no centro de Araruama, ideal para clínica, escritório ou consultório. 90m², dois banheiros, ar-condicionado central, três vagas de garagem e recepção. Prédio moderno com elevador.'
  },
  {
    id: 11,
    titulo: 'Casa Duplex em São Pedro da Aldeia',
    tipo_imovel: 'casa',
    preco_aluguel: 3500,
    quartos: 4,
    banheiros: 3,
    area_util_m2: 200,
    vagas_garagem: 2,
    bairro: 'Jardim Esperança',
    cidade: 'São Pedro da Aldeia',
    descricao: 'Casa duplex com quatro quartos (dois no piso inferior, dois no superior), três banheiros, sala de estar e jantar, varanda, churrasqueira e piscina. Rua arborizda com fácil acesso à Rodovia Amaral Peixoto.'
  },
  {
    id: 12,
    titulo: 'Apartamento 1 Quarto em Saquarema',
    tipo_imovel: 'apartamento',
    preco_aluguel: 1200,
    quartos: 1,
    banheiros: 1,
    area_util_m2: 45,
    vagas_garagem: 1,
    bairro: 'Boqueirão',
    cidade: 'Saquarema',
    descricao: 'Apartamento compacto e bem localizado em Saquarema, famosa pelas ondas ideais para o surfe. Um quarto, sala, cozinha com armários, banheiro e garagem. Próximo à orla e ao comércio local.'
  },
  {
    id: 13,
    titulo: 'Casa de Temporada em Arraial do Cabo',
    tipo_imovel: 'casa',
    preco_aluguel: 4500,
    quartos: 4,
    banheiros: 2,
    area_util_m2: 160,
    vagas_garagem: 2,
    bairro: 'Praia Grande',
    cidade: 'Arraial do Cabo',
    descricao: 'Casa aconchegante a 200m da Praia Grande, ideal para veraneio. Quatro quartos, duas casas de banho, cozinha totalmente equipada, churrasqueira, área externa com jardim e garagem para dois carros.'
  },
  {
    id: 14,
    titulo: 'Apartamento Garden em Cabo Frio',
    tipo_imovel: 'apartamento',
    preco_aluguel: 3800,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 130,
    vagas_garagem: 2,
    bairro: 'Porto da Aldeia',
    cidade: 'São Pedro da Aldeia',
    descricao: 'Lindo apartamento garden com área privativa de 80m², três quartos sendo uma suíte, sala ampla e cozinha planejada. Condomínio com piscina, academia e espaço gourmet. Próximo à lagoa e ao centro da cidade.'
  },
  {
    id: 15,
    titulo: 'Casa com Vista para a Lagoa em Araruama',
    tipo_imovel: 'casa',
    preco_aluguel: 2800,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 130,
    vagas_garagem: 1,
    bairro: 'Areal',
    cidade: 'Araruama',
    descricao: 'Casa com vista deslumbrante para a Lagoa de Araruama. Três quartos, sala espaçosa, cozinha bem equipada, área de serviço e garagem. Quintal com jardim e churrasqueira. Localização privilegiada próxima à praia de Areal.'
  },
  {
    id: 16,
    titulo: 'Kitnet Equipada em São Pedro da Aldeia',
    tipo_imovel: 'apartamento',
    preco_aluguel: 950,
    quartos: 1,
    banheiros: 1,
    area_util_m2: 28,
    vagas_garagem: 0,
    bairro: 'Centro',
    cidade: 'São Pedro da Aldeia',
    descricao: 'Kitnet bem localizada no centro de São Pedro da Aldeia, mobiliada com cama, guarda-roupa, frigobar e micro-ondas. Próxima a supermercados, farmácias e pontos de ônibus. Conta de água inclusa no aluguel.'
  },
  {
    id: 17,
    titulo: 'Casa Alto Padrão em Búzios',
    tipo_imovel: 'casa',
    preco_aluguel: 8000,
    quartos: 4,
    banheiros: 4,
    area_util_m2: 280,
    vagas_garagem: 3,
    bairro: 'Ferradura',
    cidade: 'Armação dos Búzios',
    descricao: 'Mansão de alto padrão na Ferradura com quatro suítes, sala com lareira, cozinha gourmet, piscina aquecida com vista para o mar, área de churrasco e jardim tropical. Acabamento impecável e mobília de luxo.'
  },
  {
    id: 18,
    titulo: 'Flat Residencial em Cabo Frio',
    tipo_imovel: 'apartamento',
    preco_aluguel: 1700,
    quartos: 1,
    banheiros: 1,
    area_util_m2: 42,
    vagas_garagem: 1,
    bairro: 'Centro',
    cidade: 'Cabo Frio',
    descricao: 'Flat residencial no coração de Cabo Frio, a 600m da Praia do Forte. Quarto, sala de estar, cozinha americana e banheiro. Condomínio com piscina, lavanderia e academia. Fácil acesso ao Canal e ao Centro.'
  },
  {
    id: 19,
    titulo: 'Casa em Condomínio Fechado em Iguaba Grande',
    tipo_imovel: 'casa',
    preco_aluguel: 2200,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 110,
    vagas_garagem: 2,
    bairro: 'Condomínio Verdes Lagos',
    cidade: 'Iguaba Grande',
    descricao: 'Casa em condomínio fechado com segurança 24h, três quartos (suíte), área gourmet com churrasqueira, piscina e dois vagas de garagem. Condomínio com pista de caminhada, quadra poliesportiva e playground para crianças.'
  },
  {
    id: 20,
    titulo: 'Apartamento 3 Quartos em Araruama',
    tipo_imovel: 'apartamento',
    preco_aluguel: 2400,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 95,
    vagas_garagem: 1,
    bairro: 'Balneário Boa Vista',
    cidade: 'Araruama',
    descricao: 'Apartamento espaçoso com três quartos, sendo uma suíte, dois banheiros e sala ampla com varanda. Cozinha planejada, área de serviço e garagem. Condomínio com piscina, salão de festas e área verde.'
  },
  {
    id: 21,
    titulo: 'Loja Comercial em São Pedro da Aldeia',
    tipo_imovel: 'comercial',
    preco_aluguel: 3000,
    quartos: 0,
    banheiros: 1,
    area_util_m2: 70,
    vagas_garagem: 2,
    bairro: 'Balneário São Pedro',
    cidade: 'São Pedro da Aldeia',
    descricao: 'Loja comercial com excelente localização e alto fluxo de pedestres. 70m² de área, banheiro, vitrine, depósito e dois vagas. Ideal para comércio, estética ou serviços. Ponto comercial valorizado.'
  },
  {
    id: 22,
    titulo: 'Casa de Veraneio em Saquarema',
    tipo_imovel: 'casa',
    preco_aluguel: 2900,
    quartos: 4,
    banheiros: 2,
    area_util_m2: 145,
    vagas_garagem: 2,
    bairro: 'Vilatur',
    cidade: 'Saquarema',
    descricao: 'Casa espaçosa em Vilatur, a 400m da praia. Quatro quartos, dois banheiros, sala de jantar e estar, cozinha equipada, churrasqueira e área externa ampla. Perfeita para família que busca lazer e contato com a natureza.'
  },
  {
    id: 23,
    titulo: 'Apartamento com Piscina em Cabo Frio',
    tipo_imovel: 'apartamento',
    preco_aluguel: 2700,
    quartos: 2,
    banheiros: 2,
    area_util_m2: 82,
    vagas_garagem: 1,
    bairro: 'Jardim Peró',
    cidade: 'Cabo Frio',
    descricao: 'Apartamento em residencial com piscina, sauna, academia e espaço gourmet. Dois quartos com suíte, sala com varanda, cozinha planejada e área de serviço. Localizado a 800m da Praia do Peró.'
  },
  {
    id: 24,
    titulo: 'Casa Mobiliada em Arraial do Cabo',
    tipo_imovel: 'casa',
    preco_aluguel: 2500,
    quartos: 2,
    banheiros: 1,
    area_util_m2: 90,
    vagas_garagem: 1,
    bairro: 'Pontal do Atalaia',
    cidade: 'Arraial do Cabo',
    descricao: 'Casa mobiliada a 250m da Praia do Pontal, dois quartos, sala, cozinha americana e banheiro. Quintal com churrasqueira e área de serviço. Ponto privilegiado com acesso fácil a diversas praias da cidade.'
  },
  {
    id: 25,
    titulo: 'Apartamento em Condomínio em Araruama',
    tipo_imovel: 'apartamento',
    preco_aluguel: 2100,
    quartos: 2,
    banheiros: 1,
    area_util_m2: 70,
    vagas_garagem: 1,
    bairro: 'Pontinha',
    cidade: 'Araruama',
    descricao: 'Apartamento com dois quartos, sala, cozinha e banheiro social. Varanda com vista para área verde do condomínio. Lazer completo: piscina, salão de festas e churrasqueira coletiva. Perto da Lagoa de Araruama.'
  },
  {
    id: 26,
    titulo: 'Sala para Escritório em Búzios',
    tipo_imovel: 'comercial',
    preco_aluguel: 1800,
    quartos: 0,
    banheiros: 1,
    area_util_m2: 40,
    vagas_garagem: 1,
    bairro: 'Brava',
    cidade: 'Armação dos Búzios',
    descricao: 'Sala comercial ideal para escritório, consultório ou estúdio. 40m², pé-direito alto, ar-condicionado, banheiro privativo e uma vaga de garagem. Localizada em galeria comercial com portaria.'
  },
  {
    id: 27,
    titulo: 'Casa Térrea com Quintal em Iguaba Grande',
    tipo_imovel: 'casa',
    preco_aluguel: 1700,
    quartos: 3,
    banheiros: 1,
    area_util_m2: 95,
    vagas_garagem: 1,
    bairro: 'Recanto',
    cidade: 'Iguaba Grande',
    descricao: 'Casa térrea com três quartos, sala, cozinha e banheiro. Quintal generoso com espaço para churrasco e jardim. Localizada em rua tranquila e arborizada, próxima a escolas e supermercados.'
  },
  {
    id: 28,
    titulo: 'Apartamento Vista Mar em Cabo Frio',
    tipo_imovel: 'apartamento',
    preco_aluguel: 4200,
    quartos: 3,
    banheiros: 2,
    area_util_m2: 105,
    vagas_garagem: 2,
    bairro: 'Ogiva',
    cidade: 'Cabo Frio',
    descricao: 'Apartamento com vista privilegiada para o mar. Três quartos, dois banheiros, sala de estar/jantar com varanda panorâmica. Condomínio com piscina, quadra e academia. Próximo à Praia das Dunas.'
  },
  {
    id: 29,
    titulo: 'Casa Duplex em Saquarema',
    tipo_imovel: 'casa',
    preco_aluguel: 3200,
    quartos: 4,
    banheiros: 3,
    area_util_m2: 170,
    vagas_garagem: 2,
    bairro: 'Itaúna',
    cidade: 'Saquarema',
    descricao: 'Casa duplex a 500m da famosa Praia de Itaúna. Quatro quartos (suíte master), três banheiros, sala em dois ambientes, cozinha gourmet, piscina e área de lazer. Garagem para dois veículos.'
  },
  {
    id: 30,
    titulo: 'Casa em Condomínio de Luxo em Araruama',
    tipo_imovel: 'casa',
    preco_aluguel: 6000,
    quartos: 5,
    banheiros: 4,
    area_util_m2: 320,
    vagas_garagem: 4,
    bairro: 'Condomínio Pedra de Itaúna',
    cidade: 'Araruama',
    descricao: 'Residência de alto padrão em condomínio de luxo às margens da Lagoa de Araruama. Cinco quartos (três suítes), quatro banheiros, sala panorâmica, cozinha gourmet, área de lazer com piscina, sauna e espaço gourmet. Condomínio com marina privativa.'
  }
]);

const filtroTipo = ref('');
const filtroCidade = ref('');
const filtroQuartos = ref('');
const filtroPrecoMax = ref('');

const imoveisFiltrados = computed(() => {
  return imoveisLocacao.value.filter(imovel => {
    if (filtroTipo.value && imovel.tipo_imovel !== filtroTipo.value) return false;
    if (filtroCidade.value && imovel.cidade !== filtroCidade.value) return false;
    if (filtroQuartos.value && imovel.quartos < parseInt(filtroQuartos.value)) return false;
    if (filtroPrecoMax.value && imovel.preco_aluguel > parseFloat(filtroPrecoMax.value)) return false;
    return true;
  });
});

const cidades = computed(() => {
  return [...new Set(imoveisLocacao.value.map(i => i.cidade))].sort();
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
  router.push(`/locacao/${id}`);
};
</script>

<template>
  <div class="locacao-container">
    <div class="page-header">
      <button @click="voltarParaHome" class="back-btn">
        <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar
      </button>
      <div class="header-text">
        <h1 class="page-title">Imóveis para Alugar</h1>
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
          <label class="field-label">Aluguel máximo (R$)</label>
          <input type="number" v-model="filtroPrecoMax" placeholder="Ex: 3000" class="filter-input" />
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
          <div class="property-badge aluguel">Aluguel</div>
          <div class="property-type-tag">{{ imovel.tipo_imovel }}</div>
        </div>

        <div class="property-content">
          <h3 class="property-title">{{ imovel.titulo }}</h3>
          <div class="property-price">
            <span class="price-value">{{ formatarPreco(imovel.preco_aluguel) }}</span>
            <span class="price-period">/mês</span>
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
            <div class="feature-item">
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
.locacao-container {
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.property-badge.aluguel {
  background: #27ae60;
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
  color: #27ae60;
}

.price-period {
  font-size: 0.9rem;
  color: #7f8c8d;
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
  background: linear-gradient(135deg, #667eea, #764ba2);
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
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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
