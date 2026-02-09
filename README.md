# 🛡️ Escapemaster Panel Admin

> The Super Admin Control Plane for the Escapemaster Ecosystem.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue)](https://tailwindcss.com)

## 🎯 Purpose

Escapemaster Admin is the internal administration tool used by platform owners to configure and manage the Escapemaster SaaS. It provides "God Mode" capabilities to:

- **Manage Organizations**: Onboard new clients, suspend accounts, configure limits.
- **Widget Registry**: Define the catalog of available dashboard widgets.
- **Dashboard Templates**: Create default layouts for different business types (e.g., "Escape Room", "Hotel").
- **Global User Management**: Oversee all users across all tenants.

## 🏗️ Architecture & Stack

Built on the same modern stack as the client-facing web app to ensure consistency and code sharing.

### Core Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Data Fetching:** Axios

## 📂 Project Structure

```
manager/panel-admin/
├── app/
│   ├── (auth)/           # Admin Login
│   ├── dashboard/        # Main Admin Interface
│   │   ├── organizations/# Tenant Management
│   │   ├── widgets/      # Widget Registry
│   │   └── templates/    # Layout Templates
│   └── layout.tsx        # Root Layout
├── components/           # Shared UI Components
├── services/             # API Service Layer
└── utils/                # Helper functions
```

## 🚀 Development Phases & Roadmap

### ✅ Phase 1: Foundation (Completed)
- [x] Project setup with Next.js 16 & Tailwind v4.
- [x] Basic App Shell (Sidebar, Header).
- [x] Authentication flow (Admin Guard).

### 🚧 Phase 2: Management Features (In Progress)
- [x] **Full Rebranding:** Migrated all components and branding to Escapemaster.
- [x] **Testing Infrastructure:** Integrated Vitest for unit and integration testing.
- [ ] **Organization CRUD:** Interface to create, edit, and suspend tenant organizations.
- [ ] **Widget Registry:** Form to define new widgets (JSON schema definition).
- [ ] **Template Builder:** Interface to construct default dashboard layouts.

### 🔮 Phase 3: Analytics & Billing (Planned)
- [ ] **Platform Analytics:** Global metrics (Total MRR, Active Users).
- [ ] **Billing Management:** Stripe subscription oversight.

## 🛠️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/diegogzt/manager-panel-admin.git
   cd manager-panel-admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create `.env.local` and add:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
