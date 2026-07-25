# NotebookAI - Project Documentation

Welcome to **NotebookAI**, a modern, AI-powered student workspace designed to organize notebooks, manage rich-text notes, and leverage Google's Gemini AI to instantly summarize uploaded PDF documents.

This document serves as a comprehensive guide for new developers to understand the architecture, frontend, backend, and core features of the project.

---

## 🏗 Architecture Overview

NotebookAI is a decoupled full-stack application. It uses a **React (Vite)** frontend to handle the sleek, glassmorphic user interface. For the backend, it relies heavily on **Supabase** for Authentication, Database (PostgreSQL), and File Storage. 

To safely communicate with the AI without exposing API keys to the client, the app uses a **Vercel Serverless Function** (`/api/gemini.js`) that acts as a secure proxy between the React frontend and the Google Gemini API.

---

## 🎨 Frontend (Client-Side)

The frontend is built for speed, aesthetics, and a highly responsive user experience.

- **Framework**: React 19 powered by Vite.
- **Routing**: `react-router-dom` for client-side page transitions (e.g., `/login`, `/dashboard`, `/notebook/:id`, `/saved`).
- **Styling**: 
  - **CSS Modules & Global CSS**: Found in `index.css`, used for complex `@keyframes` ambient blob animations, custom scrollbars, and global `@media` queries that ensure the app is 100% mobile responsive.
  - **Tailwind CSS**: Used for rapid utility-class layout structuring on static pages (like Login/Signup).
- **Rich Text Editor**: Uses **Tiptap** (`@tiptap/react`). It includes a custom fixed `MenuBar` component allowing users to format text (Bold, Italic, Underline, Bullet Lists, Headings). It also supports **auto-saving** via a debounced timeout mechanism.
- **PDF Rendering**: Uses `react-pdf` with a custom PDF.js worker setup to natively render uploaded PDF files inside the app. It supports a responsive "Split View" to read the PDF and AI summary simultaneously.

---

## ⚙️ Backend & Infrastructure

Instead of a traditional Node.js/Express server, NotebookAI embraces a BaaS (Backend-as-a-Service) and Serverless architecture.

### 1. Supabase (Database & Auth)
- **Authentication**: Fully managed by Supabase Auth. Includes Login, Signup, and Password Recovery flows. The session state is managed globally via `AuthContext.jsx`.
- **Database**: PostgreSQL database accessed via the Supabase JS Client (`src/lib/supabase.js`).
  - `notebooks`: Stores notebook metadata (title, subject, color).
  - `sections`: Stores the individual rich-text pages that belong to a specific notebook.
  - `saved_pdfs`: Stores references to uploaded PDFs and caches the generated AI summaries so they don't need to be regenerated.
- **Storage**: Supabase Storage buckets are used to securely host the uploaded PDF files.

### 2. Vercel Serverless API (`/api/gemini.js`)
- **Purpose**: Hides the `VITE_GEMINI_API_KEY`. Never expose AI API keys on the frontend!
- **Security Check**: Before fulfilling an AI request, this endpoint extracts the user's Supabase JWT Auth token from the request headers. It validates this token against the Supabase server. If the token is invalid or missing, the request is rejected (401 Unauthorized), preventing malicious users from draining the Gemini API quota.
- **AI Integration**: If authenticated, it forwards the extracted PDF text to the **Gemini 2.5 Flash API** (`generateContent`), asking it to act as a university professor and generate a comprehensive study guide.

---

## 🚀 Core Features & Workflows

### Notebooks & Sections
1. Users can create a Notebook from the `/dashboard`.
2. Clicking a notebook opens the `NotebookEditor`.
3. Inside the editor, users can create infinite "Sections" (pages) within that notebook.
4. As the user types in the Tiptap editor, a React `useRef` timer debounces their keystrokes. After 1.5 seconds of inactivity, it automatically pushes an `UPDATE` request to the Supabase `sections` table.

### PDF AI Summarization
1. **Upload**: User uploads a PDF in the `/saved` tab. It is pushed to Supabase Storage.
2. **Parsing**: When the user clicks "AI Summary", the app uses `pdfjs-dist` to silently parse through the pages of the PDF, extracting raw text up to a limit of 150,000 characters (approx. 10+ pages of dense text).
3. **Proxy Request**: The extracted text is sent via POST request to `/api/gemini.js`, along with the user's Auth Token.
4. **Result**: Gemini processes the text, returns a markdown-formatted summary, and the frontend caches this summary in the `saved_pdfs` Supabase table.
5. **Split View**: The UI divides, showing the physical PDF document on one side and the interactive, scrollable AI summary on the other.

---

## 🌍 Environment Variables

For this project to run locally or in production (Vercel), the following environment variables must be defined in a `.env.local` file (or Vercel dashboard):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

## 📱 Responsiveness

The application is fully responsive. Mobile layouts trigger automatically below `768px`.
- The `AppLayout` sidebar collapses to the top.
- The `NotebookDashboard` grid flows into a 2x2 or 1x1 configuration.
- The `PdfPreview` split-screen switches from a horizontal row to a vertical column, ensuring readability on smartphones.
- Ambient background animations are disabled on mobile to conserve device battery and improve performance.
