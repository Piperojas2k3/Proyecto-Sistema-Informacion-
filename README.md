/LuciApp-Proyecto
├── /db
│   └── schema.sql           # Tu script SQL completo (DDL y DML)
├── /backend
│   └── server.ts            # Aquí mueves el server.ts (el que usa PostgreSQL)
├── /docs
│   ├── Bitácora de Prompts.pdf
│   ├── Informe Ejecutivo-Caso 04.pdf
│   ├── Link_App.txt         # Opcional: enlace a Stitch
│   └── Prototipo.txt        # Opcional: enlace a Prototipo
├── /frontend
│   ├── /src                 # Código del Frontend (Componentes React, utilidades, hooks, estilos)
│   ├── index.html
│   ├── package.json         # Dependencias y scripts del proyecto integrados
│   ├── tsconfig.json        # Configuración de TypeScript
│   ├── vite.config.ts       # Configuración de Vite
└── └── .env.example

# Proyecto Full-Stack (React + Express)

Este repositorio contiene una aplicación web Full-Stack integrada en un único proyecto. Utiliza **Vite** para el Frontend (React + TypeScript) y **Express.js** para el Backend (Node.js + TypeScript).

A diferencia de los entornos más tradicionales que dividen el proyecto en dos carpetas totalmente separadas (`frontend/` y `backend/`), esta arquitectura unifica todo en la misma raíz para facilitar el desarrollo, el manejo de dependencias y el despliegue.

Durante la fase de desarrollo, el servidor de Express integra la funcionalidad de Vite (como Middleware) para servir el Frontend en tiempo real. En producción, Express se encarga de servir los archivos estáticos previamente compilados.

## 📁 Estructura del Proyecto

```text
/LuciApp-Proyecto
├── /db
│   └── schema.sql           # Tu script SQL completo (DDL y DML)
├── /backend
│   └── server.ts            # Aquí mueves el server.ts (el que usa PostgreSQL)
├── /docs
│   ├── Bitácora de Prompts.pdf
│   ├── Informe Ejecutivo-Caso 04.pdf
│   ├── Link_App.txt         # Opcional: enlace a Stitch
│   ├── Prototipo.txt        # Opcional: enlace a Prototipo
│   └── Link_Video           # Opcional: enlace a Video sobre LuciaApp
├── /frontend
│   ├── /src                 # Código del Frontend (Componentes React, utilidades, hooks, estilos)
│   ├── index.html
│   ├── package.json         # Dependencias y scripts del proyecto integrados
│   ├── tsconfig.json        # Configuración de TypeScript
│   ├── vite.config.ts       # Configuración de Vite
└── └── .env.example

```

## 💻 Tecnologías Utilizadas

*   **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (estilos).
*   **Backend:** Node.js, Express, TypeScript.
*   **Herramientas CLI:** `tsx` (para ejecutar TypeScript del lado del servidor sin compilar en desarrollo).

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para correr el proyecto en tu entorno local:

1. Instalar las dependencias usando `npm`:
   ```bash
   npm install
   ```

2. Configurar las variables de entorno basándote en el ejemplo. Crea un archivo `.env` en la raíz y agrega los valores requeridos:
   ```bash
   cp .env.example .env
   ```

3. Iniciar el servidor de desarrollo unificado (Frontend y Backend inician juntos):
   ```bash
   npm run dev
   ```

Tanto la interfaz web como tu API backend estarán disponibles y escuchando en http://localhost:3000. 

## 📦 Scripts Disponibles (`package.json`)

*   `npm run dev`: Arranca el servidor Express mediante `tsx`. Este levanta las rutas del backend y a su vez inyecta Vite como middleware para el Hot Module Replacement (HMR) del frontend.
*   `npm run build`: Ejecuta ambas transpilaciones, crea la carpeta estática `dist` con el Frontend React y empaqueta el archivo `server.ts` de backend en un archivo compatible con producción (generalmente `.cjs`).
*   `npm run start`: Arranca únicamente el backend optimizado para **producción** utilizando Node estándar (`node dist/server.cjs`).
*   `npm run lint`: Analiza y verifica errores de sintaxis en el código.
