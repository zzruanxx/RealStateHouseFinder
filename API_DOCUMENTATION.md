# API & Endpoints Documentation
## RealStateHouseFinder - Portal Imobiliário

Este documento detalha todas as APIs e endpoints utilizados no portal imobiliário, incluindo sua funcionalidade, localização no código e exemplos de uso.

---

## 📋 Índice

1. [Configuração do Appwrite](#configuração-do-appwrite)
2. [APIs de Autenticação](#apis-de-autenticação)
3. [APIs de Database](#apis-de-database)
4. [APIs de Storage](#apis-de-storage)
5. [Rotas da Aplicação](#rotas-da-aplicação)
6. [Resumo de Endpoints](#resumo-de-endpoints)

---

## 🔧 Configuração do Appwrite

### Arquivo: `src/appwrite.js`

**Constantes de Configuração:**
```javascript
APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1'
APPWRITE_PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID
DB_ID = 'imobiliariaDB'
COLLECTION_IMOVEIS_ID = 'imoveis'
BUCKET_FOTOS_ID = 'fotos_imoveis'
```

**Serviços Inicializados:**
- `account` - Account service (autenticação)
- `databases` - Database service (operações CRUD)
- `storage` - Storage service (upload/download de arquivos)

---

## 🔐 APIs de Autenticação

### 1. Login de Usuário
**Endpoint:** `account.createEmailPasswordSession(email, password)`

**Arquivo:** `src/components/AdminLogin.vue`

**Método:** POST

**Descrição:** Cria uma sessão de autenticação para um usuário administrador.

**Parâmetros:**
- `email` (string): Email do usuário
- `password` (string): Senha do usuário

**Exemplo de Uso:**
```javascript
await account.createEmailPasswordSession(email.value, password.value);
```

**Resposta de Sucesso:**
- Cria uma sessão autenticada
- Redireciona para `/admin/dashboard`

**Tratamento de Erro:**
- Exibe mensagem de erro em caso de credenciais inválidas

---

### 2. Obter Sessão Atual
**Endpoint:** `account.get()`

**Arquivos:** 
- `src/router/index.js` (Navigation Guard)
- `src/App.vue` (Verificação de estado)
- `src/components/CadastrarImovel.vue` (Obter ID do corretor)
- `src/components/EditarImovel.vue` (Obter ID do corretor)

**Método:** GET

**Descrição:** Retorna informações sobre o usuário autenticado atualmente.

**Exemplo de Uso:**
```javascript
const user = await account.get();
const corretorId = user.$id;
```

**Resposta de Sucesso:**
```javascript
{
  $id: "user_id_string",
  email: "user@example.com",
  name: "User Name",
  // ... outros campos
}
```

**Uso no Navigation Guard:**
```javascript
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      await account.get();
      next(); // Usuário autenticado
    } catch (error) {
      next('/admin/login'); // Redireciona para login
    }
  }
});
```

---

### 3. Logout de Usuário
**Endpoint:** `account.deleteSession('current')`

**Arquivo:** `src/App.vue`

**Método:** DELETE

**Descrição:** Encerra a sessão atual do usuário.

**Exemplo de Uso:**
```javascript
await account.deleteSession('current');
router.push('/');
```

---

## 💾 APIs de Database

### 1. Listar Documentos (Imóveis)
**Endpoint:** `databases.listDocuments(databaseId, collectionId, queries)`

**Arquivos:**
- `src/components/PaginaBusca.vue` (Busca com filtros)
- `src/components/PaginaInicial.vue` (Imóveis em destaque)
- `src/components/AdminDashboard.vue` (Lista todos os imóveis)

**Método:** GET

**Descrição:** Lista documentos da coleção de imóveis com opções de filtragem e ordenação.

**Parâmetros:**
- `databaseId` (string): ID do database (`imobiliariaDB`)
- `collectionId` (string): ID da coleção (`imoveis`)
- `queries` (array): Array de queries para filtrar/ordenar

**Exemplo de Uso Básico:**
```javascript
const response = await databases.listDocuments(
  DB_ID,
  COLLECTION_IMOVEIS_ID,
  [Query.limit(10)]
);
```

**Exemplo com Filtros (PaginaBusca.vue):**
```javascript
const queries = [
  Query.equal('status', 'disponivel'),
  Query.equal('tipo_anuncio', 'venda'),
  Query.equal('cidade', 'São Paulo'),
  Query.greaterThanEqual('quartos', 2),
  Query.greaterThanEqual('preco_venda', 100000),
  Query.lessThanEqual('preco_venda', 500000),
  Query.orderDesc('$createdAt'),
  Query.limit(50)
];

const response = await databases.listDocuments(DB_ID, COLLECTION_IMOVEIS_ID, queries);
```

**Tipos de Query Suportadas:**
- `Query.equal(attribute, value)` - Igualdade
- `Query.greaterThan(attribute, value)` - Maior que
- `Query.greaterThanEqual(attribute, value)` - Maior ou igual
- `Query.lessThan(attribute, value)` - Menor que
- `Query.lessThanEqual(attribute, value)` - Menor ou igual
- `Query.orderAsc(attribute)` - Ordenar crescente
- `Query.orderDesc(attribute)` - Ordenar decrescente
- `Query.limit(number)` - Limitar resultados

**Resposta:**
```javascript
{
  total: 25,
  documents: [
    {
      $id: "document_id",
      titulo: "Apartamento 3 Quartos",
      tipo_anuncio: "venda",
      tipo_imovel: "apartamento",
      preco_venda: 350000,
      cidade: "São Paulo",
      bairro: "Vila Mariana",
      quartos: 3,
      banheiros: 2,
      fotos_storage_ids: ["file1", "file2"],
      // ... outros campos
    }
  ]
}
```

---

### 2. Obter Documento Específico
**Endpoint:** `databases.getDocument(databaseId, collectionId, documentId)`

**Arquivo:** `src/components/DetalheImovel.vue`, `src/components/EditarImovel.vue`

**Método:** GET

**Descrição:** Obtém os detalhes completos de um imóvel específico.

**Parâmetros:**
- `databaseId` (string): ID do database
- `collectionId` (string): ID da coleção
- `documentId` (string): ID do documento (imóvel)

**Exemplo de Uso:**
```javascript
const imovel = await databases.getDocument(
  DB_ID,
  COLLECTION_IMOVEIS_ID,
  imovelId
);
```

**Resposta:**
```javascript
{
  $id: "document_id",
  titulo: "Casa 4 Quartos com Piscina",
  descricao: "Linda casa em condomínio fechado...",
  tipo_anuncio: "venda",
  tipo_imovel: "casa",
  preco_venda: 800000,
  cidade: "São Paulo",
  bairro: "Morumbi",
  endereco: "Rua das Flores, 123",
  quartos: 4,
  banheiros: 3,
  vagas_garagem: 2,
  area_util_m2: 250,
  fotos_storage_ids: ["file1", "file2", "file3"],
  status: "disponivel",
  id_corretor: "corretor_id",
  $createdAt: "2024-01-01T00:00:00.000Z"
}
```

---

### 3. Criar Documento (Novo Imóvel)
**Endpoint:** `databases.createDocument(databaseId, collectionId, documentId, data, permissions)`

**Arquivo:** `src/components/CadastrarImovel.vue`

**Método:** POST

**Descrição:** Cria um novo imóvel no banco de dados.

**Parâmetros:**
- `databaseId` (string): ID do database
- `collectionId` (string): ID da coleção
- `documentId` (string): ID único (usar `ID.unique()`)
- `data` (object): Dados do imóvel
- `permissions` (array): Permissões de acesso

**Exemplo de Uso:**
```javascript
const corretorId = (await account.get()).$id;

const imovel = await databases.createDocument(
  DB_ID,
  COLLECTION_IMOVEIS_ID,
  ID.unique(),
  {
    titulo: formData.titulo,
    descricao: formData.descricao,
    tipo_anuncio: formData.tipo_anuncio,
    tipo_imovel: formData.tipo_imovel,
    preco_venda: parseFloat(formData.preco_venda) || null,
    preco_aluguel: parseFloat(formData.preco_aluguel) || null,
    valor_condominio: parseFloat(formData.valor_condominio) || null,
    valor_iptu: parseFloat(formData.valor_iptu) || null,
    cidade: formData.cidade,
    bairro: formData.bairro,
    endereco: formData.endereco || null,
    area_util_m2: parseInt(formData.area_util_m2) || null,
    quartos: parseInt(formData.quartos),
    banheiros: parseInt(formData.banheiros),
    vagas_garagem: parseInt(formData.vagas_garagem) || 0,
    fotos_storage_ids: fotosStorageIds,
    id_corretor: corretorId,
    status: 'disponivel'
  },
  [
    Permission.read(Role.any()),
    Permission.update(Role.user(corretorId)),
    Permission.delete(Role.user(corretorId))
  ]
);
```

**Campos Obrigatórios:**
- `titulo` (String, max 255)
- `tipo_anuncio` (String: 'venda' ou 'aluguel')
- `tipo_imovel` (String: 'apartamento', 'casa', 'terreno', etc.)
- `cidade` (String)
- `bairro` (String)
- `quartos` (Integer)
- `banheiros` (Integer)
- `fotos_storage_ids` (Array de Strings)
- `id_corretor` (String)
- `status` (String: 'disponivel', 'vendido', 'alugado')

---

### 4. Atualizar Documento (Editar Imóvel)
**Endpoint:** `databases.updateDocument(databaseId, collectionId, documentId, data, permissions)`

**Arquivo:** `src/components/EditarImovel.vue`

**Método:** PATCH

**Descrição:** Atualiza os dados de um imóvel existente.

**Parâmetros:**
- `databaseId` (string): ID do database
- `collectionId` (string): ID da coleção
- `documentId` (string): ID do documento a atualizar
- `data` (object): Novos dados (somente campos alterados)
- `permissions` (array, opcional): Novas permissões

**Exemplo de Uso:**
```javascript
await databases.updateDocument(
  DB_ID,
  COLLECTION_IMOVEIS_ID,
  imovelId,
  {
    titulo: formData.titulo,
    preco_venda: parseFloat(formData.preco_venda),
    status: formData.status,
    fotos_storage_ids: fotosAtualizadas
  }
);
```

---

### 5. Deletar Documento (Excluir Imóvel)
**Endpoint:** `databases.deleteDocument(databaseId, collectionId, documentId)`

**Arquivo:** `src/components/AdminDashboard.vue`

**Método:** DELETE

**Descrição:** Remove um imóvel do banco de dados.

**Parâmetros:**
- `databaseId` (string): ID do database
- `collectionId` (string): ID da coleção
- `documentId` (string): ID do documento a deletar

**Exemplo de Uso:**
```javascript
await databases.deleteDocument(
  DB_ID,
  COLLECTION_IMOVEIS_ID,
  imovelId
);
```

**Nota:** Também deleta as fotos associadas do storage.

---

## 📦 APIs de Storage

### 1. Upload de Arquivo (Foto do Imóvel)
**Endpoint:** `storage.createFile(bucketId, fileId, file, permissions)`

**Arquivos:**
- `src/components/CadastrarImovel.vue`
- `src/components/EditarImovel.vue`

**Método:** POST

**Descrição:** Faz upload de uma foto do imóvel para o storage.

**Parâmetros:**
- `bucketId` (string): ID do bucket (`fotos_imoveis`)
- `fileId` (string): ID único para o arquivo (usar `ID.unique()`)
- `file` (File): Objeto File do navegador
- `permissions` (array): Permissões de acesso

**Exemplo de Uso:**
```javascript
const corretorId = (await account.get()).$id;

const uploadPromises = Array.from(fotosFiles).map(foto => 
  storage.createFile(
    BUCKET_FOTOS_ID,
    ID.unique(),
    foto,
    [
      Permission.read(Role.any()),
      Permission.update(Role.user(corretorId)),
      Permission.delete(Role.user(corretorId))
    ]
  )
);

const uploadedFiles = await Promise.all(uploadPromises);
const fotosStorageIds = uploadedFiles.map(file => file.$id);
```

**Resposta:**
```javascript
{
  $id: "file_id",
  bucketId: "fotos_imoveis",
  name: "image.jpg",
  signature: "signature_hash",
  mimeType: "image/jpeg",
  sizeOriginal: 245678,
  $createdAt: "2024-01-01T00:00:00.000Z"
}
```

---

### 2. Obter Preview de Arquivo
**Endpoint:** `storage.getFilePreview(bucketId, fileId, width, height, gravity, quality)`

**Arquivos:**
- `src/components/PaginaBusca.vue`
- `src/components/PaginaInicial.vue`
- `src/components/DetalheImovel.vue`
- `src/components/AdminDashboard.vue`

**Método:** GET

**Descrição:** Gera uma URL para preview otimizado da imagem.

**Parâmetros:**
- `bucketId` (string): ID do bucket
- `fileId` (string): ID do arquivo
- `width` (number, opcional): Largura desejada
- `height` (number, opcional): Altura desejada
- `gravity` (string, opcional): Ponto de foco ('center', 'top', 'bottom')
- `quality` (number, opcional): Qualidade (0-100)

**Exemplo de Uso:**
```javascript
// Preview para lista (400x300)
const previewUrl = storage.getFilePreview(
  BUCKET_FOTOS_ID,
  fileId,
  400,
  300,
  'center',
  100
).href;

// Preview para galeria (800x600)
const galleryUrl = storage.getFilePreview(
  BUCKET_FOTOS_ID,
  fileId,
  800,
  600,
  'center',
  90
).href;
```

**Resposta:**
```javascript
URL {
  href: "https://cloud.appwrite.io/v1/storage/buckets/fotos_imoveis/files/file_id/preview?width=400&height=300",
  origin: "https://cloud.appwrite.io",
  // ... outras propriedades URL
}
```

---

### 3. Obter URL de Download do Arquivo
**Endpoint:** `storage.getFileDownload(bucketId, fileId)`

**Arquivo:** `src/components/DetalheImovel.vue`

**Método:** GET

**Descrição:** Gera uma URL para download do arquivo original.

**Exemplo de Uso:**
```javascript
const downloadUrl = storage.getFileDownload(BUCKET_FOTOS_ID, fileId).href;
```

---

### 4. Deletar Arquivo
**Endpoint:** `storage.deleteFile(bucketId, fileId)`

**Arquivos:**
- `src/components/AdminDashboard.vue` (ao deletar imóvel)
- `src/components/EditarImovel.vue` (ao remover foto)

**Método:** DELETE

**Descrição:** Remove um arquivo do storage.

**Parâmetros:**
- `bucketId` (string): ID do bucket
- `fileId` (string): ID do arquivo a deletar

**Exemplo de Uso:**
```javascript
// Deletar uma foto específica
await storage.deleteFile(BUCKET_FOTOS_ID, fileId);

// Deletar múltiplas fotos
const deletePromises = fotosIds.map(id => 
  storage.deleteFile(BUCKET_FOTOS_ID, id)
);
await Promise.all(deletePromises);
```

---

## 🛣️ Rotas da Aplicação

### Arquivo: `src/router/index.js`

| Rota | Nome | Componente | Auth | Descrição |
|------|------|------------|------|-----------|
| `/` | Home | PaginaInicial | ❌ | Página inicial com destaques |
| `/busca` | Busca | PaginaBusca | ❌ | Busca com filtros avançados |
| `/imovel/:id` | DetalheImovel | DetalheImovel | ❌ | Detalhes do imóvel |
| `/admin/login` | AdminLogin | AdminLogin | ❌ | Login administrativo |
| `/admin/dashboard` | AdminDashboard | AdminDashboard | ✅ | Painel de controle admin |
| `/admin/cadastrar` | CadastrarImovel | CadastrarImovel | ✅ | Cadastro de novo imóvel |
| `/admin/editar/:id` | EditarImovel | EditarImovel | ✅ | Edição de imóvel existente |
| `/:pathMatch(.*)*` | NotFound | NotFound | ❌ | Página 404 |

**Navigation Guard:**
```javascript
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      await account.get();
      next(); // Autenticado
    } catch (error) {
      next('/admin/login'); // Não autenticado
    }
  } else {
    next();
  }
});
```

---

## 📊 Resumo de Endpoints

### Autenticação (Account)
| Método | Endpoint | Descrição | Arquivo |
|--------|----------|-----------|---------|
| POST | `account.createEmailPasswordSession()` | Login | AdminLogin.vue |
| GET | `account.get()` | Obter sessão atual | router/index.js, App.vue, CadastrarImovel.vue |
| DELETE | `account.deleteSession()` | Logout | App.vue |

### Database (Databases)
| Método | Endpoint | Descrição | Arquivo |
|--------|----------|-----------|---------|
| GET | `databases.listDocuments()` | Listar imóveis | PaginaBusca.vue, PaginaInicial.vue, AdminDashboard.vue |
| GET | `databases.getDocument()` | Obter imóvel específico | DetalheImovel.vue, EditarImovel.vue |
| POST | `databases.createDocument()` | Criar novo imóvel | CadastrarImovel.vue |
| PATCH | `databases.updateDocument()` | Atualizar imóvel | EditarImovel.vue |
| DELETE | `databases.deleteDocument()` | Deletar imóvel | AdminDashboard.vue |

### Storage (Storage)
| Método | Endpoint | Descrição | Arquivo |
|--------|----------|-----------|---------|
| POST | `storage.createFile()` | Upload de foto | CadastrarImovel.vue, EditarImovel.vue |
| GET | `storage.getFilePreview()` | URL de preview | Todos os componentes de listagem |
| GET | `storage.getFileDownload()` | URL de download | DetalheImovel.vue |
| DELETE | `storage.deleteFile()` | Deletar foto | AdminDashboard.vue, EditarImovel.vue |

---

## 🔍 Filtros e Queries Disponíveis

### Filtros Implementados (PaginaBusca.vue)

1. **Busca por Texto**
   - Campo: `texto_busca`
   - Busca em: título, descrição, cidade, bairro
   - Implementação: Filtro client-side após receber resultados

2. **Tipo de Anúncio**
   - Campo: `tipo_anuncio`
   - Valores: 'venda', 'aluguel'
   - Query: `Query.equal('tipo_anuncio', valor)`

3. **Tipo de Imóvel**
   - Campo: `tipo_imovel`
   - Valores: 'apartamento', 'casa', 'terreno', 'comercial', 'rural'
   - Query: `Query.equal('tipo_imovel', valor)`

4. **Cidade**
   - Campo: `cidade`
   - Query: `Query.equal('cidade', valor)`

5. **Quartos Mínimos**
   - Campo: `quartos_min`
   - Query: `Query.greaterThanEqual('quartos', valor)`

6. **Banheiros Mínimos**
   - Campo: `banheiros_min`
   - Query: `Query.greaterThanEqual('banheiros', valor)`

7. **Preço Mínimo**
   - Campo: `preco_min`
   - Query: `Query.greaterThanEqual('preco_venda|preco_aluguel', valor)`

8. **Preço Máximo**
   - Campo: `preco_max`
   - Query: `Query.lessThanEqual('preco_venda|preco_aluguel', valor)`

9. **Ordenação**
   - Opções:
     - `recentes`: `Query.orderDesc('$createdAt')`
     - `preco_asc`: `Query.orderAsc('preco_venda|preco_aluguel')`
     - `preco_desc`: `Query.orderDesc('preco_venda|preco_aluguel')`

---

## 🔐 Permissões

### Estrutura de Permissões Implementada

**Leitura Pública:**
```javascript
Permission.read(Role.any())
```
- Qualquer usuário (autenticado ou não) pode visualizar imóveis e fotos

**Criação, Atualização e Exclusão:**
```javascript
Permission.update(Role.user(corretorId))
Permission.delete(Role.user(corretorId))
```
- Apenas o corretor que criou o imóvel pode editar ou excluir

---

## ✅ Checklist de Funcionalidade

### Autenticação
- [x] Login de administrador
- [x] Verificação de sessão
- [x] Logout
- [x] Guard de navegação para rotas protegidas

### Gestão de Imóveis
- [x] Listar todos os imóveis
- [x] Buscar imóveis com filtros
- [x] Visualizar detalhes de um imóvel
- [x] Cadastrar novo imóvel
- [x] Editar imóvel existente
- [x] Excluir imóvel

### Gestão de Fotos
- [x] Upload de múltiplas fotos
- [x] Gerar preview de fotos
- [x] Visualizar fotos em galeria
- [x] Adicionar fotos a imóvel existente
- [x] Remover fotos de imóvel
- [x] Excluir fotos ao deletar imóvel

### Filtros e Busca
- [x] Filtro por tipo de anúncio
- [x] Filtro por tipo de imóvel
- [x] Filtro por cidade
- [x] Filtro por número de quartos
- [x] Filtro por número de banheiros
- [x] Filtro por faixa de preço
- [x] Ordenação por preço
- [x] Ordenação por data
- [x] Busca por texto livre

---

## 🧪 Como Testar

### Pré-requisitos
1. Configurar arquivo `.env` com credenciais do Appwrite
2. Criar database, collection e bucket no Appwrite
3. Criar usuário administrador no Appwrite

### Script de Validação
Execute o script de validação incluído:

```bash
npm install
node api-validation.js
```

Este script verifica:
- ✅ Conexão com o Appwrite
- ✅ Acesso ao database e collection
- ✅ Acesso ao storage bucket
- ✅ Queries e filtros
- ✅ Integração das APIs nos componentes
- ✅ Configuração de rotas

---

## 📝 Notas Técnicas

### Limitações do Appwrite
- Queries múltiplas são aplicadas com AND (não há OR nativo)
- Busca full-text não é nativa (implementada client-side)
- Limite de 100 resultados por query (usar paginação para mais)

### Otimizações Implementadas
- Upload de fotos em paralelo com `Promise.all()`
- Preview de imagens com dimensões otimizadas
- Lazy loading de imagens (atributo `loading="lazy"`)
- Cache de sessão de autenticação

### Segurança
- Autenticação obrigatória para operações administrativas
- Permissões granulares por documento
- Validação de inputs no frontend
- Sanitização de dados antes de salvar

---

## 🆘 Troubleshooting

### Erro: "Project not found"
- Verifique se `VITE_APPWRITE_PROJECT_ID` está correto no `.env`

### Erro: "Database not found"
- Crie o database `imobiliariaDB` no Appwrite

### Erro: "Collection not found"
- Crie a collection `imoveis` com os atributos especificados

### Erro: "Bucket not found"
- Crie o bucket `fotos_imoveis` no Appwrite

### Erro: "Unauthorized"
- Verifique se o usuário está autenticado
- Verifique as permissões da collection/bucket

---

## 📞 Suporte

Para mais informações sobre a API do Appwrite:
- [Documentação Oficial do Appwrite](https://appwrite.io/docs)
- [API Reference](https://appwrite.io/docs/references)
- [Appwrite Discord](https://appwrite.io/discord)

---

**Última Atualização:** Janeiro 2024
**Versão da API Appwrite:** 1.4.0
**Versão do SDK:** 21.4.0
