# =============================================
# 🚀 DESPLIEGUE RÁPIDO - Bake Sale App
# =============================================
# Script de PowerShell para publicar la app
# Elegí una opción cuando se te pida
# =============================================

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  🧁 BAKE SALE - Asistente de Despliegue" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  [1] Netlify Drop (MÁS FÁCIL - sin cuenta)" -ForegroundColor Yellow
Write-Host "  [2] Firebase Hosting (requiere cuenta Google)" -ForegroundColor Yellow
Write-Host "  [3] GitHub Pages (requiere cuenta GitHub)" -ForegroundColor Yellow
Write-Host ""

$opcion = Read-Host "¿Qué opción elegís? (1/2/3)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "📦 Opción 1: Netlify Drop" -ForegroundColor Cyan
        Write-Host "────────────────────────────────────────"
        Write-Host ""
        Write-Host "  1. Abrí este enlace en tu navegador:"
        Write-Host "     👉 https://app.netlify.com/drop" -ForegroundColor White
        Write-Host ""
        Write-Host "  2. Arrastrá la carpeta 'bake-sale-app' entera"
        Write-Host "     al área sombreada del navegador"
        Write-Host ""
        Write-Host "  3. ¡Listo! Netlify te dará un link como:"
        Write-Host "     https://algo-123456.netlify.app" -ForegroundColor White
        Write-Host ""
        Write-Host "  4. Enviá ese link a las familias por WhatsApp"
        Write-Host ""
        Write-Host "  ⏱️ Tiempo: 2 minutos" -ForegroundColor Green
        Write-Host ""

        $respuesta = Read-Host "¿Querés que abra el enlace ahora? (s/n)"
        if ($respuesta -eq "s") {
            Start-Process "https://app.netlify.com/drop"
        }
    }
    "2" {
        Write-Host ""
        Write-Host "🔥 Opción 2: Firebase Hosting" -ForegroundColor Cyan
        Write-Host "────────────────────────────────────────"
        Write-Host ""
        Write-Host "  Requisitos:"
        Write-Host "  - Cuenta Google (Gmail)"
        Write-Host "  - Node.js instalado (ya lo tenés ✅)"
        Write-Host ""
        Write-Host "  Pasos:"
        Write-Host "  1. Abrí https://console.firebase.google.com"
        Write-Host "  2. Creá un nuevo proyecto"
        Write-Host "  3. Instalá Firebase CLI:"
        Write-Host ""

        $instalar = Read-Host "¿Querés que instale Firebase CLI ahora? (s/n)"
        if ($instalar -eq "s") {
            Write-Host "  Instalando Firebase CLI..." -ForegroundColor Yellow
            npm install -g firebase-tools
            Write-Host "  ✅ Firebase CLI instalado!" -ForegroundColor Green
            Write-Host ""
            Write-Host "  Ahora ejecutá estos comandos:"
            Write-Host "  firebase login"
            Write-Host "  cd bake-sale-app"
            Write-Host "  firebase init hosting"
            Write-Host "  firebase deploy"
        }
        Write-Host ""
        Write-Host "  ⏱️ Tiempo: 10-15 minutos" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "🐙 Opción 3: GitHub Pages" -ForegroundColor Cyan
        Write-Host "────────────────────────────────────────"
        Write-Host ""
        Write-Host "  Requisitos:"
        Write-Host "  - Cuenta en GitHub.com"
        Write-Host "  - Git instalado (ya lo tenés ✅)"
        Write-Host ""
        Write-Host "  Pasos:"
        Write-Host "  1. Creá un repositorio nuevo en GitHub.com"
        Write-Host "  2. Ejecutá estos comandos:"
        Write-Host ""
        Write-Host "     cd bake-sale-app"
        Write-Host "     git init"
        Write-Host "     git add ."
        Write-Host "     git commit -m 'Bake Sale App'"
        Write-Host "     git branch -M main"
        Write-Host "     git remote add origin TU_REPO_URL"
        Write-Host "     git push -u origin main"
        Write-Host ""
        Write-Host "  3. En GitHub.com > Settings > Pages"
        Write-Host "     Seleccioná la branch 'main'"
        Write-Host ""
        Write-Host "  4. Tu app estará en:"
        Write-Host "     https://tuusuario.github.io/repo" -ForegroundColor White
        Write-Host ""
        Write-Host "  ⏱️ Tiempo: 10 minutos" -ForegroundColor Green
    }
    default {
        Write-Host "Opción no válida." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  📋 PASO FINAL: Compartí el link con las familias" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Enviá el link por WhatsApp al grupo de padres."
Write-Host "  Cada familia lo abre en su celular y hace su pedido."
Write-Host ""
Write-Host "  💡 Tip: Generá un código QR del link para que"
Write-Host "     sea más fácil de compartir en el colegio."
Write-Host ""
Write-Host "  Presioná cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
echo "  Opción 1: Netlify Drop (MÁS FÁCIL - sin cuenta)"
echo "  Opción 2: Firebase Hosting (requiere cuenta Google)"
echo "  Opción 3: GitHub Pages (requiere cuenta GitHub)"
echo ""
read -p "¿Qué opción elegís? (1/2/3): " OPCION

case $OPCION in
  1)
    echo ""
    echo "📦 Opción 1: Netlify Drop"
    echo "────────────────────────────────────────"
    echo ""
    echo "  1. Abrí este enlace en tu navegador:"
    echo "     👉 https://app.netlify.com/drop"
    echo ""
    echo "  2. Arrastrá la carpeta 'bake-sale-app' entera"
    echo "     al área sombreada del navegador"
    echo ""
    echo "  3. ¡Listo! Netlify te dará un link como:"
    echo "     https://algo-123456.netlify.app"
    echo ""
    echo "  4. Enviá ese link a las familias por WhatsApp"
    echo ""
    echo "  ⏱️ Tiempo: 2 minutos"
    echo ""
    ;;

  2)
    echo ""
    echo "🔥 Opción 2: Firebase Hosting"
    echo "────────────────────────────────────────"
    echo ""
    echo "  Requisitos:"
    echo "  - Cuenta Google (Gmail)"
    echo "  - Node.js instalado (ya lo tenés ✅)"
    echo ""
    echo "  Pasos:"
    echo "  1. Abrí https://console.firebase.google.com"
    echo "  2. Creá un nuevo proyecto"
    echo "  3. En la consola, ejecutá estos comandos:"
    echo ""
    echo "     npm install -g firebase-tools"
    echo "     firebase login"
    echo "     firebase init hosting"
    echo "     firebase deploy"
    echo ""
    echo "  ⏱️ Tiempo: 10-15 minutos"
    echo ""
    ;;

  3)
    echo ""
    echo "🐙 Opción 3: GitHub Pages"
    echo "────────────────────────────────────────"
    echo ""
    echo "  Requisitos:"
    echo "  - Cuenta en GitHub.com"
    echo "  - Git instalado (ya lo tenés ✅)"
    echo ""
    echo "  Pasos:"
    echo "  1. Creá un repositorio nuevo en GitHub"
    echo "  2. Subí los archivos:"
    echo ""
    echo "     git init"
    echo "     git add ."
    echo "     git commit -m 'Bake Sale App'"
    echo "     git branch -M main"
    echo "     git remote add origin TU_REPO_URL"
    echo "     git push -u origin main"
    echo ""
    echo "  3. En Settings > Pages, seleccioná 'main' branch"
    echo "  4. Tu app estará en: https://tuusuario.github.io/repo"
    echo ""
    echo "  ⏱️ Tiempo: 10 minutos"
    echo ""
    ;;

  *)
    echo "Opción no válida. Ejecutá de nuevo."
    ;;
esac

echo ""
echo "=============================================="
echo "  📋 PASO FINAL: Compartí el link con las familias"
echo "=============================================="
echo ""
echo "  Enviá el link por WhatsApp al grupo de padres."
echo "  Cada familia lo abre en su celular y hace su pedido."
echo ""
echo "  💡 Tip: También podés imprimir un código QR"
echo "     que apunte al link para que sea más fácil."
echo ""