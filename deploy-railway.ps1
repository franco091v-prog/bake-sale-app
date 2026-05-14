# =============================================
# 🚂 DESPLIEGUE EN RAILWAY - 1 SOLO COMANDO
# =============================================
# PASO 1: Ve a https://railway.com/dashboard
# PASO 2: Perfil → Access Tokens → Copia tu token
# PASO 3: Ejecuta este script
# =============================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   🚂 BAKE SALE - Despliegue en Railway      ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

$token = Read-Host "Pega tu RAILWAY_TOKEN aquí"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "❌ No ingresaste un token. Abortando." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Configurando entorno..." -ForegroundColor Yellow
$env:RAILWAY_TOKEN = $token
$env:CI = "true"

# Navegar al proyecto
Set-Location "C:\Users\pc\bake-sale-app"

# Verificar que existe package.json
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ No encontré package.json" -ForegroundColor Red
    exit 1
}

# Instalar dependencias si no existe node_modules
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Inicializar Railway
Write-Host "🚂 Inicializando Railway..." -ForegroundColor Yellow
railway init 2>&1

# Desplegar
Write-Host ""
Write-Host "🚀 Desplegando tu app..." -ForegroundColor Green
Write-Host "   Esto puede tardar 1-2 minutos..." -ForegroundColor Cyan
Write-Host ""

railway up 2>&1

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   🎉 ¡TU APP ESTÁ PUBLICADA!                ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                               ║" -ForegroundColor Green
Write-Host "║   📱 Copia el link que te da Railway y        ║" -ForegroundColor Green
Write-Host "║      envíalo a las familias por WhatsApp     ║" -ForegroundColor Green
Write-Host "║                                               ║" -ForegroundColor Green
Write-Host "║   📊 Para ver pedidos:                        ║" -ForegroundColor Green
Write-Host "║      https://tu-app.up.railway.app/dashboard.html" -ForegroundColor White
Write-Host "║                                               ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Presioná cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")