# SafeOps AI - Complete Frontend Architecture Report

This report provides a comprehensive, end-to-end overview of the SafeOps AI frontend ecosystem. It documents the architecture, technology stack, routing structure, state management, and all implemented features, serving as the ultimate source of truth for the frontend application.

---

## 1. Technology Stack

The application is an Enterprise-grade React application built with modern standards:
- **Core Framework**: React 19
- **Build Tool**: Vite (Lightning fast HMR and builds)
- **Routing**: React Router DOM v7 (Component-based routing architecture)
- **Styling**: Tailwind CSS v4 + PostCSS (Utility-first styling with custom CSS tokens)
- **Data Fetching & Caching**: TanStack React Query v5
- **Form Handling**: React Hook Form with Zod (Schema-based validation)
- **UI Components**: Headless custom components inspired by Radix/shadcn, animated with Framer Motion, utilizing Lucide React for iconography.
- **HTTP Client**: Axios with centralized interceptors.
- **Tables**: TanStack React Table v8 (Headless server-side pagination and sorting).

---

## 2. Directory Architecture

The `src/` directory is strictly organized into domain-driven layers to maintain scalability:

- **`components/ui/`**: Reusable, pure presentational UI components (`Button`, `Input`, `Card`, `DataTable`, `PageTransition`).
- **`hooks/`**: Custom React hooks wrapping TanStack Query for domain-specific data fetching (`useAuthQueries.js`, `useAdmin.js`, `useAnalysis.js`).
- **`layouts/`**: Structural wrappers that provide persistent UI across route groups (`LandingLayout`, `AuthLayout`, `DashboardLayout`).
- **`pages/`**: View-level components that represent full screen routes (lazy loaded).
- **`providers/`**: React Context providers for global state (`AuthProvider`, `ThemeProvider`).
- **`routes/`**: Security wrappers that protect routes (`ProtectedRoute`, `RoleGuard`, `AdminRoute`).
- **`services/`**: The pure JavaScript abstraction layer. 
  - `api/*.api.js`: Defines Axios calls mapping exactly to Spring Boot endpoints.
  - `*Service.js`: Business logic wrappers (e.g., `AuthService`).
- **`validation/`**: Zod schemas used across the app to validate forms before submission.

---

## 3. Routing & Security System

All routes are defined in `App.jsx` using `AnimatePresence` and `Suspense` for page transition animations and code splitting.

### Public Routes (Wrapped in `LandingLayout`)
These feature the top public navbar and footer.
- `/` - Landing Home
- `/features`, `/solutions`, `/pricing`, `/about`, `/contact`, `/privacy-policy`

### Authentication Routes (Wrapped in `AuthLayout`)
These feature secure, centered card layouts.
- `/login` - User login
- `/register` - Account creation

### Protected Routes (Wrapped in `DashboardLayout` & `ProtectedRoute`)
Users must have a valid JWT session to access these. The `DashboardLayout` provides the side navigation and top header.
- `/dashboard` - Main metrics and overview
- `/analysis` - AI Analysis job submission and polling
- `/sensors` - Real-time sensor monitoring
- `/permits` - Active permits and conflict detection
- `/profile` - User profile
- `/settings` - UI Settings (Theme, Security, Notifications)

### Admin Routes (Wrapped in `RoleGuard(ADMIN)`)
- `/admin` - Admin Console (User management, system logs, metrics)

---

## 4. State Management & Data Flow

Instead of a bulky Redux store, state is managed dynamically:

1. **Global UI State**: Handled via Context API (`ThemeProvider` for Dark/Light mode, `AuthProvider` for current user session).
2. **Server State**: Exclusively managed by **TanStack React Query**.
   - API responses are cached, background-refetched, and synchronized without manual `useEffect` loops.
   - Example: `useAdminUsers()` automatically fetches users, manages loading states, and triggers refetches when pagination changes.
3. **Form State**: Managed locally by `react-hook-form` to prevent unnecessary re-renders during typing, ensuring high performance.

---

## 5. Authentication & API Interception

The frontend connects to the Spring Boot JWT architecture via `src/services/api/axios.js`.

- **Interceptors**: Every request automatically attaches the `Authorization: Bearer <token>` from Local Storage.
- **Refresh Mechanism**: If an API call fails with a `401 Unauthorized`, the interceptor is designed to catch it, transparently call the `/refresh` endpoint, and retry the original failed request.
- **Auth Provider**: Listens for a custom `authStateChange` browser event to instantly re-render the UI when a user logs in or out across components.

---

## 6. The Demo Mode System (For Testing)

To allow UI testing without the Spring Boot backend running, a **Demo Bypass System** is built directly into `AuthService.js`:

- **Demo Buttons**: `Login.jsx` and `Register.jsx` feature quick-access demo buttons.
- **Logic**: If the username is `demo_user`, it bypasses the API and generates a mock `USER` session.
- **Admin Testing**: If the username contains `admin` (e.g., `demo_admin`), the system grants an `ADMIN` role, instantly unlocking the `/admin` route.
- **Removal**: This system is documented in `demo.md` and can be easily deleted from `AuthService.js` for production deployment.

---

## 7. Core Modules Implemented

### A. The Admin Console (`/admin`)
- Built using `@tanstack/react-table`.
- Implements strict Server-Side pagination. When you click "Next Page", the frontend dynamically updates the `pageIndex` state, which triggers React Query to fetch the exact page from the Spring Boot `/api/v1/admin/users` endpoint.

### B. The Analysis Module (`/analysis`)
- Designed to handle asynchronous AI jobs.
- When you submit an analysis, the backend returns a `jobId`.
- The frontend implements a smart polling mechanism using React Query's `refetchInterval`. It continuously pings `/api/v1/analysis/status/{jobId}` until the backend reports the status as `COMPLETED`, at which point it renders the results.

### C. The Settings Module (`/settings`)
- Implements dynamic theming (Light/Dark/System) that instantly re-paints the application without reloading.
- Contains localized forms for changing passwords and managing account deletion.

---

## 8. Summary

The SafeOps AI frontend is a robust, highly modular React application. It completely avoids legacy patterns (like hash routing or massive Redux stores), heavily utilizes suspense/lazy-loading for performance, and maps 1:1 with the Spring Boot backend REST API.
