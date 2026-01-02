#!/bin/bash

# API Verification Quick Check
# Execute este script para verificar rapidamente a configuração das APIs

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  VERIFICAÇÃO RÁPIDA DE APIs - RealStateHouseFinder"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js primeiro."
    exit 1
fi

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Run verification script
echo "🔍 Executando verificação de endpoints..."
echo ""
node verify-endpoints.js

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Verificação concluída com sucesso!${NC}"
    echo ""
    echo "📚 Documentação disponível:"
    echo "  • API_DOCUMENTATION.md - Documentação completa"
    echo "  • API_VERIFICATION_REPORT.md - Relatório detalhado"
    echo ""
    echo -e "${BLUE}💡 Para testar com conexão ao Appwrite:${NC}"
    echo "  1. Configure o arquivo .env com suas credenciais"
    echo "  2. Execute: node api-validation.js"
else
    echo ""
    echo "⚠️  Algumas verificações falharam. Verifique os detalhes acima."
    exit 1
fi
