# 🛡️ Escapemaster Admin - Documentación Técnica

> El panel de control Super Admin para el ecosistema Escapemaster.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)

## 📋 Visión General

Escapemaster Admin (también conocido como Escapemaster Manage) es la herramienta de administración interna usada por los dueños de la plataforma para configurar y gestionar el SaaS Escapemaster. Proporciona capacidades de "God Mode" para:

- **Gestionar Organizaciones**: Onboard de nuevos clientes, suspension de cuentas, configuración de límites
- **Registro de Widgets**: Definir el catálogo de widgets de dashboard disponibles
- **Plantillas de Dashboard**: Crear layouts predeterminados para diferentes tipos de negocio
- **Gestión Global de Usuarios**: Supervisar todos los usuarios a través de todos los tenants

## 🏗️ Arquitectura y Stack

Construido sobre el mismo stack moderno que la aplicación web para asegurar consistencia.

### Stack Principal

- **Framework:** Next.js 16 (React 19)
- **Lenguaje:** TypeScript 5.0
- **Styling:** Tailwind CSS v4
- **Iconos:** Lucide React
- **Data Fetching:** Axios
- **Testing:** Vitest (unitarios) + Playwright (E2E)

### Estructura del Proyecto

```
manager-panel-admin/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Login de admin
│   │   ├── dashboard/     # Interfaz principal de admin
│   │   │   ├── organizations/  # Gestión de tenants
│   │   │   ├── widgets/        # Registro de widgets
│   │   │   └── templates/      # Plantillas de dashboard
│   │   └── layout.tsx    # Layout raíz
│   ├── components/
│   │   ├── ui/           # Componentes atómicos
│   │   └── features/     # Componentes complejos de negocio
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilidades
│   ├── services/         # Capa de integración API (endpoints /admin/*)
│   └── types/            # Definiciones TypeScript
├── e2e/                  # Tests end-to-end
└── public/               # Assets estáticos
```

## 🚀 Fases de Desarrollo y Roadmap

### ✅ Fase 1: Fundamentos (Completada)

- [x] Setup del proyecto con Next.js 16 y Tailwind v4
- [x] Shell básico de aplicación (Sidebar, Header)
- [x] Flujo de autenticación (Admin Guard)
- [x] Diseño responsivo

### 🚧 Fase 2: Funcionalidades de Gestión (En Progreso)

- [x] **Rebranding Completo:** Todos los componentes migrados a la marca **Escapemaster**
- [x] **Infraestructura de Tests:** Integración de Vitest para tests unitarios y de integración
- [ ] **CRUD de Organizaciones:** Interfaz para crear, editar y suspender tenants
- [ ] **Registro de Widgets:** Formulario para definir nuevos widgets (JSON schema)
- [ ] **Constructor de Plantillas:** Interfaz para crear layouts de dashboard por defecto
- [ ] **Gestión de Usuarios:** Vista global de todos los usuarios del sistema

### 🔮 Fase 3: Analytics y Billing (Planeado)

- [ ] **Métricas de Plataforma:** Dashboard con MRR total, usuarios activos, rendimiento del sistema
- [ ] **Gestión de Billing:** Integración con Stripe Connect para gestionar suscripciones
- [ ] **Logs de Auditoría:** Timeline cronológico de acciones administrativas para accountability

## 🎨 Diseño y Experiencia de Usuario

### Identidad Visual Distinta

Escapemaster Admin usa una identidad visual diferente de la aplicación web para prevenir confusión:

- **Paleta de Colores:** Verde Bosque y Beige (`#1F6357`, `#E8F5F3`) para transmitir estabilidad y autoridad
- **Layout:** Denso, optimizado para datos, diseñado para monitores de escritorio
- **Componentes:** Uso intensivo de tablas de datos con filtrado avanzado, ordenamiento y acciones en lote

## 🛠️ Setup e Instalación

### 1. Clonar Repositorio

```bash
git clone https://github.com/diegogzt/manager-panel-admin.git
cd manager-panel-admin
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Entorno

Crear `.env.local` y agregar:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ADMIN_SECRET=tu-admin-secret-key
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3001`

## 🧪 Testing

### Tests Unitarios (Vitest)

```bash
# Ejecutar tests
npm run test

# Ejecutar en modo watch
npm run test:watch

# Ejecutar con cobertura
npm run test:coverage
```

### Tests End-to-End (Playwright)

```bash
# Ejecutar tests E2E
npm run test:e2e

# Abrir UI de Playwright
npm run test:e2e:ui
```

## 🔐 Autenticación y Seguridad

### Separación Física

Escapemaster Admin es una aplicación Next.js **separada** de la aplicación web. Esta separación física asegura:

- **Aislamiento de Seguridad:** Las rutas de admin ni siquiera están en el bundle cliente
- **Flujos de Auth Distintos:** Escapemaster Admin usa un guard de autenticación separado
- **Acceso API Dedicado:** Escapemaster Admin interactúa con endpoints privilegiados `/admin/*` que son inaccesibles para usuarios estándar

### Protectores de Rutas

```typescript
// src/hooks/useAdminAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si usuario tiene permisos de admin
    const token = localStorage.getItem('admin_token');
    const hasAdminAccess = verifyAdminPermissions(token);

    if (!hasAdminAccess) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return isAuthenticated;
}

// Uso en página protegida
import { useAdminAuth } from '@/hooks/useAdminAuth';

export function AdminDashboard() {
  const isAuthenticated = useAdminAuth();

  if (!isAuthenticated) {
    return <Spinner />;
  }

  return <DashboardContent />;
}
```

## 📊 Funcionalidades Principales

### 1. Gestión del Ciclo de Vida de Organizaciones

Este módulo maneja el ciclo de vida end-to-end de un cliente (Escape Room):

#### Onboarding

1. Asistente simplificado para crear entidad de tenant
2. Configurar perfil de organización
3. Configurar plan de suscripción inicial (Free, Pro, Enterprise)
4. Generar `invitation_code` único

#### Configuración

- Habilitar/deshabilitar módulos específicos (ej. desactivar TPV para un B&B)
- Establecer límites (max usuarios, max salas)
- Configurar dominios personalizados (Enterprise)

#### Suspensión/Terminación

- "Kill Switch" de un clic para suspender acceso por no pago o violación de política

### 2. Gestión Avanzada de Usuarios y Roles

Escapemaster Admin proporciona una vista transversal de organizaciones de todos los usuarios:

#### Búsqueda Global de Usuarios

- Encontrar cualquier usuario en cualquier organización por email o nombre
- Ver historial del usuario
- Acciones rápidas (bloquear, restablecer contraseña)

#### Inyección en Organizaciones

- Administradores pueden inyectarse en cualquier organización para dar soporte (Impersonación)
- Permite debugging de problemas desde la perspectiva del cliente

#### Editor de Matriz de Permisos

- Interfaz visual para definir qué puede hacer cada Rol
- **Granularidad:** Control de acceso a nivel de botón
- **Herencia:** Definir roles base que las organizaciones pueden extender

### 3. Salud del Sistema y Analytics (Dashboard)

#### Métricas en Tiempo Real

- Organizaciones activas totales
- Ingresos mensuales recurrentes (MRR)
- Carga del sistema y latencia de API
- Tasa de conversión de onboarding

#### Logs de Auditoría

- Timeline cronológico de todas las acciones críticas en el sistema para accountability
- Filtro por: usuario, acción, rango de fechas, organización

## 📁 Estructura de Rutas

```
src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx
├── dashboard/
│   ├── page.tsx        # Dashboard principal
│   ├── organizations/
│   │   ├── page.tsx    # Lista de todas las orgs
│   │   ├── [id]/
│   │   │   ├── page.tsx  # Detalles de org
│   │   │   ├── users/     # Usuarios de org
│   │   │   └── settings/  # Configuración de org
│   │   └── new/
│   │       └── page.tsx  # Crear nueva org
│   ├── widgets/
│   │   ├── page.tsx    # Lista de widgets disponibles
│   │   └── [id]/
│   │       └── page.tsx  # Detalles/configurar widget
│   └── templates/
│       ├── page.tsx    # Lista de plantillas
│       └── [id]/
│           └── page.tsx  # Detalles/configurar plantilla
└── layout.tsx
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Compilar para producción
npm start           # Iniciar aplicación compilada

# Testing
npm run test         # Ejecutar tests unitarios
npm run test:watch   # Ejecutar tests en modo watch
npm run test:e2e     # Ejecutar tests end-to-end

# Linting
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Arreglar automáticamente problemas de lint

# Formating
npm run format       # Formatear código con Prettier
```

## 🚀 Despliegue

### Vercel/Netlify

Optimizado para edge deployment en Vercel o Netlify.

### Variables de Entorno en Producción

Configurar en plataforma de hosting:
- `NEXT_PUBLIC_API_URL` → URL de API de producción
- `NEXT_PUBLIC_ADMIN_SECRET` → Clave secreta para autenticación admin

## 🔌 Integración de API

Escapemaster Admin interactúa con endpoints privilegiados del backend API:

```typescript
// src/services/adminApi.ts
import axios from 'axios';

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Secret': process.env.NEXT_PUBLIC_ADMIN_SECRET,
  },
});

// Ejemplos de endpoints admin
adminApi.get('/admin/organizations')  // Listar todas las orgs
adminApi.post('/admin/organizations', data)  // Crear nueva org
adminApi.patch('/admin/organizations/:id/status', { status: 'suspended' })  // Suspender org
adminApi.get('/admin/organizations/:id/users')  // Usuarios de una org
```

## 📊 Métricas del Proyecto

- **Páginas:** 15+
- **Componentes:** 50+
- **Líneas de código:** ~8,000
- **Tests:** ~30 (unitarios + E2E)
- **Cobertura:** ~60%

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing`)
3. Commit cambios (`git commit -m 'Add: amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Abre un Pull Request

## 🐛 Reportar Issues

Para reportar bugs o sugerir mejoras:
- GitHub Issues: https://github.com/diegogzt/manager-panel-admin/issues
- Contacto: admin@escapemaster.es

## 📚 Documentación Adicional

Para documentación completa del sistema, ver:
- [Docs Escapemaster](../../docs/README.md) - Documentación centralizada
- [Contexto para IA](../../docs/03-contexto-ia/) - Guía para desarrolladores
- [Backend API](../../manager/api/docs/) - Documentación de la API (endpoints /admin/*)
- [Escapemaster Web](../web/docs/) - Documentación de la app web

---

**Última actualización:** 4 de febrero de 2026
