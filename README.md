# RealStateHouseFinder

Portal imobiliário completo desenvolvido com Vue.js 3 e Appwrite BaaS.

## 🏠 Sobre o Projeto

Este é um sistema completo de portal imobiliário **alinhado aos padrões dos melhores portais do mercado** que permite:
- Buscar e filtrar imóveis por diversos critérios
- Visualizar detalhes completos dos imóveis com galeria de fotos **e lightbox**
- **Contato direto via WhatsApp** (botão flutuante + página de detalhes)
- **Compartilhamento social** de imóveis
- Administração de imóveis (cadastro, edição, exclusão)
- Sistema de autenticação para corretores
- Formulário de contato para interessados
- **Design profissional** com ícones SVG e hierarquia visual clara
- **Totalmente responsivo** para mobile, tablet e desktop

## 🚀 Tecnologias

- **Frontend**: Vue.js 3 (Composition API com `<script setup>`)
- **Roteamento**: Vue Router 4
- **Backend**: Appwrite (BaaS - Backend as a Service)
- **Build**: Vite
- **Estilo**: CSS moderno com Flexbox e Grid

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Conta no Appwrite (Cloud ou self-hosted)

## ⚙️ Configuração do Backend (Appwrite)

### 1. Criar Projeto no Appwrite

1. Acesse [Appwrite Cloud](https://cloud.appwrite.io) ou sua instância self-hosted
2. Crie um novo projeto
3. Anote o Project ID

### 2. Configurar Database

Crie um database com as seguintes especificações:

**Database**:
- Nome: `ImobiliariaDB`
- ID: `imobiliariaDB`

**Collection: imoveis**:
- ID: `imoveis`

**Atributos da Collection**:

| Atributo | Tipo | Tamanho | Obrigatório | Array |
|----------|------|---------|-------------|-------|
| titulo | String | 255 | Sim | Não |
| descricao | String | 5000 | Não | Não |
| status | String | 50 | Sim | Não |
| tipo_anuncio | String | 50 | Sim | Não |
| tipo_imovel | String | 50 | Sim | Não |
| preco_venda | Float | - | Não | Não |
| preco_aluguel | Float | - | Não | Não |
| valor_condominio | Float | - | Não | Não |
| valor_iptu | Float | - | Não | Não |
| cidade | String | 100 | Sim | Não |
| bairro | String | 100 | Sim | Não |
| endereco | String | 255 | Não | Não |
| area_util_m2 | Integer | - | Não | Não |
| quartos | Integer | - | Sim | Não |
| banheiros | Integer | - | Sim | Não |
| vagas_garagem | Integer | - | Não | Não |
| fotos_storage_ids | String | 255 | Sim | Sim |
| id_corretor | String | 255 | Sim | Não |

**Índices Recomendados**:
- status (ASC)
- cidade (ASC)
- tipo_anuncio (ASC)
- tipo_imovel (ASC)
- $createdAt (DESC)

**Permissões da Collection**:
- Leitura: `role:all`
- Criação: `role:member`
- Atualização: `role:member`
- Exclusão: `role:member`

### 3. Configurar Storage

**Bucket: fotos_imoveis**:
- ID: `fotos_imoveis`
- Nome: `Fotos dos Imóveis`
- Tamanho máximo: 10MB (ou conforme necessário)
- Extensões permitidas: jpg, jpeg, png, webp

**Permissões do Bucket**:
- Leitura: `role:all`
- Criação: `role:member`
- Atualização: `role:member`
- Exclusão: `role:member`

### 4. Criar Usuário Admin

1. Vá para a seção "Auth" no Appwrite
2. Crie um novo usuário para acesso administrativo
3. Use esse usuário para fazer login na aplicação

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/zzruanxx/RealStateHouseFinder.git
cd RealStateHouseFinder
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais do Appwrite:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=seu_project_id_aqui
```

5. Configure as informações de contato em `src/config.js`:
```javascript
export const config = {
  contact: {
    phone: '5511999999999', // Seu número WhatsApp
    phoneFormatted: '(11) 99999-9999',
    email: 'contato@duarteimoveis.com.br',
    whatsappMessage: 'Olá! Gostaria de mais informações sobre imóveis.'
  },
  company: {
    name: 'Duarte Consultor Imobiliário',
    slogan: 'Encontre o imóvel dos seus sonhos'
  }
};
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

7. Acesse a aplicação em `http://localhost:5173`

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 📱 Estrutura do Projeto

```
src/
├── components/
│   ├── PaginaInicial.vue      # Página inicial com hero e destaques
│   ├── PaginaBusca.vue         # Página de busca com filtros avançados
│   ├── DetalheImovel.vue       # Página de detalhes do imóvel (lightbox + WhatsApp)
│   ├── AdminLogin.vue          # Login administrativo
│   ├── AdminDashboard.vue      # Painel de controle administrativo
│   ├── CadastrarImovel.vue     # Formulário de cadastro
│   ├── EditarImovel.vue        # Formulário de edição
│   └── NotificationToast.vue   # Componente de notificações
├── router/
│   └── index.js                # Configuração de rotas
├── appwrite.js                 # Configuração do Appwrite
├── config.js                   # Configurações do portal (contato, empresa)
├── App.vue                     # Componente principal (WhatsApp flutuante)
└── main.js                     # Entry point
```

## 🎯 Funcionalidades

### Para Visitantes:
- ✅ **Hero Section Profissional** com badge de confiança e estatísticas
- ✅ **Página inicial** com imóveis em destaque e design moderno
- ✅ **Busca de imóveis** com múltiplos filtros avançados
  - 🔍 Busca por texto (título, descrição, cidade, bairro)
  - 🏠 Filtros por tipo de imóvel e tipo de anúncio
  - 💰 Filtros por faixa de preço (mínimo e máximo)
  - 🛏️ Filtros por número de quartos e banheiros
  - 📊 Ordenação por preço ou data
- ✅ **Cards de imóveis aprimorados** com ícones SVG profissionais
- ✅ **Visualização detalhada** de imóveis
- ✅ **Galeria de fotos com lightbox** (navegação por setas e teclado)
- ✅ **WhatsApp integrado** (botão flutuante + página de detalhes)
- ✅ **Compartilhamento social** de imóveis
- ✅ **Formulário de contato**
- ✅ **Design responsivo e acessível** (mobile-first)
- ✅ **Footer completo** com informações de contato

### Para Corretores (Admin):
- ✅ Sistema de login seguro
- ✅ Painel administrativo (Dashboard)
  - 📋 Lista de todos os imóveis cadastrados
  - 👁️ Visualização rápida de detalhes
  - ✏️ Edição de imóveis
  - 🗑️ Exclusão de imóveis com confirmação
- ✅ Cadastro de novos imóveis
- ✅ Upload de múltiplas fotos
- ✅ Edição completa de imóveis existentes
  - ✨ Preview de fotos existentes
  - 🔄 Adição de novas fotos
  - ❌ Remoção de fotos específicas
- ✅ Gestão de permissões por usuário
- ✅ Redirecionamento automático após ações

## 🔐 Rotas

| Rota | Componente | Descrição | Auth |
|------|-----------|-----------|------|
| `/` | PaginaInicial | Página inicial | Não |
| `/busca` | PaginaBusca | Busca de imóveis | Não |
| `/imovel/:id` | DetalheImovel | Detalhes do imóvel | Não |
| `/admin/login` | AdminLogin | Login administrativo | Não |
| `/admin/dashboard` | AdminDashboard | Painel de controle admin | Sim |
| `/admin/cadastrar` | CadastrarImovel | Cadastro de imóveis | Sim |
| `/admin/editar/:id` | EditarImovel | Edição de imóveis | Sim |

## 🎨 Personalização

### Informações de Contato

Configure suas informações em `src/config.js`:
- Número do WhatsApp
- E-mail de contato
- Nome da empresa
- Slogan

### Cores

As cores principais podem ser alteradas no arquivo `src/App.vue`:
- Primary: `#3498db` (azul)
- Success: `#27ae60` (verde)
- WhatsApp: `#25D366` (verde WhatsApp)
- Background: `#f5f5f5` (cinza claro)
- Dark: `#2c3e50` (cinza escuro)

### Logo

Substitua o texto no header por uma imagem/logo se desejar.

## 🆕 Melhorias Implementadas (Recentes)

### 🎉 Atualização 2.1 - Padrões de Mercado
Veja [PORTAL_IMPROVEMENTS.md](PORTAL_IMPROVEMENTS.md) para documentação completa.

#### Destaques:
- **WhatsApp Integrado**: Botão flutuante global + botão na página de detalhes
- **Lightbox de Fotos**: Galeria full-screen com navegação por teclado
- **Compartilhamento Social**: Web Share API com fallback
- **Hero Modernizado**: Badge de confiança, estatísticas visuais
- **Ícones SVG Profissionais**: Substituindo emojis em todos os cards
- **Design Responsivo Aprimorado**: Mobile-first em todos os componentes
- **Configuração Centralizada**: src/config.js para contatos e empresa

### Administração Completa
- **Dashboard Administrativo**: Painel completo para gerenciar todos os imóveis cadastrados
- **Edição de Imóveis**: Interface intuitiva para editar propriedades existentes
- **Exclusão Segura**: Modal de confirmação antes de excluir imóveis
- **Gestão de Fotos**: Adicionar/remover fotos de imóveis existentes

### Busca Avançada
- **Busca por Texto**: Pesquise em títulos, descrições e localizações
- **Filtros Expandidos**: Quartos, banheiros, faixas de preço (mín/máx)
- **Ordenação**: Ordene por preço crescente/decrescente ou mais recentes
- **Interface Melhorada**: Filtros organizados e fáceis de usar

### UX e Performance
- **Lazy Loading**: Carregamento otimizado de imagens
- **Atributos Alt**: Melhor acessibilidade em todas as imagens
- **Meta Tags SEO**: Tags otimizadas para mecanismos de busca
- **Mensagens Claras**: Feedback visual para todas as ações
- **Navegação Intuitiva**: Redirecionamentos automáticos após ações

### Novos Campos
- **Endereço Completo**: Campo adicional para endereço detalhado
- **Status do Imóvel**: Controle de disponibilidade (disponível/vendido/alugado)

## 📝 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Real State House Finder

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

