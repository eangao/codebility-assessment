
● Implementation Plan: Fullstack Todo App — Multi-Session Strategy

  Context                                                                                                                                                                   
  The fullstack todo app (Next.js 16 + NextAuth v5 + Prisma + SQLite) is too large for a single context window, especially with TDD. Breaking into 4 focused sessions         prevents context exhaustion and keeps each session productive.

  Strategy: 4 Sessions, Each Self-Contained

  Each session starts fresh with /clear, references CLAUDE.md for specs, and ends with a working state.

  ---
  Session 1: Scaffolding + Database + Auth Backend

  Goal: Project boots, Prisma works, auth API routes functional

  1. Scaffold Next.js 16 in /fullstack/ (no src/ dir)
  2. Install all dependencies (next-auth@5, bcryptjs, prisma, lucide-react)
  3. Create prisma/schema.prisma (User + Todo models per CLAUDE.md)
  4. npx prisma generate && npx prisma db push
  5. Create .env + .env.example
  6. Create lib/prisma.ts (singleton)
  7. Create lib/auth.ts (NextAuth config with credentials + callbacks)
  8. Create app/api/auth/[...nextauth]/route.ts
  9. Create app/api/register/route.ts (POST with bcrypt)
  10. Create middleware.ts (protect /todos)
  11. Create types/index.ts (shared types)
  12. Create lib/utils.ts (cn utility)
  13. Create minimal app/layout.tsx + app/page.tsx (just enough to boot)
  14. Verify: npm run dev starts, npx tsc --noEmit passes

  Exit criteria: Dev server boots, Prisma schema pushed, auth routes exist. Commit.

  ---
  Session 2: Todo API Routes (TDD Focus)

  Goal: All todo CRUD API routes working with tests

  1. TDD: GET /api/todos — test → implement app/api/todos/route.ts GET
  2. TDD: POST /api/todos — test → implement POST handler
  3. TDD: PATCH /api/todos/[id] — test → implement app/api/todos/[id]/route.ts PATCH
  4. TDD: DELETE /api/todos/[id] — test → implement DELETE handler
  5. Test ownership isolation (user A can't see user B's todos)
  6. Test input validation (empty title, missing fields)
  7. Test auth enforcement (401 without session)
  8. Verify: all tests pass, npx tsc --noEmit passes

  Exit criteria: All API routes work, ownership verified, tests pass. Commit.

  ---
  Session 3: Auth UI + Shared Components

  Goal: Sign-in, sign-up pages working with shadcn/ui

  1. Install shadcn/ui components: button input card checkbox badge label separator skeleton toast
  2. Create components/Providers.tsx (SessionProvider wrapper)
  3. Update app/layout.tsx with Providers
  4. Create components/AuthForm.tsx (reusable form)
  5. Create app/auth/signin/page.tsx
  6. Create app/auth/signup/page.tsx
  7. Create components/Navbar.tsx (app bar + sign out)
  8. Verify: can sign up, sign in, sign out — full auth flow works

  Exit criteria: Auth UI complete, full sign-up → sign-in → sign-out flow works. Commit.

  ---
  Session 4: Todo UI + Seed + Polish + README

  Goal: Complete working app, polished UI, ready for PR

  1. Create components/TodoItem.tsx (checkbox, title, date, badge, delete)
  2. Create components/TodoList.tsx (list + empty state)
  3. Create components/CreateTodo.tsx (input + add button)
  4. Create app/todos/page.tsx (protected, fetches todos, CRUD handlers)
  5. Update app/page.tsx (redirect logic)
  6. Create prisma/seed.ts (demo user + sample todos)
  7. Polish app/globals.css
  8. Verify responsive design (mobile + desktop)
  9. Run npm run build — must pass zero errors
  10. Create README.md
  11. Final PR checklist from CLAUDE.md

  Exit criteria: npm run build passes, full flow works, PR-ready. Commit.

  ---
  TDD Approach

  Use /everything-claude-code:tdd within Sessions 2-4. Session 1 is scaffolding (no logic to test).

  Context Management Tips

  - /clear at the start of each session
  - CLAUDE.md is always auto-loaded — no need to re-read specs
  - Don't re-read files you just wrote
  - Commit at end of each session to save progress
  - Use subagents for code review after implementation

  Verification

  - After each session: npx tsc --noEmit + npm run dev
  - After Session 4: npm run build + full manual test
  - PR checklist from CLAUDE.md as final gate




 Session 1 Complete. Here's what was accomplished:
  ┌───────────────────────────────────────────────────────────────────────────────────────┬────────┐                                                                          │                                         Step                                          │ Status │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Scaffold Next.js 16 (Turbopack, App Router, TS, Tailwind)                             │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Install deps (next-auth@beta, bcryptjs, prisma@6, lucide-react, clsx, tailwind-merge) │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Create .env + .env.example                                                            │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Create prisma/schema.prisma (User + Todo models)                                      │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ npx prisma generate && npx prisma db push                                             │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Create lib/prisma.ts (singleton)                                                      │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Create lib/auth.ts (NextAuth v5 credentials + JWT + callbacks)                        │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Create lib/utils.ts (cn utility)                                                      │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Create types/index.ts (SafeUser, TodoItem, ApiResponse types)                         │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Create app/api/auth/[...nextauth]/route.ts                                            │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Create app/api/register/route.ts (POST with validation + bcrypt)                      │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Create middleware.ts (protect /todos)                                                 │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ Update app/layout.tsx + app/page.tsx                                                  │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ npx tsc --noEmit passes                                                               │ Done   │
  ├───────────────────────────────────────────────────────────────────────────────────────┼────────┤
  │ npm run dev boots successfully                                                        │ Done   │
  └───────────────────────────────────────────────────────────────────────────────────────┴────────┘
  Exit criteria met: Dev server boots, Prisma schema pushed, auth routes exist, type check passes.