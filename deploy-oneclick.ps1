# 🚀 DESPLIEGUE EN 1 PASO - Bake Sale App
# Copiá y pegá este comando en tu terminal:
#
#   powershell -ExecutionPolicy Bypass -File bake-sale-app\deploy-oneclick.ps1
#
# Requisitos: Node.js (ya instalado ✅)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   🧁 BAKE SALE - Despliegue en 1 paso    ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-Not (Test-Path "menu-data.js")) {
    if (Test-Path "bake-sale-app\menu-data.js") {
        Set-Location "bake-sale-app"
        Write-Host "📁 Entré a la carpeta bake-sale-app" -ForegroundColor Yellow
    } else {
        Write-Host "❌ No encontré la carpeta bake-sale-app. Ejecutá este script desde C:\Users\pc" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📦 Verificando archivos..." -ForegroundColor Cyan
$files = @("index.html", "styles.css", "app.js", "menu-data.js", "dashboard.html", "manifest.json", "sw.js")
$allOk = $true
foreach ($f in $files) {
    if (Test-Path $f) {
        Write-Host "   ✅ $f" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $f - FALTA!" -ForegroundColor Red
        $allOk = $false
    }
}

if (-Not $allOk) {
    Write-Host ""
    Write-Host "❌ Faltan archivos. No se puede continuar." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 ¿Cómo querés publicar la app?" -ForegroundColor Yellow
Write-Host ""
Write-Host "   [1] Netlify Drop (MÁS FÁCIL - sin cuenta, 2 min)" -ForegroundColor White
Write-Host "   [2] Firebase Hosting (cuenta Google, 10 min)" -ForegroundColor White
Write-Host "   [3] Solo servidor local (para probar en tu PC)" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "Elegí una opción (1/2/3)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "🌐 Abriendo Netlify Drop..." -ForegroundColor Green
        Write-Host ""
        Write-Host "   PASO 1: Se va a abrir esta página:" -ForegroundColor Cyan
        Write-Host "   👉 https://app.netlify.com/drop" -ForegroundColor White
        Write-Host ""
        Write-Host "   PASO 2: Arrastrá TODA la carpeta 'bake-sale-app'" -ForegroundColor Cyan
        Write-Host "           al rectángulo que aparece en la página" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   PASO 3: Netlify te dará un link como:" -ForegroundColor Cyan
        Write-Host "           https://algo-123456.netlify.app" -ForegroundColor White
        Write-Host ""
        Write-Host "   PASO 4: Enviá ese link por WhatsApp a las familias" -ForegroundColor Cyan
        Write-Host ""
        
        $abrir = Read-Host "¿Querés que abra el enlace ahora? (s/n)"
        if ($abrir -eq "s") {
            Start-Process "https://app.netlify.com/drop"
            Write-Host "✅ Navegador abierto!" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "📋 Copiá este comando para compartir la app después:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   📱 Mensaje para las familias:" -ForegroundColor Cyan
        Write-Host '   "Hola! Acá está el menú del Bake Sale del sábado.' -ForegroundColor White
        Write-Host '    Hagan su pedido entrando a este link: [PEGÁ TU LINK AQUÍ]"' -ForegroundColor White
        Write-Host ""
    }
    "2" {
        Write-Host ""
        Write-Host "🔥 Configurando Firebase Hosting..." -ForegroundColor Green
        
        $instalar = Read-Host "¿Tenés npm instalado? (s/n)"
        if ($instalar -eq "s") {
            Write-Host "📦 Instalando Firebase CLI..." -ForegroundColor Yellow
            npm install -g firebase-tools 2>&1 | ForEach-Object { Write-Host "   $_" }
            Write-Host "✅ Firebase CLI instalado!" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "📝 Ahora ejecutá estos comandos uno por uno:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   1. firebase login" -ForegroundColor White
        Write-Host "   2. firebase init hosting" -ForegroundColor White
        Write-Host "   3. Seleccioná: Create a new project" -ForegroundColor White
        Write-Host "   4. Nombre: bake-sale-2026" -ForegroundColor White
        Write-Host "   5. Public directory: ." -ForegroundColor White
        Write-Host "   6. Single-page app: Yes" -ForegroundColor White
        Write-Host "   7. firebase deploy" -ForegroundColor White
        Write-Host ""
        Write-Host "   Tu app estará en: https://bake-sale-2026.web.app" -ForegroundColor Green
        Write-Host ""
        
        $ejecutar = Read-Host "¿Querés ejecutar firebase login ahora? (s/n)"
        if ($ejecutar -eq "s") {
            firebase login
        }
    }
    "3" {
        Write-Host ""
        Write-Host "🖥️ Iniciando servidor local..." -ForegroundColor Green
        Write-Host ""
        Write-Host "   La app estará disponible en:" -ForegroundColor Cyan
        Write-Host "   👉 http://localhost:3000" -ForegroundColor White
        Write-Host "   👉 http://localhost:3000/dashboard.html" -ForegroundColor White
        Write-Host ""
        Write-Host "   (Presioná CTRL+C para detener)" -ForegroundColor Yellow
        Write-Host ""
        
        $lanzar = Read-Host "¿Querés lanzar el servidor ahora? (s/n)"
        if ($lanzar -eq "s") {
            Write-Host ""
            node server.js
        }
    }
    default {
        Write-Host "Opción no válida." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   🎉 ¡LISTO! Tu app está publicada       ║" -ForegroundColor Green
Write-Host "╠═══════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                           ║" -ForegroundColor Green
Write-Host "║   📱 Enviá el link a las familias        ║" -ForegroundColor Green
Write-Host "║   📊 Revisá pedidos en el dashboard      ║" -ForegroundColor Green
Write-Host "║   📥 Exportá para saber qué cocinar      ║" -ForegroundColor Green
Write-Host "║                                           ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Presioná cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")