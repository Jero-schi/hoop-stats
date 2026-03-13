# 🏀 Hoops Stats

¡Bienvenido a **Hoops Stats**! Una aplicación web moderna y profesional diseñada para entrenadores y analistas de baloncesto. Permite llevar un registro estadístico exhaustivo en tiempo real durante los partidos, gestionar plantillas de jugadores y analizar el rendimiento histórico de tu equipo.

## 🌟 Características Principales

- **Gestión Multi-Tenant:** Cada entrenador tiene su propia cuenta segura. Los datos (equipos, jugadores, partidos) son totalmente privados y están aislados del resto gracias a la Seguridad a Nivel de Fila (RLS) de Supabase.
- **Rastreador en Vivo (Live Stats Tracker):** Una interfaz táctil optimizada para registrar acciones jugada a jugada (Tiros de 2, Triples, Tiros Libres, Rebotes, Asistencias, Tapones, Robos, Pérdidas y Faltas).
- **Gestión de Plantillas:** Crea y edita los perfiles de tus jugadores (Altura, Peso, Posición, Edad y Dorsal). Formularios blindados con validación **Zod** y **React Hook Form**.
- **Análisis de Rendimiento (Dashboard):** Visualiza los líderes estadísticos de tu equipo y métricas globales como el porcentaje de victorias o puntos por partido.
- **Arquitectura Segura:** Tipado estricto con TypeScript, operaciones matemáticas seguras (sin división por cero) para cálculos de porcentajes y promedios.

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Base de Datos & Autenticación:** [Supabase (PostgreSQL)](https://supabase.com/)
- **Validación de Datos:** [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)
- **Testing:** [Jest](https://jestjs.io/) + React Testing Library

## 🚀 Instalación y Despliegue Local

Sigue estos pasos para instalar y correr el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/hoops-stats.git
cd hoops-stats
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase_aqui
```

### 4. Configurar Base de Datos (Supabase)
Ejecuta el script SQL incluido en el archivo `schema.sql` en el panel de SQL Editor de tu proyecto en Supabase. Esto creará las tablas `teams`, `players`, `games` y `game_stats` junto con sus políticas de seguridad RLS (Row Level Security).

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

## 🧪 Testing

Para ejecutar el conjunto de pruebas unitarias y garantizar la integridad de las funciones matemáticas críticas:

```bash
# Correr pruebas una vez
npm test

# Correr pruebas en modo observación (watch)
npm run test:watch
```

## 📦 Construcción para Producción (Vercel)

El proyecto está 100% optimizado para ser desplegado en plataformas como Vercel.

1. Asegúrate de que tu código subido a GitHub esté al día: `npm run build` a nivel local para verificar que compila sin averías.
2. Vincula tu repositorio a Vercel.
3. Importante: ¡No olvides configurar las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`) dentro de la sección **Environment Variables** en Vercel antes de desplegar!

## 🔐 Seguridad (RLS)
La base de datos utiliza políticas extremas de "Row Level Security". Nadie puede leer, escribir o borrar datos si el `user_id` de la celda de Supabase no coincide con la huella digital criptográfica del entrenador que ha iniciado sesión.

---

*Desarrollado con precisión y pasión por el baloncesto.* 🏀
