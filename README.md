# Cafecito-POS ☕

**Cafecito-POS** sistema de punto de venta integral, diseñado para optimizar el flujo de ventas en cafeterías. El sistema permite gestionar pedidos de forma ágil, administrar un programa de lealtad de clientes y proteger el acceso mediante un dashboard de sesión para baristas y administrador, teniendo este último acceso a Inventario, Usuarios y Clientes con operaciones CRUD.

---

## 🚀 Características Principales

* **Punto de Venta Interactivo:** Interfaz visual con catálogo de productos y despliegue de información puntual.
* **Gestión de Órdenes:** Carrito de compras con opción para modificar cantidades,  cancelación de venta completa y vinculación con cliente registrado.
* **Programa de Lealtad:** Registro de nuevos clientes y buscador por ID para aplicar beneficios.
* **Seguridad:** Dashboard protegido por login con registro de inicio de sesión del barista.
* **Tickets de Venta:** Generación de comprobantes de pago con cálculo automático de descuentos.

## 🛠️ Stack Tecnológico

* **Frontend:** Angular (Interfaz de usuario y gestión de estado).
* **Backend:** Node.js / Express (API RESTful).
* **Base de Datos:** MongoDB (Persistencia de datos).
* **Autenticación:** JWT (JSON Web Tokens).
* **Deploy:** GithubActions y Docker.

---

## ⚙️ Configuración e Instalación

### 1. Requisitos Previos
* Node.js instalado.
* Instancia de MongoDB (Local o Atlas).

### 2. 💻 Backend
Entra a la carpeta del servidor e instala las dependencias:
```bash
cd backend
npm i

### Ejecución en Modo Desarrollo

```bash
npm run dev
```

### Variables de Entorno

Crear un archivo `.env` en la raíz del backend con la siguiente configuración:

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongo
MONGODB_DB=nombre_de_tu_db
JWT_SECRET=tu_secreto_para_tokens
JWT_REFRESH_SECRET=tu_secreto_para_refresh
FRONT_APP_URL=http://localhost:4200
INITIAL_DATA=true
```

## 🅰️ Frontend (Angular)

### Instalación de Dependencias

Ejecutar en la carpeta del frontend:

```bash
npm i
```

### Ejecución en Modo Desarrollo

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

🚩Página de inicio resguardada con login, para pruebas usar estas credenciales:

-Admin: 
  email@example.com
  qwerty1

-Seller:
  bryan@example.com
  qwerty2
  

### 🎨 Instalación de TailwindCSS

Para una guía completa de instalación, consultar: https://tailwindcss.com/docs/installation/framework-guides/angular

```bash
npm install tailwindcss @tailwindcss/postcss postcss --force
```

Configure PostCSS Plugins
Create a .postcssrc.json file in the root of your project and add the @tailwindcss/postcss plugin to your PostCSS configuration.

```.postcssrc.json
/** 
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Agregar las directivas de Tailwind en `styles.css`:

```css
    @import "tailwindcss";
```

### Extensiones Recomendadas

Para mejorar la experiencia de desarrollo con TailwindCSS, se recomienda instalar la siguiente extensión en VS Code:

**Tailwind CSS IntelliSense**
- Proporciona autocompletado inteligente, resaltado de sintaxis y linting para clases de Tailwind
- Muestra previsualizaciones de los estilos CSS al pasar el cursor sobre las clases
- Valida las clases de Tailwind y sugiere correcciones

---

## Deploy 🚀 (Github Actions 🐙 / Docker 🐋)

NOTA ⚠️ Automatizado para deploy en VPS usando contenedores Docker 🐋

-Generación de Dockerfile (back y front)
-Plantilla de back:

```Dockerfile backend

    FROM (node version)
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    EXPOSE 3000
    CMD [ "npm", "start"]

```
(Dockerfile de front va ligado a Nginx, especificado en archivo ⚙️nginx.conf)

-Generación de .dockerignore:

```.dockerignore

  node_modules
  npm-debug.log
  .git
  .env 

```

-Workflow CI/CD automatizado:

🚩 Se debe crear cuenta en DockerHub e implementar Github Secrets con credenciales y datos sensibles para realizar conección automatizada con el VPS.
-Para más detalles, consultar archivo 📂deploy.yml con variables de entorno requeridos.
