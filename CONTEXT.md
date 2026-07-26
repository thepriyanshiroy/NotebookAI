# NotebookAI Project Context

This file is working memory for future Codex sessions. It summarizes the current project shape so we can move faster without re-reading the whole repo.

## Project Purpose

NotebookAI is an AI-powered student workspace. Users can sign up, create notebooks, write rich-text notes inside notebook sections, upload saved PDFs, preview PDFs, and generate cached AI summaries for study.

## Stack

- Frontend: React 19, Vite, React Router DOM v7
- Styling: Tailwind CSS plus a lot of inline React styles and global CSS media queries
- Forms: React Hook Form with Zod validation
- Auth/data/storage: Supabase JS client
- Editor: Tiptap with StarterKit, Placeholder, and Underline
- PDF text extraction/render support: pdfjs-dist
- AI: Google Gemini 2.5 Flash through a serverless proxy
- Tooling: ESLint, Prettier, Husky, lint-staged

## Important Commands

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run lint` - ESLint
- `npm run test` - placeholder only, prints "No tests yet"

## Environment

Required local/prod env vars:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY` or `GEMINI_API_KEY` for the serverless function

Do not expose private AI keys in client code. The current app calls `/api/gemini`, which is handled by `api/gemini.js` in production.

## Routing

Routes are defined in `src/App.jsx`.

- `/` -> `LandingPage`
- `/login` -> `LoginPage`
- `/signup` -> `SignupPage`
- `/forgot-password` -> `ForgotPasswordPage`
- `/reset-password` -> `ResetPasswordPage`
- `/dashboard` -> protected `DashboardPage` overview
- `/notebooks` -> protected `NotebookDashboard` notebook library
- `/notebook/:id` -> protected `NotebookEditor`
- `/saved` -> protected `SavedPage`
- `/summaries` -> protected `SummariesPage`
- catch-all redirects to `/login`

Auth guarding is handled by `src/components/layout/ProtectedRoute.jsx`.

## Data Model Expectations

The frontend expects these Supabase resources:

- `notebooks`: notebook metadata such as `id`, `user_id`, `title`, `subject`, `icon_color`, `emoji`, `updated_at`
- `sections`: notebook pages with `id`, `notebook_id`, `user_id`, `title`, `content`, `position`, `updated_at`
- `saved_pdfs`: uploaded PDF rows with `id`, `user_id`, `name`, `storage_path`, `size_bytes`, `summary`, `created_at`
- Storage bucket: `pdfs`

Row Level Security is expected to restrict records/files to the owning user.

## Auth Flow

- Supabase client is in `src/lib/supabase.js`.
- `src/context/AuthContext.jsx` owns `user`, `session`, `loading`, and auth helpers.
- Auth provider calls `supabase.auth.getSession()` on mount, listens to `onAuthStateChange`, and exposes:
  - `signUp`
  - `signIn`
  - `signOut`
  - `resetPasswordForEmail`
  - `updatePassword`
- Login/signup/reset pages use React Hook Form and Zod. Password minimum is 12 chars on signup/reset.

## App Layout and UI Style

Authenticated pages use `src/components/layout/AppLayout.jsx`.

- Shared background image: `src/assets/background.jpg`
- Top nav: `src/components/dashboard/Navbar.jsx`
- Sidebar: `src/components/dashboard/Sidebar.jsx`
- Visual language: dark glassmorphism, cyan primary accents, pink/orange/teal secondary accents, Syne headings, DM Sans body
- Responsive shell is now CSS-first in `src/index.css`: desktop/laptop sidebar, compact topbar, mobile bottom navigation, independent `app-main` page scroll regions.
- Key breakpoints: desktop at 1280+, compact rail at 1024-1279, tablet below 1024, mobile bottom nav below 768, extra narrow tuning below 430.

Note: Several existing files contain mojibake where emoji/symbols were saved or rendered incorrectly. Prefer ASCII in new docs unless intentionally fixing those files.

## Notebook Dashboard

Main file: `src/pages/DashboardPage.jsx`

Responsibilities:

- Loads notebooks with `getNotebooks()` and recent PDFs from `saved_pdfs`
- Shows compact statistics, recent notebooks, recent PDFs, and quick actions
- Does not render the full notebook list; full library lives at `/notebooks`

## Notebook Library

Main file: `src/pages/NotebookDashboard.jsx`

Responsibilities:

- Dedicated notebook screen for search, create, delete, and opening notebooks
- Uses `NewNotebookModal` for creation
- Uses compact responsive cards through `NotebookCard`

Reusable components:

- `NotebookCard.jsx`: opens `/notebook/:id`, displays color/icon/section count/time ago, includes labelled delete button when `onDelete` is provided
- `NewNotebookModal.jsx`: collects title, subject, emoji, accent color, then calls `onAdd`

## Notebook Editor

Main file: `src/pages/NotebookEditor.jsx`

Responsibilities:

- Loads selected notebook and its sections directly from Supabase
- Maintains local `sections`, `activeId`, `saved`, `error`, and loading state
- Adds sections with `notebook_id`, `user_id`, title, empty content, and position
- Deletes sections
- Renames sections
- Saves title/content changes manually and via autosave

Autosave:

- `triggerAutosave` stores the pending section update in `pendingSaveRef`
- Save is debounced by 1.5 seconds through `saveTimerRef`
- `commitSave` updates the `sections` row
- Cleanup attempts to save pending changes when the editor unmounts

Editor components:

- `SectionsPanel.jsx`: left section list, active selection, double-click rename, delete, add section
- `EditorPanel.jsx`: section title input, word/character count, empty state
- `RichTextEditor.jsx`: Tiptap editor and formatting menu

## Saved PDFs and AI Summary Flow

Main file: `src/pages/SavedPage.jsx`

PDF upload:

- Creates a hidden file input accepting `.pdf`
- Uploads file to Supabase Storage bucket `pdfs`
- Path format: `${user.id}/${Date.now()}_${file.name}`
- Inserts metadata into `saved_pdfs`

Preview:

- Generates a signed URL valid for 3600 seconds
- Displays the PDF in `PdfPreview.jsx` using an iframe

AI summary:

- Creates a signed URL
- Uses pdfjs-dist with worker from `pdfjs-dist/build/pdf.worker.min.mjs?url`
- Extracts text from up to the first 10 pages
- Sends text to `/api/gemini` with the Supabase bearer token
- Uses `fetchWithRetry` for transient failures
- Summary prompt asks for overview, key points, details, examples, final takeaway
- Caches generated summary back to `saved_pdfs.summary`
- If the PDF has more than 10 pages, prepends a markdown note saying only the first 10 pages were analyzed

Summary UI:

- `PdfList.jsx` and `PdfRow.jsx`: list/upload/preview/summarize/delete PDFs
- `PdfPreview.jsx`: preview pane, AI summary button, close controls
- `AiSummaryPanel.jsx`: loading shimmer, lightweight markdown-ish display for `**bold**` and quote-style notes

## AI Summaries

Main file: `src/pages/SummariesPage.jsx`

- Dedicated summary review screen backed by `saved_pdfs.summary`
- Supports searching PDF names and summary text
- Displays generated summary previews without requiring users to reopen each PDF

## Serverless Gemini Proxy

File: `api/gemini.js`

- Accepts only POST
- Reads Gemini key from `VITE_GEMINI_API_KEY` or `GEMINI_API_KEY`
- Reads Supabase URL/anon key from Vite or non-Vite env var names
- Requires `Authorization` header
- If Supabase env vars are present, validates the bearer token by calling `${SUPABASE_URL}/auth/v1/user`
- Proxies request body to Gemini generateContent endpoint for `gemini-2.5-flash`
- Returns Gemini JSON or upstream error status

Local Vite config currently proxies `/api/gemini` directly to Gemini in `vite.config.js`, rewriting the path with `VITE_GEMINI_API_KEY`. That means local dev behavior differs from production serverless auth validation unless adjusted.

## Database Helper Module

File: `src/lib/database.js`

Exports:

- `getNotebooks`
- `createNotebook`
- `deleteNotebook`
- `updateNotebook`
- `getSections`
- `createSection`
- `updateSection`
- `deleteSection`

Some pages use these helpers, while `NotebookEditor.jsx` and `SavedPage.jsx` also call Supabase directly. Keep this mixed style in mind before refactoring.

## Known Rough Edges / Watch Points

- `CONTEXT.md` existed in git and was deleted before this file was created. This new lowercase `context.md` is the current project memory requested by the user.
- `src/components/editor/EditorTopbar.jsx`, `src/App.css`, and `src/assets/logo.png` appear unused by current routing/imports.
- README and several JSX comments/text literals show mojibake for emoji/symbols.
- `src/lib/database.js` uses decorative non-ASCII comment separators that also render as mojibake.
- `NotebookEditor` has an async `commitSave` called during effect cleanup; React will not wait for it during unload/navigation.
- `createSection` in `src/lib/database.js` does not include `user_id`, while `NotebookEditor.jsx` direct insert does include `user_id`.
- Local `/api/gemini` Vite proxy bypasses the `api/gemini.js` token validation used on Vercel.
- No real automated tests exist yet.

## Development Guidance

- Prefer existing inline-style/component patterns unless doing a focused UI cleanup.
- Check responsive behavior after layout changes, especially below `768px`.
- For Supabase work, verify table/bucket assumptions and RLS implications.
- For PDF or Gemini changes, test cached-summary behavior and unsigned/expired URL cases.
- Keep secrets out of docs and client code.
- Run `npm run lint` and `npm run build` after meaningful code changes when feasible.
