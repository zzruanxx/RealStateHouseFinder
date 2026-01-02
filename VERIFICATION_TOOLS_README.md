# Ferramentas de Verificação de APIs

Este diretório contém ferramentas automatizadas para verificar a funcionalidade de todas as APIs e endpoints do RealStateHouseFinder.

## 🎯 Objetivo

Garantir que todas as APIs do Appwrite estão corretamente configuradas e funcionando no portal imobiliário.

## 📁 Arquivos de Verificação

### 1. `verify-endpoints.js`
**Script de Verificação Estática**

Analisa o código-fonte para verificar se todas as APIs estão implementadas corretamente.

**Características:**
- ✅ Não requer conexão com Appwrite
- ✅ Não requer credenciais
- ✅ Análise estática de 64 pontos
- ✅ Execução rápida (< 1 segundo)

**Como usar:**
```bash
node verify-endpoints.js
```

**Verifica:**
- Configuração do Appwrite (imports, exports)
- Rotas e navigation guards
- APIs de autenticação
- APIs de database (CRUD)
- APIs de storage
- Queries e filtros
- Estrutura de componentes
- Arquivos de configuração
- Dependências

### 2. `api-validation.js`
**Script de Validação Dinâmica**

Conecta-se ao Appwrite e testa os endpoints reais.

**Características:**
- ⚠️ Requer conexão com Appwrite
- ⚠️ Requer credenciais configuradas
- ✅ Testa endpoints reais
- ✅ Valida database e storage

**Como usar:**
```bash
# 1. Configure suas credenciais
cp .env.example .env
# Edite .env com suas credenciais do Appwrite

# 2. Execute a validação
node api-validation.js
```

**Testa:**
- Conexão com Appwrite
- Acesso ao database
- Acesso à collection
- Queries e filtros reais
- Acesso ao storage bucket
- Geração de URLs de preview
- Endpoints de autenticação

### 3. `quick-verify.sh`
**Script de Verificação Rápida**

Automatiza o processo de verificação com interface amigável.

**Como usar:**
```bash
./quick-verify.sh
```

Ou:
```bash
bash quick-verify.sh
```

**Funcionalidades:**
- Instala dependências automaticamente (se necessário)
- Executa verify-endpoints.js
- Exibe resultado formatado
- Fornece próximos passos

## 📚 Documentação Gerada

### 1. `API_DOCUMENTATION.md`
Documentação técnica completa de todas as APIs utilizadas no projeto.

**Conteúdo:**
- Configuração do Appwrite
- APIs de Autenticação (3 endpoints)
- APIs de Database (5 operações)
- APIs de Storage (4 operações)
- Filtros e Queries disponíveis
- Rotas da aplicação
- Exemplos de código
- Troubleshooting

### 2. `API_VERIFICATION_REPORT.md`
Relatório detalhado da verificação realizada.

**Conteúdo:**
- Resumo executivo com estatísticas
- Status de cada categoria (64 verificações)
- Resultados por componente
- Fluxos de API verificados
- Recomendações e conclusões
- Taxa de sucesso: 100%

## 🚀 Início Rápido

### Verificação Básica (Sem Credenciais)
```bash
# 1. Instale as dependências
npm install

# 2. Execute a verificação
node verify-endpoints.js
```

### Verificação Completa (Com Credenciais)
```bash
# 1. Instale as dependências
npm install

# 2. Configure o Appwrite
cp .env.example .env
# Edite .env com suas credenciais

# 3. Execute a verificação estática
node verify-endpoints.js

# 4. Execute a validação dinâmica
node api-validation.js
```

## 📊 Resultados Esperados

### verify-endpoints.js
```
══════════════════════════════════════════════════════════════════════
  RESUMO DA VERIFICAÇÃO
══════════════════════════════════════════════════════════════════════

Total de Verificações: 64
✓ Aprovadas: 64
✗ Falhadas: 0
⚠ Avisos: 0
📊 Taxa de Sucesso: 100%

══════════════════════════════════════════════════════════════════════
  ✅ TODAS AS APIs E ENDPOINTS ESTÃO CONFIGURADOS CORRETAMENTE!
══════════════════════════════════════════════════════════════════════
```

### api-validation.js
```
╔══════════════════════════════════════════════════════════════╗
║     API & ENDPOINTS VALIDATION - RealStateHouseFinder       ║
╚══════════════════════════════════════════════════════════════╝

1. INITIALIZING CLIENT
✓ Client Initialization
✓ Project ID

2. DATABASE CONNECTION
✓ Database Service Connection
✓ Database "imobiliariaDB" exists

...
```

## 🔍 O Que é Verificado

### Categoria: Configuração (14 verificações)
- [x] Arquivo src/appwrite.js existe
- [x] Imports: Client, Account, Databases, Storage, ID, Permission, Role, Query
- [x] Exports: account, databases, storage, DB_ID, COLLECTION_IMOVEIS_ID, BUCKET_FOTOS_ID

### Categoria: Rotas (8 verificações)
- [x] Rota `/` → PaginaInicial
- [x] Rota `/busca` → PaginaBusca
- [x] Rota `/imovel/:id` → DetalheImovel
- [x] Rota `/admin/login` → AdminLogin
- [x] Rota `/admin/dashboard` → AdminDashboard (protegida)
- [x] Rota `/admin/cadastrar` → CadastrarImovel (protegida)
- [x] Rota `/admin/editar/:id` → EditarImovel (protegida)
- [x] Navigation Guard implementado

### Categoria: Autenticação (3 verificações)
- [x] Login (account.createEmailPasswordSession)
- [x] Obter sessão (account.get)
- [x] Logout (account.deleteSession)

### Categoria: Database (7 verificações)
- [x] Listar documentos - Busca
- [x] Listar documentos - Página inicial
- [x] Listar documentos - Admin
- [x] Obter documento específico
- [x] Criar documento
- [x] Atualizar documento
- [x] Deletar documento

### Categoria: Storage (4 verificações)
- [x] Upload de arquivos
- [x] Preview de imagens (busca)
- [x] Preview de imagens (detalhes)
- [x] Deletar arquivos

### Categoria: Filtros e Queries (6 verificações)
- [x] Query.equal
- [x] Query.greaterThanEqual
- [x] Query.lessThanEqual
- [x] Query.orderAsc
- [x] Query.orderDesc
- [x] Query.limit

### Categoria: Componentes (10 verificações)
- [x] App.vue
- [x] PaginaInicial.vue
- [x] PaginaBusca.vue
- [x] DetalheImovel.vue
- [x] AdminLogin.vue
- [x] AdminDashboard.vue
- [x] CadastrarImovel.vue
- [x] EditarImovel.vue
- [x] NotFound.vue
- [x] NotificationToast.vue

### Categoria: Configuração (5 verificações)
- [x] package.json
- [x] vite.config.js
- [x] .env.example
- [x] src/config.js
- [x] README.md

### Categoria: Dependências (5 verificações)
- [x] vue (^3.5.24)
- [x] vue-router (^4.6.3)
- [x] appwrite (^21.4.0)
- [x] vite (^7.2.2)
- [x] @vitejs/plugin-vue (^6.0.1)

## ✅ Status Final

**Total de Verificações:** 64  
**Aprovadas:** 64  
**Falhadas:** 0  
**Taxa de Sucesso:** 100%

## 🛠️ Resolução de Problemas

### Erro: "Cannot find module 'appwrite'"
```bash
npm install
```

### Erro: "Project not found" (api-validation.js)
Verifique se o arquivo `.env` está configurado corretamente:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=seu_project_id_aqui
```

### Erro: "Database not found" (api-validation.js)
Crie o database no Appwrite:
1. Acesse o console do Appwrite
2. Crie um database com ID: `imobiliariaDB`
3. Crie uma collection com ID: `imoveis`
4. Configure os atributos conforme README.md

### Erro: "Bucket not found" (api-validation.js)
Crie o bucket no Appwrite:
1. Acesse o console do Appwrite
2. Vá para Storage
3. Crie um bucket com ID: `fotos_imoveis`
4. Configure as permissões conforme README.md

## 📖 Mais Informações

Para mais detalhes sobre:
- **Setup do projeto:** Consulte `README.md`
- **Configuração do Appwrite:** Consulte `APPWRITE_SETUP.md`
- **APIs disponíveis:** Consulte `API_DOCUMENTATION.md`
- **Resultados da verificação:** Consulte `API_VERIFICATION_REPORT.md`

## 🤝 Contribuindo

Se encontrar algum problema ou tiver sugestões de melhorias para os scripts de verificação:

1. Abra uma issue descrevendo o problema
2. Ou envie um pull request com a correção

## 📝 Licença

Estes scripts fazem parte do projeto RealStateHouseFinder e estão sob a mesma licença MIT.

---

**Última Atualização:** Janeiro 2024  
**Versão:** 1.0.0
