# Gestión de Proyectos - Dashboard

Aplicación web para la gestión y seguimiento de proyectos, desarrollada con Next.js y TypeScript. Permite crear, editar,
eliminar y visualizar proyectos con estadísticas en tiempo real.

## Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Git

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/JavieloDev/gestion_de_proyectos.git
cd gestion_de_proyectos

# Instalar dependencias
npm install
# o
yarn install

# Ejecutar en desarrollo
npm run dev
# o
yarn dev
``` 

## Distribución de rutas
```markdown

├── app/                   
│   ├── (dashboard)/        # Sección principal con navbar
│   │   ├── projects/       # Gestión de proyectos
│   │   │   ├── [id]/       # Detalle de proyecto
│   │   │   │   └── edit/   # Editar proyecto
│   │   │   └── new/        # Crear proyecto
│   │   └── error.tsx       # Componete para manejar errores del Dashboard
│   │   └── loading.tsx     # Componete para manejar la carga de datos del Dashboard
│   │   └── layout.tsx      # Layout del Dashboard principal
│   │   └── page.tsx        # Dashboard principal
│   └── layout.tsx          # Layout raíz
├── components/             # Componentes reutilizables
│   ├── error.tsx           # Componente error generico
│   ├── loading.tsx         # Componente loading generico
│   ├── navbar.tsx          # Barra de navegacion superior
│   ├── project-card.tsx    # Card de proyectos
│   ├── project-form.tsx    # Formulario CRUD
│   ├── remove-modal.tsx    # Eliminar proyecto
│   └── search-filter.tsx   # Filtro de proyectos
├── hooks/                  # Custom hooks
│   └── use-project.ts      # Lógica de proyectos con localStorage
├── lib/                    # Utilidades y tipos
│   ├── types.ts            # Interfaces TypeScript
│   └── data.mock.ts        # Datos de ejemplo
└── public/                 # Archivos estáticos
``` 
## Scripts disponibles
```bash
npm run dev	    #Modo desarrollo con hot reload
npm run build	    #Construcción para producción
npm start	    #Ejecutar en producción
npm run lint	    #Ejecutar linter
``` 

