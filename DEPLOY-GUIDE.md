# 🧁 BAKE SALE APP - Guía Completa de Despliegue

## Despliegue RÁPIDO (3 opciones)

---

## 🟢 Opción 1: Netlify Drop (RECOMENDADA - 2 minutos)

**No necesitas crear ninguna cuenta.**

### Paso 1: Abre el enlace
👉 **https://app.netlify.com/drop**

### Paso 2: Arrastra la carpeta
Arrastra **TODA la carpeta `bake-sale-app/`** al área sombreada que aparece en el navegador.

### Paso 3: ¡Listo!
Netlify te dará un link como:
```
https://amazing-name-123456.netlify.app
```

### Paso 4: Comparte
Enviá ese link por WhatsApp al grupo de padres. ¡Ya está!

---

## 🟡 Opción 2: Firebase Hosting (10 minutos)

### Requisitos
- Cuenta Google (Gmail)
- Node.js (ya lo tenés ✅)

### Pasos

```bash
# 1. Instalá Firebase CLI
npm install -g firebase-tools

# 2. Ingresá con tu cuenta Google
firebase login

# 3. Inicializá el proyecto
cd bake-sale-app
firebase init hosting

# Te preguntará:
#   - Seleccioná "Create a new project"
#   - Nombre del proyecto: bake-sale-2026
#   - Public directory: . (punto)
#   - Single-page app: Yes
#   - Deploy now: No

# 4. Publicá la app
firebase deploy
```

### Resultado
```
✅ Hosting URL: https://bake-sale-2026.web.app
```

---

## 🔵 Opción 3: GitHub Pages (10 minutos)

### Requisitos
- Cuenta en [github.com](https://github.com)
- Git (ya lo tenés ✅)

### Pasos

```bash
# 1. Creá un repositorio nuevo en GitHub.com
#    (Botón "New repository", nombre: bake-sale-app)

# 2. Subí los archivos
cd bake-sale-app
git init
git add .
git commit -m "Bake Sale App - Sábado 16 de Mayo"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/bake-sale-app.git
git push -u origin main

# 3. En GitHub.com:
#    Settings → Pages → Source: main branch → Save

# 4. Tu app estará en:
#    https://tuusuario.github.io/bake-sale-app
```

---

## 📋 Checklist Final antes del Evento

- [ ] Revisar y ajustar los precios en `menu-data.js`
- [ ] Probar la app en tu celular abriendo el link
- [ ] Enviar el link al grupo de padres por WhatsApp
- [ ] Asegurarte de que la contraseña del dashboard sea segura
- [ ] El día del evento: abrir el dashboard para ver los pedidos
- [ ] Exportar los pedidos antes de cocinar
- [ ] Imprimir el resumen para la cocina

---

## 🔧 Cambiar la contraseña del Dashboard

En `dashboard.html`, buscá esta línea:
```javascript
const DASHBOARD_PASSWORD = "2026";
```
Cambiá `"2026"` por la contraseña que quieras (4 dígitos).

---

## 💡 Tips

- **Sin internet en la escuela?** La app se guarda en caché después de la primera carga. Funciona offline.
- **Querés agregar fotos?** Agregá imágenes en la carpeta y referencialas en `menu-data.js`
- **Querés cambiar colores?** Editá `styles.css` y cambiá `--primary: #D2691E` por el color que quieras