# Configuração do Backend Appwrite

Este documento fornece instruções detalhadas para configurar o backend Appwrite para o portal imobiliário.

## Passo 1: Criar Projeto

1. Acesse https://cloud.appwrite.io (ou sua instância self-hosted)
2. Faça login ou crie uma conta
3. Clique em "Create Project"
4. Nome do projeto: "Duarte Imobiliario"
5. Copie o **Project ID** gerado

## Passo 2: Configurar Database

### Criar Database

1. No menu lateral, clique em "Databases"
2. Clique em "Create Database"
3. Database ID: `imobiliariaDB`
4. Name: `ImobiliariaDB`

### Criar Collection

1. Dentro do database criado, clique em "Create Collection"
2. Collection ID: `imoveis`
3. Name: `Imóveis`

### Adicionar Atributos

Clique em "Attributes" e adicione os seguintes atributos:

#### String Attributes

| Key | Size | Required | Default | Array |
|-----|------|----------|---------|-------|
| titulo | 255 | ✓ | - | ✗ |
| descricao | 5000 | ✗ | - | ✗ |
| status | 50 | ✓ | disponivel | ✗ |
| tipo_anuncio | 50 | ✓ | - | ✗ |
| tipo_imovel | 50 | ✓ | - | ✗ |
| cidade | 100 | ✓ | - | ✗ |
| bairro | 100 | ✓ | - | ✗ |
| endereco | 255 | ✗ | - | ✗ |
| fotos_storage_ids | 255 | ✓ | - | ✓ |
| id_corretor | 255 | ✓ | - | ✗ |

#### Float Attributes

| Key | Required | Default | Min | Max |
|-----|----------|---------|-----|-----|
| preco_venda | ✗ | - | 0 | - |
| preco_aluguel | ✗ | - | 0 | - |
| valor_condominio | ✗ | - | 0 | - |
| valor_iptu | ✗ | - | 0 | - |

#### Integer Attributes

| Key | Required | Default | Min | Max |
|-----|----------|---------|-----|-----|
| area_util_m2 | ✗ | - | 0 | - |
| quartos | ✓ | - | 0 | - |
| banheiros | ✓ | - | 0 | - |
| vagas_garagem | ✗ | 0 | 0 | - |

### Criar Índices (Opcional, mas recomendado)

Clique em "Indexes" e adicione:

1. Index: `status_index`
   - Attribute: status
   - Order: ASC

2. Index: `cidade_index`
   - Attribute: cidade
   - Order: ASC

3. Index: `tipo_anuncio_index`
   - Attribute: tipo_anuncio
   - Order: ASC

4. Index: `tipo_imovel_index`
   - Attribute: tipo_imovel
   - Order: ASC

5. Index: `created_index`
   - Attribute: $createdAt
   - Order: DESC

### Configurar Permissões da Collection

1. Clique em "Settings" da collection
2. Em "Permissions", configure:
   - **Read**: Add `role:all` (permite qualquer pessoa ler)
   - **Create**: Add `role:member` (permite usuários autenticados criar)
   - **Update**: Add `role:member` (permite usuários autenticados atualizar)
   - **Delete**: Add `role:member` (permite usuários autenticados deletar)

## Passo 3: Configurar Storage

1. No menu lateral, clique em "Storage"
2. Clique em "Create Bucket"
3. Bucket ID: `fotos_imoveis`
4. Name: `Fotos dos Imóveis`
5. Configuration:
   - Maximum file size: `10485760` (10MB)
   - Allowed file extensions: `jpg,jpeg,png,webp`
   - Compression: `gzip` (opcional)
   - Encryption: Habilitado (recomendado)

### Configurar Permissões do Bucket

1. Clique em "Settings" do bucket
2. Em "Permissions", configure:
   - **Read**: Add `role:all` (permite qualquer pessoa ver fotos)
   - **Create**: Add `role:member` (permite usuários autenticados fazer upload)
   - **Update**: Add `role:member` (permite usuários autenticados atualizar)
   - **Delete**: Add `role:member` (permite usuários autenticados deletar)

## Passo 4: Criar Usuário Admin

1. No menu lateral, clique em "Auth"
2. Clique em "Create User"
3. Preencha:
   - Email: seu-email@example.com
   - Password: senha-segura
   - Name: Seu Nome (opcional)
4. Clique em "Create"

**Importante**: Guarde essas credenciais, você usará para fazer login na aplicação!

## Passo 5: Configurar Web Platform (Opcional para produção)

1. No menu lateral, clique em "Settings"
2. Clique em "Platforms"
3. Clique em "Add Platform" → "Web App"
4. Name: `Duarte Imobiliario Web`
5. Hostname: `localhost` (para desenvolvimento) ou seu domínio (para produção)
6. Clique em "Next"

## Passo 6: Configurar Variáveis de Ambiente no Projeto

1. No diretório do projeto, copie o arquivo `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e configure:
   ```env
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=seu_project_id_aqui
   ```

   **Nota**: Substitua `seu_project_id_aqui` pelo Project ID que você copiou no Passo 1.

## Verificação

Depois de configurar tudo:

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Abra http://localhost:5173

3. Vá para `/admin/login` e faça login com as credenciais criadas no Passo 4

4. Se conseguir fazer login e acessar `/admin/cadastrar`, sua configuração está correta!

## Troubleshooting

### Erro: "Project not found"
- Verifique se o `VITE_APPWRITE_PROJECT_ID` no arquivo `.env` está correto
- Certifique-se de que copiou o Project ID exato do painel do Appwrite

### Erro: "Collection not found"
- Verifique se criou a collection com o ID exato: `imoveis`
- Verifique se criou o database com o ID exato: `imobiliariaDB`

### Erro de Permissões
- Revise as permissões da collection e do bucket
- Certifique-se de que adicionou `role:all` para leitura e `role:member` para escrita

### Erro ao fazer upload de fotos
- Verifique se o bucket foi criado com o ID: `fotos_imoveis`
- Verifique as permissões do bucket
- Confirme que as extensões de arquivo permitidas incluem jpg, jpeg, png, webp

## Próximos Passos

Após a configuração:
1. Faça login no sistema
2. Cadastre alguns imóveis de teste
3. Verifique a página de busca
4. Teste a visualização de detalhes dos imóveis
5. Configure seu domínio personalizado (para produção)

## Suporte

Para mais informações sobre o Appwrite, consulte a [documentação oficial](https://appwrite.io/docs).
