# Project Context: NotebookAI

This document provides a comprehensive overview of the `NotebookAI` project structure and stack. It is intended for AI coding assistants to quickly understand the project without needing to explore manually.

## Technology Stack
- **Framework**: React 19 built with Vite
- **Styling**: Tailwind CSS (with PostCSS and Autoprefixer)
- **State Management**: Zustand
- **Routing**: React Router DOM (v7)
- **Backend & Auth**: Supabase
- **Forms & Validation**: React Hook Form, Zod
- **Other libraries**: `pdfjs-dist` (for PDF handling)
- **Linting & Formatting**: ESLint, Prettier, Husky, lint-staged

## Directory Structure

### Configuration Files (Root)
- `package.json` - Project dependencies and scripts.
- `vite.config.js` - Vite configuration.
- `tailwind.config.js` / `postcss.config.js` - Tailwind CSS configuration.
- `eslint.config.js` - ESLint configuration.
- `index.html` - HTML entry point.
- `.env.local` - Local environment variables (e.g., Supabase keys).

### `src/` - Source Code

#### Entry Points
- `src/main.jsx` - Application entry point. Renders `<App />`.
- `src/App.jsx` - Main application component with routing setup.
- `src/index.css` / `src/App.css` - Global styles.

#### `src/pages/` - Route Pages
- `LandingPage.jsx` - The marketing / home landing page.
- `LoginPage.jsx` / `SignupPage.jsx` - Authentication pages.
- `DashboardPage.jsx` / `NotebookDashboard.jsx` - Dashboard views for the authenticated user.
- `NotebookEditor.jsx` - Core editor page for a specific notebook.
- `SavedPage.jsx` - Page for viewing saved resources/PDFs.

#### `src/components/` - Reusable UI Components
- **`dashboard/`**
  - `Navbar.jsx` - Top navigation.
  - `Sidebar.jsx` - Side navigation for the dashboard.
  - `NotebookCard.jsx` - Card component displaying a single notebook.
  - `NewNotebookModal.jsx` - Modal for creating a new notebook.
- **`editor/`**
  - `EditorPanel.jsx` - Main text/content editor component.
  - `EditorTopbar.jsx` - Top bar for the editor (tools/settings).
  - `SectionsPanel.jsx` - Sidebar for navigating or managing sections within a notebook.
- **`layout/`**
  - `AppLayout.jsx` - Main layout wrapper for authenticated views.
  - `ProtectedRoute.jsx` - Higher-order component to protect authenticated routes.
- **`saved/`**
  - `PdfList.jsx`, `PdfRow.jsx` - Components for listing PDF resources.
  - `PdfPreview.jsx` - Component for previewing a selected PDF.
  - `AiSummaryPanel.jsx` - Component for showing AI-generated summaries.

#### `src/lib/` - Third-party Integrations & Services
- `supabase.js` - Supabase client initialization.
- `database.js` - Database interaction functions and utilities.

#### `src/context/` - React Context Providers
- `AuthContext.jsx` - Manages authentication state using Supabase and exposes it to the app.

#### `src/utils/` - Utility Functions
- (Currently empty, reserved for helper functions).

---

## Important Architectural Notes
- **Authentication**: Handled via `AuthContext.jsx` which wraps the app and uses Supabase Auth. Protected routes use `ProtectedRoute.jsx`.
- **Database**: The app connects to Supabase for data persistence. Operations are typically abstracted in `src/lib/database.js`.
