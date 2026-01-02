#!/usr/bin/env node

/**
 * Endpoint Verification Report
 * Static analysis of API usage in the codebase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '═'.repeat(70));
  log(`  ${title}`, 'bold');
  console.log('═'.repeat(70));
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

function searchInFile(content, pattern) {
  return content.includes(pattern);
}

function countOccurrences(content, pattern) {
  const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const matches = content.match(regex);
  return matches ? matches.length : 0;
}

// Main verification
console.log('\n');
log('╔══════════════════════════════════════════════════════════════════╗', 'cyan');
log('║                                                                  ║', 'cyan');
log('║      RELATÓRIO DE VERIFICAÇÃO DE APIs E ENDPOINTS               ║', 'cyan');
log('║      RealStateHouseFinder - Portal Imobiliário                  ║', 'cyan');
log('║                                                                  ║', 'cyan');
log('╚══════════════════════════════════════════════════════════════════╝', 'cyan');

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0
};

// 1. Verify Appwrite Configuration
logSection('1. CONFIGURAÇÃO DO APPWRITE');

const appwritePath = path.join(__dirname, 'src', 'appwrite.js');
if (checkFileExists(appwritePath)) {
  const content = readFile(appwritePath);
  
  log('✓ Arquivo src/appwrite.js encontrado', 'green');
  results.passed++; results.total++;
  
  // Check imports
  const imports = [
    'Client', 'Account', 'Databases', 'Storage', 'ID', 'Permission', 'Role', 'Query'
  ];
  
  imports.forEach(imp => {
    if (searchInFile(content, imp)) {
      log(`  ✓ Import '${imp}' presente`, 'green');
      results.passed++; results.total++;
    } else {
      log(`  ✗ Import '${imp}' ausente`, 'red');
      results.failed++; results.total++;
    }
  });
  
  // Check exports
  const exports = ['account', 'databases', 'storage', 'DB_ID', 'COLLECTION_IMOVEIS_ID', 'BUCKET_FOTOS_ID'];
  exports.forEach(exp => {
    if (searchInFile(content, `export const ${exp}`) || searchInFile(content, `export { ${exp}`)) {
      log(`  ✓ Export '${exp}' presente`, 'green');
      results.passed++; results.total++;
    } else {
      log(`  ✗ Export '${exp}' ausente`, 'red');
      results.failed++; results.total++;
    }
  });
} else {
  log('✗ Arquivo src/appwrite.js não encontrado', 'red');
  results.failed++; results.total++;
}

// 2. Verify Router Configuration
logSection('2. CONFIGURAÇÃO DE ROTAS');

const routerPath = path.join(__dirname, 'src', 'router', 'index.js');
if (checkFileExists(routerPath)) {
  const content = readFile(routerPath);
  
  log('✓ Arquivo src/router/index.js encontrado', 'green');
  results.passed++; results.total++;
  
  const routes = [
    { path: '/', component: 'PaginaInicial', name: 'Home' },
    { path: '/busca', component: 'PaginaBusca', name: 'Busca' },
    { path: '/imovel/:id', component: 'DetalheImovel', name: 'Detalhes' },
    { path: '/admin/login', component: 'AdminLogin', name: 'Login Admin' },
    { path: '/admin/dashboard', component: 'AdminDashboard', name: 'Dashboard', auth: true },
    { path: '/admin/cadastrar', component: 'CadastrarImovel', name: 'Cadastrar', auth: true },
    { path: '/admin/editar/:id', component: 'EditarImovel', name: 'Editar', auth: true }
  ];
  
  routes.forEach(route => {
    if (searchInFile(content, route.path) && searchInFile(content, route.component)) {
      const authStatus = route.auth ? ' (🔒 protegida)' : '';
      log(`  ✓ Rota '${route.path}' → ${route.component}${authStatus}`, 'green');
      results.passed++; results.total++;
    } else {
      log(`  ✗ Rota '${route.path}' não configurada corretamente`, 'red');
      results.failed++; results.total++;
    }
  });
  
  // Check navigation guard
  if (searchInFile(content, 'beforeEach') && searchInFile(content, 'requiresAuth')) {
    log('  ✓ Navigation Guard implementado', 'green');
    results.passed++; results.total++;
  } else {
    log('  ⚠ Navigation Guard pode estar ausente', 'yellow');
    results.warnings++; results.total++;
  }
} else {
  log('✗ Arquivo src/router/index.js não encontrado', 'red');
  results.failed++; results.total++;
}

// 3. Verify Authentication APIs
logSection('3. APIs DE AUTENTICAÇÃO');

const authChecks = [
  {
    file: 'AdminLogin.vue',
    api: 'account.createEmailPasswordSession',
    description: 'Login com email/senha',
    type: 'POST',
    inComponents: true
  },
  {
    file: 'App.vue',
    api: 'account.get',
    description: 'Obter sessão atual',
    type: 'GET',
    inComponents: false
  },
  {
    file: 'App.vue',
    api: 'account.deleteSession',
    description: 'Logout',
    type: 'DELETE',
    inComponents: false
  }
];

authChecks.forEach(check => {
  const filePath = check.inComponents 
    ? path.join(__dirname, 'src', 'components', check.file)
    : path.join(__dirname, 'src', check.file);
  
  if (checkFileExists(filePath)) {
    const content = readFile(filePath);
    if (searchInFile(content, check.api)) {
      log(`✓ ${check.description} (${check.type})`, 'green');
      log(`  Arquivo: ${check.file}`, 'cyan');
      results.passed++; results.total++;
    } else {
      log(`✗ ${check.description} não encontrada em ${check.file}`, 'red');
      results.failed++; results.total++;
    }
  } else {
    log(`✗ Arquivo ${check.file} não encontrado`, 'red');
    results.failed++; results.total++;
  }
});

// 4. Verify Database APIs
logSection('4. APIs DE DATABASE');

const databaseChecks = [
  {
    file: 'PaginaBusca.vue',
    api: 'databases.listDocuments',
    description: 'Listar documentos (busca)',
    type: 'GET',
    features: ['Query.equal', 'Query.greaterThanEqual', 'Query.orderDesc']
  },
  {
    file: 'PaginaInicial.vue',
    api: 'databases.listDocuments',
    description: 'Listar documentos (página inicial)',
    type: 'GET'
  },
  {
    file: 'AdminDashboard.vue',
    api: 'databases.listDocuments',
    description: 'Listar documentos (admin)',
    type: 'GET'
  },
  {
    file: 'DetalheImovel.vue',
    api: 'databases.getDocument',
    description: 'Obter documento específico',
    type: 'GET'
  },
  {
    file: 'CadastrarImovel.vue',
    api: 'databases.createDocument',
    description: 'Criar novo documento',
    type: 'POST',
    features: ['ID.unique()', 'Permission.read', 'Permission.update']
  },
  {
    file: 'EditarImovel.vue',
    api: 'databases.updateDocument',
    description: 'Atualizar documento',
    type: 'PATCH'
  },
  {
    file: 'AdminDashboard.vue',
    api: 'databases.deleteDocument',
    description: 'Deletar documento',
    type: 'DELETE'
  }
];

databaseChecks.forEach(check => {
  const filePath = path.join(__dirname, 'src', 'components', check.file);
  if (checkFileExists(filePath)) {
    const content = readFile(filePath);
    if (searchInFile(content, check.api)) {
      log(`✓ ${check.description} (${check.type})`, 'green');
      log(`  Arquivo: ${check.file}`, 'cyan');
      
      if (check.features) {
        check.features.forEach(feature => {
          if (searchInFile(content, feature)) {
            log(`    ✓ Usa ${feature}`, 'green');
          }
        });
      }
      results.passed++; results.total++;
    } else {
      log(`✗ ${check.description} não encontrada em ${check.file}`, 'red');
      results.failed++; results.total++;
    }
  } else {
    log(`⚠ Arquivo ${check.file} não encontrado`, 'yellow');
    results.warnings++; results.total++;
  }
});

// 5. Verify Storage APIs
logSection('5. APIs DE STORAGE');

const storageChecks = [
  {
    file: 'CadastrarImovel.vue',
    api: 'storage.createFile',
    description: 'Upload de arquivos',
    type: 'POST',
    features: ['Promise.all']
  },
  {
    file: 'PaginaBusca.vue',
    api: 'storage.getFilePreview',
    description: 'Preview de imagens (busca)',
    type: 'GET'
  },
  {
    file: 'DetalheImovel.vue',
    api: 'storage.getFilePreview',
    description: 'Preview de imagens (detalhes)',
    type: 'GET'
  },
  {
    file: 'AdminDashboard.vue',
    api: 'storage.deleteFile',
    description: 'Deletar arquivos',
    type: 'DELETE'
  }
];

storageChecks.forEach(check => {
  const filePath = path.join(__dirname, 'src', 'components', check.file);
  if (checkFileExists(filePath)) {
    const content = readFile(filePath);
    if (searchInFile(content, check.api)) {
      log(`✓ ${check.description} (${check.type})`, 'green');
      log(`  Arquivo: ${check.file}`, 'cyan');
      
      if (check.features) {
        check.features.forEach(feature => {
          if (searchInFile(content, feature)) {
            log(`    ✓ Usa ${feature}`, 'green');
          }
        });
      }
      results.passed++; results.total++;
    } else {
      log(`✗ ${check.description} não encontrada em ${check.file}`, 'red');
      results.failed++; results.total++;
    }
  } else {
    log(`⚠ Arquivo ${check.file} não encontrado`, 'yellow');
    results.warnings++; results.total++;
  }
});

// 6. Verify Query Filters
logSection('6. FILTROS E QUERIES');

const buscaPath = path.join(__dirname, 'src', 'components', 'PaginaBusca.vue');
if (checkFileExists(buscaPath)) {
  const content = readFile(buscaPath);
  
  const queries = [
    { name: 'Equal', pattern: 'Query.equal' },
    { name: 'GreaterThanEqual', pattern: 'Query.greaterThanEqual' },
    { name: 'LessThanEqual', pattern: 'Query.lessThanEqual' },
    { name: 'OrderAsc', pattern: 'Query.orderAsc' },
    { name: 'OrderDesc', pattern: 'Query.orderDesc' },
    { name: 'Limit', pattern: 'Query.limit' }
  ];
  
  queries.forEach(query => {
    const count = countOccurrences(content, query.pattern);
    if (count > 0) {
      log(`✓ Query.${query.name} implementada (${count}x)`, 'green');
      results.passed++; results.total++;
    } else {
      log(`⚠ Query.${query.name} não encontrada`, 'yellow');
      results.warnings++; results.total++;
    }
  });
  
  // Check for filter fields
  const filters = [
    'tipo_anuncio', 'tipo_imovel', 'cidade', 'quartos_min', 
    'banheiros_min', 'preco_min', 'preco_max', 'texto_busca'
  ];
  
  filters.forEach(filter => {
    if (searchInFile(content, filter)) {
      log(`  ✓ Filtro '${filter}' presente`, 'green');
    }
  });
} else {
  log('✗ Arquivo PaginaBusca.vue não encontrado', 'red');
  results.failed++; results.total++;
}

// 7. Verify Components Structure
logSection('7. ESTRUTURA DE COMPONENTES');

const components = [
  { name: 'App.vue', required: true },
  { name: 'PaginaInicial.vue', required: true },
  { name: 'PaginaBusca.vue', required: true },
  { name: 'DetalheImovel.vue', required: true },
  { name: 'AdminLogin.vue', required: true },
  { name: 'AdminDashboard.vue', required: true },
  { name: 'CadastrarImovel.vue', required: true },
  { name: 'EditarImovel.vue', required: true },
  { name: 'NotFound.vue', required: false },
  { name: 'NotificationToast.vue', required: false }
];

components.forEach(comp => {
  const compPath = comp.name === 'App.vue' 
    ? path.join(__dirname, 'src', comp.name)
    : path.join(__dirname, 'src', 'components', comp.name);
  
  if (checkFileExists(compPath)) {
    log(`✓ ${comp.name} encontrado`, 'green');
    results.passed++; results.total++;
  } else if (comp.required) {
    log(`✗ ${comp.name} não encontrado (obrigatório)`, 'red');
    results.failed++; results.total++;
  } else {
    log(`⚠ ${comp.name} não encontrado (opcional)`, 'yellow');
    results.warnings++; results.total++;
  }
});

// 8. Verify Configuration Files
logSection('8. ARQUIVOS DE CONFIGURAÇÃO');

const configFiles = [
  { name: 'package.json', required: true },
  { name: 'vite.config.js', required: true },
  { name: '.env.example', required: true },
  { name: 'src/config.js', required: true },
  { name: 'README.md', required: true }
];

configFiles.forEach(file => {
  const filePath = path.join(__dirname, file.name);
  if (checkFileExists(filePath)) {
    log(`✓ ${file.name} encontrado`, 'green');
    results.passed++; results.total++;
  } else if (file.required) {
    log(`✗ ${file.name} não encontrado`, 'red');
    results.failed++; results.total++;
  } else {
    log(`⚠ ${file.name} não encontrado`, 'yellow');
    results.warnings++; results.total++;
  }
});

// 9. Verify Dependencies
logSection('9. DEPENDÊNCIAS');

const packagePath = path.join(__dirname, 'package.json');
if (checkFileExists(packagePath)) {
  const packageJson = JSON.parse(readFile(packagePath));
  
  const requiredDeps = [
    { name: 'vue', type: 'dependencies' },
    { name: 'vue-router', type: 'dependencies' },
    { name: 'appwrite', type: 'dependencies' },
    { name: 'vite', type: 'devDependencies' },
    { name: '@vitejs/plugin-vue', type: 'devDependencies' }
  ];
  
  requiredDeps.forEach(dep => {
    const deps = packageJson[dep.type];
    if (deps && deps[dep.name]) {
      log(`✓ ${dep.name} (${deps[dep.name]})`, 'green');
      results.passed++; results.total++;
    } else {
      log(`✗ ${dep.name} não encontrado em ${dep.type}`, 'red');
      results.failed++; results.total++;
    }
  });
} else {
  log('✗ package.json não encontrado', 'red');
  results.failed++; results.total++;
}

// Summary
logSection('RESUMO DA VERIFICAÇÃO');

const percentage = Math.round((results.passed / results.total) * 100);

console.log('');
log(`Total de Verificações: ${results.total}`, 'cyan');
log(`✓ Aprovadas: ${results.passed}`, 'green');
log(`✗ Falhadas: ${results.failed}`, 'red');
log(`⚠ Avisos: ${results.warnings}`, 'yellow');
log(`📊 Taxa de Sucesso: ${percentage}%`, 'magenta');
console.log('');

if (results.failed === 0) {
  log('═'.repeat(70), 'green');
  log('  ✅ TODAS AS APIs E ENDPOINTS ESTÃO CONFIGURADOS CORRETAMENTE!', 'green');
  log('═'.repeat(70), 'green');
} else {
  log('═'.repeat(70), 'yellow');
  log('  ⚠️  ALGUMAS VERIFICAÇÕES FALHARAM', 'yellow');
  log('  Revise os itens marcados com ✗ acima', 'yellow');
  log('═'.repeat(70), 'yellow');
}

console.log('\n');
log('📚 Para mais informações, consulte:', 'blue');
log('  • API_DOCUMENTATION.md - Documentação completa das APIs', 'cyan');
log('  • README.md - Guia de configuração', 'cyan');
log('  • APPWRITE_SETUP.md - Setup do backend', 'cyan');
console.log('\n');

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
