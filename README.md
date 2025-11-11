# RealStateHouseFinder

Portal imobiliário completo desenvolvido com Vue.js 3 e Appwrite BaaS.

## 🏠 Sobre o Projeto

Este é um sistema completo de portal imobiliário que permite:
- Buscar e filtrar imóveis por diversos critérios
- Visualizar detalhes completos dos imóveis com galeria de fotos
- Administração de imóveis (cadastro, edição, exclusão)
- Sistema de autenticação para corretores
- Formulário de contato para interessados

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

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse a aplicação em `http://localhost:5173`

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
│   ├── PaginaBusca.vue         # Página de busca com filtros
│   ├── DetalheImovel.vue       # Página de detalhes do imóvel
│   ├── AdminLogin.vue          # Login administrativo
│   └── CadastrarImovel.vue     # Formulário de cadastro
├── router/
│   └── index.js                # Configuração de rotas
├── appwrite.js                 # Configuração do Appwrite
├── App.vue                     # Componente principal
└── main.js                     # Entry point
```

## 🎯 Funcionalidades

### Para Visitantes:
- ✅ Página inicial com imóveis em destaque
- ✅ Busca de imóveis com múltiplos filtros
- ✅ Visualização detalhada de imóveis
- ✅ Galeria de fotos dos imóveis
- ✅ Formulário de contato

### Para Corretores (Admin):
- ✅ Sistema de login
- ✅ Cadastro de novos imóveis
- ✅ Upload de múltiplas fotos
- ✅ Gestão de permissões

## 🔐 Rotas

| Rota | Componente | Descrição | Auth |
|------|-----------|-----------|------|
| `/` | PaginaInicial | Página inicial | Não |
| `/busca` | PaginaBusca | Busca de imóveis | Não |
| `/imovel/:id` | DetalheImovel | Detalhes do imóvel | Não |
| `/admin/login` | AdminLogin | Login administrativo | Não |
| `/admin/cadastrar` | CadastrarImovel | Cadastro de imóveis | Sim |

## 🎨 Personalização

### Cores

As cores principais podem ser alteradas no arquivo `src/App.vue`:
- Primary: `#3498db` (azul)
- Success: `#27ae60` (verde)
- Background: `#f5f5f5` (cinza claro)
- Dark: `#2c3e50` (cinza escuro)

### Logo

Substitua o texto no header por uma imagem/logo se desejar.

## 📝 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Real State House Finder

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

