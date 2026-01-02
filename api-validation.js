/**
 * API Validation Script for RealStateHouseFinder
 * 
 * This script validates all Appwrite API endpoints used in the application
 * 
 * Usage: node api-validation.js
 */

import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// Configuration from environment or defaults
const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;

const DB_ID = 'imobiliariaDB';
const COLLECTION_IMOVEIS_ID = 'imoveis';
const BUCKET_FOTOS_ID = 'fotos_imoveis';

// Results tracking
const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'blue');
  console.log('='.repeat(60));
}

function logTest(name, status, details = '') {
  const symbol = status === 'pass' ? '✓' : status === 'fail' ? '✗' : '⚠';
  const color = status === 'pass' ? 'green' : status === 'fail' ? 'red' : 'yellow';
  log(`${symbol} ${name}`, color);
  if (details) {
    console.log(`  ${details}`);
  }
  
  if (status === 'pass') results.passed.push(name);
  else if (status === 'fail') results.failed.push(name);
  else results.warnings.push(name);
}

// Initialize client
let client, account, databases, storage;

async function initializeClient() {
  logSection('1. INITIALIZING CLIENT');
  
  try {
    if (!APPWRITE_PROJECT_ID || APPWRITE_PROJECT_ID === 'YOUR_PROJECT_ID' || APPWRITE_PROJECT_ID === 'your_project_id_here') {
      logTest('Project ID Configuration', 'fail', 'VITE_APPWRITE_PROJECT_ID is not configured');
      return false;
    }
    
    client = new Client();
    client
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID);
    
    account = new Account(client);
    databases = new Databases(client);
    storage = new Storage(client);
    
    logTest('Client Initialization', 'pass', `Endpoint: ${APPWRITE_ENDPOINT}`);
    logTest('Project ID', 'pass', `Project: ${APPWRITE_PROJECT_ID}`);
    return true;
  } catch (error) {
    logTest('Client Initialization', 'fail', error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  logSection('2. DATABASE CONNECTION');
  
  try {
    // Try to list databases to verify connection
    const response = await databases.list();
    logTest('Database Service Connection', 'pass', `Found ${response.total} database(s)`);
    
    // Check if our database exists
    const dbExists = response.databases.some(db => db.$id === DB_ID);
    if (dbExists) {
      logTest('Database "imobiliariaDB" exists', 'pass');
    } else {
      logTest('Database "imobiliariaDB" exists', 'fail', 'Database not found. Please create it.');
    }
    return true;
  } catch (error) {
    logTest('Database Service Connection', 'fail', error.message);
    return false;
  }
}

async function testCollectionAccess() {
  logSection('3. COLLECTION ACCESS');
  
  try {
    // Test listing documents (public read access)
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      [Query.limit(1)]
    );
    
    logTest('Collection "imoveis" read access', 'pass', `Found ${response.total} document(s)`);
    
    // Check collection structure
    if (response.documents.length > 0) {
      const doc = response.documents[0];
      const requiredFields = [
        'titulo', 'tipo_anuncio', 'tipo_imovel', 'preco_venda', 
        'cidade', 'bairro', 'quartos', 'banheiros', 'fotos_storage_ids'
      ];
      
      const missingFields = requiredFields.filter(field => !(field in doc));
      if (missingFields.length === 0) {
        logTest('Collection Schema', 'pass', 'All required fields present');
      } else {
        logTest('Collection Schema', 'warn', `Missing fields: ${missingFields.join(', ')}`);
      }
    }
    
    return true;
  } catch (error) {
    logTest('Collection "imoveis" read access', 'fail', error.message);
    return false;
  }
}

async function testQueryFilters() {
  logSection('4. QUERY FILTERS');
  
  try {
    // Test status filter
    const statusQuery = await databases.listDocuments(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      [Query.equal('status', 'disponivel'), Query.limit(5)]
    );
    logTest('Filter by status', 'pass', `Found ${statusQuery.documents.length} available properties`);
    
    // Test ordering
    const orderedQuery = await databases.listDocuments(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      [Query.orderDesc('$createdAt'), Query.limit(5)]
    );
    logTest('Order by creation date', 'pass', `Retrieved ${orderedQuery.documents.length} documents`);
    
    // Test greater than query
    const priceQuery = await databases.listDocuments(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      [Query.greaterThan('preco_venda', 100000), Query.limit(5)]
    );
    logTest('Filter by price range', 'pass', `Found ${priceQuery.documents.length} properties > 100000`);
    
    // Test combined queries
    const combinedQuery = await databases.listDocuments(
      DB_ID,
      COLLECTION_IMOVEIS_ID,
      [
        Query.equal('status', 'disponivel'),
        Query.equal('tipo_anuncio', 'venda'),
        Query.limit(5)
      ]
    );
    logTest('Combined filters', 'pass', `Found ${combinedQuery.documents.length} properties for sale`);
    
    return true;
  } catch (error) {
    logTest('Query Filters', 'fail', error.message);
    return false;
  }
}

async function testStorageAccess() {
  logSection('5. STORAGE ACCESS');
  
  try {
    // Test storage bucket access
    const buckets = await storage.listBuckets();
    logTest('Storage Service Connection', 'pass', `Found ${buckets.total} bucket(s)`);
    
    const bucketExists = buckets.buckets.some(b => b.$id === BUCKET_FOTOS_ID);
    if (bucketExists) {
      logTest('Bucket "fotos_imoveis" exists', 'pass');
    } else {
      logTest('Bucket "fotos_imoveis" exists', 'fail', 'Bucket not found. Please create it.');
      return false;
    }
    
    // Test listing files
    try {
      const files = await storage.listFiles(BUCKET_FOTOS_ID, [Query.limit(5)]);
      logTest('List files in bucket', 'pass', `Found ${files.total} file(s)`);
      
      // Test file preview URL generation
      if (files.files.length > 0) {
        const fileId = files.files[0].$id;
        const previewUrl = storage.getFilePreview(BUCKET_FOTOS_ID, fileId, 400, 300);
        if (previewUrl && previewUrl.href) {
          logTest('Generate file preview URL', 'pass', `URL: ${previewUrl.href.substring(0, 50)}...`);
        } else {
          logTest('Generate file preview URL', 'warn', 'Preview URL generated but format unexpected');
        }
      }
    } catch (error) {
      logTest('List files in bucket', 'fail', error.message);
    }
    
    return true;
  } catch (error) {
    logTest('Storage Service Connection', 'fail', error.message);
    return false;
  }
}

async function testAuthEndpoints() {
  logSection('6. AUTHENTICATION ENDPOINTS');
  
  try {
    // Test getting current session (should fail if not logged in)
    try {
      const session = await account.get();
      logTest('Get current session', 'pass', `Logged in as: ${session.email}`);
      
      // Test logout
      logTest('Logout capability', 'warn', 'Skipped (would logout current session)');
    } catch (error) {
      if (error.code === 401) {
        logTest('Get current session', 'pass', 'No active session (expected for public access)');
      } else {
        logTest('Get current session', 'fail', error.message);
      }
    }
    
    // Note: We don't test login here to avoid creating sessions
    logTest('Login endpoint', 'warn', 'Skipped (requires test credentials)');
    
    return true;
  } catch (error) {
    logTest('Authentication Endpoints', 'fail', error.message);
    return false;
  }
}

async function testRoutesConfiguration() {
  logSection('7. ROUTES CONFIGURATION');
  
  try {
    // Read router configuration
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const routerPath = path.join(__dirname, 'src', 'router', 'index.js');
    const routerContent = fs.readFileSync(routerPath, 'utf-8');
    
    const routes = [
      { path: '/', name: 'Home', component: 'PaginaInicial' },
      { path: '/busca', name: 'Busca', component: 'PaginaBusca' },
      { path: '/imovel/:id', name: 'DetalheImovel', component: 'DetalheImovel' },
      { path: '/admin/login', name: 'AdminLogin', component: 'AdminLogin' },
      { path: '/admin/dashboard', name: 'AdminDashboard', component: 'AdminDashboard', requiresAuth: true },
      { path: '/admin/cadastrar', name: 'CadastrarImovel', component: 'CadastrarImovel', requiresAuth: true },
      { path: '/admin/editar/:id', name: 'EditarImovel', component: 'EditarImovel', requiresAuth: true }
    ];
    
    let allRoutesFound = true;
    for (const route of routes) {
      if (routerContent.includes(route.path) && routerContent.includes(route.component)) {
        logTest(`Route ${route.path}`, 'pass', `Component: ${route.component}`);
      } else {
        logTest(`Route ${route.path}`, 'fail', `Component: ${route.component} not found`);
        allRoutesFound = false;
      }
    }
    
    // Check for navigation guard
    if (routerContent.includes('beforeEach') && routerContent.includes('requiresAuth')) {
      logTest('Authentication Guard', 'pass', 'Navigation guard implemented');
    } else {
      logTest('Authentication Guard', 'warn', 'Navigation guard may be missing');
    }
    
    return allRoutesFound;
  } catch (error) {
    logTest('Routes Configuration', 'fail', error.message);
    return false;
  }
}

async function testAPIIntegration() {
  logSection('8. API INTEGRATION IN COMPONENTS');
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const componentsDir = path.join(__dirname, 'src', 'components');
    
    // Check key components for API usage
    const checks = [
      {
        file: 'AdminLogin.vue',
        api: 'account.createEmailPasswordSession',
        description: 'Login functionality'
      },
      {
        file: 'CadastrarImovel.vue',
        api: 'databases.createDocument',
        description: 'Create property'
      },
      {
        file: 'CadastrarImovel.vue',
        api: 'storage.createFile',
        description: 'Upload images'
      },
      {
        file: 'PaginaBusca.vue',
        api: 'databases.listDocuments',
        description: 'List properties'
      },
      {
        file: 'DetalheImovel.vue',
        api: 'databases.getDocument',
        description: 'Get property details'
      },
      {
        file: 'EditarImovel.vue',
        api: 'databases.updateDocument',
        description: 'Update property'
      },
      {
        file: 'AdminDashboard.vue',
        api: 'databases.deleteDocument',
        description: 'Delete property'
      }
    ];
    
    for (const check of checks) {
      try {
        const filePath = path.join(componentsDir, check.file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          if (content.includes(check.api)) {
            logTest(`${check.file}: ${check.description}`, 'pass', `Uses ${check.api}`);
          } else {
            logTest(`${check.file}: ${check.description}`, 'warn', `${check.api} not found`);
          }
        } else {
          logTest(`${check.file}`, 'warn', 'File not found');
        }
      } catch (error) {
        logTest(`${check.file}`, 'fail', error.message);
      }
    }
    
    return true;
  } catch (error) {
    logTest('API Integration', 'fail', error.message);
    return false;
  }
}

// Main execution
async function runValidation() {
  log('\n╔══════════════════════════════════════════════════════════════╗', 'blue');
  log('║     API & ENDPOINTS VALIDATION - RealStateHouseFinder       ║', 'blue');
  log('╚══════════════════════════════════════════════════════════════╝', 'blue');
  
  const initialized = await initializeClient();
  if (!initialized) {
    log('\n⚠️  Cannot continue without proper configuration', 'yellow');
    printSummary();
    return;
  }
  
  await testDatabaseConnection();
  await testCollectionAccess();
  await testQueryFilters();
  await testStorageAccess();
  await testAuthEndpoints();
  await testRoutesConfiguration();
  await testAPIIntegration();
  
  printSummary();
}

function printSummary() {
  logSection('VALIDATION SUMMARY');
  
  log(`✓ Passed: ${results.passed.length}`, 'green');
  log(`✗ Failed: ${results.failed.length}`, 'red');
  log(`⚠ Warnings: ${results.warnings.length}`, 'yellow');
  log(`━ Total Tests: ${results.passed.length + results.failed.length + results.warnings.length}`, 'blue');
  
  if (results.failed.length > 0) {
    log('\n❌ VALIDATION FAILED', 'red');
    log('Please fix the following issues:', 'red');
    results.failed.forEach(test => log(`  • ${test}`, 'red'));
  } else if (results.warnings.length > 0) {
    log('\n⚠️  VALIDATION PASSED WITH WARNINGS', 'yellow');
    log('Consider addressing the following:', 'yellow');
    results.warnings.forEach(test => log(`  • ${test}`, 'yellow'));
  } else {
    log('\n✅ ALL VALIDATIONS PASSED!', 'green');
  }
  
  console.log('\n');
}

// Run the validation
runValidation().catch(error => {
  log('\n❌ FATAL ERROR:', 'red');
  console.error(error);
  process.exit(1);
});
