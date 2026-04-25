# GEMINI.md - AI Context Anchor

This file provides the structural and behavioral "anchor" for AI agents collaborating on the **Small Shop Management App**.

## 🏗 Project Identity
- **Repository:** https://github.com/TanNguyen120/small-shop-management-app
- **Domain:** Retail, Inventory Management, and Shop Operations.

## 🛠 Tech Stack & Patterns
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase (via `@supabase/ssr` and `@supabase/supabase-js`)
- **State Management:** Zustand (Client-side state)
- **Data Fetching:** TanStack Query (React Query)
- **Form Management:** TanStack Form with Zod validation
- **Data Table:** TanStack Table
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI)
- **Validation:** Zod schemas (located in `type/`)
- **File Handling:** Papaparse (CSV), XLSX (Excel)

## 🧠 Strategic Instructions (The Anchor)
When working on this project, Gemini must strictly enforce these modern best practices:

### 1. Architecture & Security
- **Server Actions for Mutations:** NEVER perform database mutations (INSERT, UPDATE, DELETE) directly from the client using the Supabase client. Always use **Server Actions** (`'use server'`) in `app/actions/` to ensure security, validation, and consistent execution.
- **Strict Input Validation:** Every Server Action MUST validate its input using the corresponding **Zod schema** from `type/` before proceeding with any logic.
- **RSC by Default:** Keep components as Server Components by default. Only add `'use client'` when browser-only features (hooks, event listeners) are required.
- **Environment Variables:** Access sensitive keys ONLY in Server Components or Server Actions. Use `NEXT_PUBLIC_` only for non-sensitive configuration required by the browser.

### 2. UI & Component Design
- **shadcn/ui Consistency:** Use existing shadcn components from `components/ui/`. DO NOT use raw HTML elements (`input`, `button`, `label`) if a shadcn equivalent exists.
- **Form Integration:** Use **TanStack Form** in conjunction with **shadcn/ui** components for a consistent, accessible, and type-safe form experience.
- **Streaming & UX:** Utilize Next.js `loading.tsx` and React `Suspense` for granular loading states. Avoid full-page spinners; prefer skeletons.
- **Feedback:** Use a toast library (e.g., `sonner` or shadcn `toast`) for user feedback on actions. DO NOT use `alert()`.

### 3. Data Management
- **TanStack Query Factories:** Organize query keys using a factory pattern to avoid magic strings and ensure consistent cache invalidation.
- **Service Layer Isolation:** Database queries should reside in `services/`. Server Actions should call these services.
- **Type Safety:** Maintain 1:1 parity between Zod schemas, TypeScript types, and Supabase table structures.

### 4. Implementation Workflow
1.  **Define Schema:** Update `type/product.ts` if data structure changes.
2.  **Implement Service:** Add or update logic in `services/`.
3.  **Create Action:** Implement the Server Action with Zod validation.
4.  **Build UI:** Use TanStack Form + shadcn/ui to build the interactive layer.
5.  **Invalidate Cache:** Ensure Server Actions call `revalidatePath` or `revalidateTag` where appropriate, or trigger TanStack Query invalidation.

---
*Updated to enforce modern Next.js 15 and TanStack best practices*
