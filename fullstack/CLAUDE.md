# CLAUDE.md — Codebility Fullstack Assessment (3-5 Years)

## Project Overview
A fullstack todo application with user authentication and data persistence. This is a **timed assessment** for a developer collaboration. Clean code, proper architecture, and a polished working product matter more than extra features.

**Assessment Repo**: Fork of `https://github.com/Zeff01/codebility-assessment`
**Branch**: `elmar-angao/fullstack-3-5`
**Directory**: All code goes inside `/fullstack/` directory in the repo root
**Stack**: Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS + shadcn/ui + NextAuth.js v5 + Prisma + SQLite
**No src/ directory** — everything at root level inside `/fullstack/`

## Next.js 16 Specifics
- **Turbopack is the default bundler** — no flags needed. `next dev` and `next build` use it automatically.
- **Config is TypeScript** — `next.config.ts` not `.js`
- **Async `params` and `searchParams`** — must `await` them in dynamic routes: `const { id } = await params`
- **React 19** — stable. No need for `use client` workarounds for server actions.
- Scaffold with: `npx create-next-app@latest . --typescript --tailwind --eslint --app --turbopack --import-alias "@/*"` and select NO for `src/` directory

## What This App Does
1. User registers or signs in (email + password)
2. User sees their personal todo list (only their own todos)
3. User can create, toggle complete, and delete todos
4. Data persists between page refreshes (SQLite via Prisma)
5. Unauthenticated users are redirected to sign-in
6. Clean, responsive UI using shadcn/ui components

## Architecture

```
Frontend (Next.js 16 App Router + Turbopack + shadcn/ui + Tailwind)
  → /api/auth/[...nextauth] (NextAuth.js v5 — credentials provider + bcrypt)
  → /api/register (POST — create new user)
  → /api/todos (GET, POST — session-protected)
  → /api/todos/[id] (PATCH, DELETE — session-protected, ownership-verified)
  → Prisma ORM → SQLite database (local file, zero config)
```

## File Structure

```
fullstack/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          ← NextAuth route handler
│   │   ├── register/
│   │   │   └── route.ts              ← POST — create new user (bcrypt hash)
│   │   └── todos/
│   │       ├── route.ts              ← GET all user todos, POST new todo
│   │       └── [id]/
│   │           └── route.ts          ← PATCH toggle/update, DELETE todo
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx              ← Custom sign-in page
│   │   └── signup/
│   │       └── page.tsx              ← Registration page
│   ├── todos/
│   │   └── page.tsx                  ← Protected todo list page (main UI)
│   ├── layout.tsx                    ← Root layout with Providers
│   ├── page.tsx                      ← Home — redirect to /todos or /auth/signin
│   └── globals.css
├── components/
│   ├── ui/                           ← shadcn/ui components (DO NOT edit manually)
│   ├── AuthForm.tsx                  ← Reusable sign-in / sign-up form
│   ├── TodoItem.tsx                  ← Single todo row (checkbox, text, delete, date)
│   ├── TodoList.tsx                  ← List of todos with empty state
│   ├── CreateTodo.tsx                ← Input + submit for new todo
│   ├── Navbar.tsx                    ← App bar with user email + sign out
│   └── Providers.tsx                 ← SessionProvider wrapper ("use client")
├── lib/
│   ├── auth.ts                       ← NextAuth config (credentials provider, callbacks)
│   ├── prisma.ts                     ← Prisma client singleton
│   └── utils.ts                      ← shadcn cn() utility
├── prisma/
│   ├── schema.prisma                 ← User + Todo models
│   └── seed.ts                       ← Demo user + sample todos
├── types/
│   └── index.ts                      ← Shared TypeScript types
├── middleware.ts                     ← Protect /todos routes
├── .env                              ← NEXTAUTH_SECRET, DATABASE_URL
├── .env.example                      ← Placeholder values for reviewers
├── next.config.ts                    ← TypeScript config (Next.js 16 default)
├── tailwind.config.ts
├── components.json                   ← shadcn/ui config
├── tsconfig.json
└── package.json
```

## Prisma Schema

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  todos     Todo[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Todo {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

## Dependencies

```bash
# Auth
next-auth@5 bcryptjs @types/bcryptjs

# Database
prisma @prisma/client

# Icons
lucide-react

# shadcn/ui components to install:
# button, input, card, checkbox, badge, label, separator, skeleton, toast
```

## Environment Variables

`.env` file in `/fullstack/` root:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

`.env.example` (committed — for reviewers):
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

- Never hardcode secrets
- `.env` must be in `.gitignore` but `.env.example` must be committed

## Code Style & Conventions

### TypeScript
- Strict mode. No `any` types.
- Use `interface` for object shapes, `type` for unions/intersections
- All API responses must be typed
- Define shared types in `types/index.ts`

### React / Next.js
- `"use client"` directive ONLY on components that need interactivity
- Server components by default
- Use Next.js App Router conventions: `page.tsx`, `layout.tsx`, `route.ts`
- Import alias: `@/` maps to project root
- Use `redirect()` from `next/navigation` for server-side redirects
- Use `useRouter()` from `next/navigation` for client-side navigation

### Styling
- **shadcn/ui components first** — use Button, Input, Card, Checkbox, Badge, Label, Separator, Skeleton, Toast before writing custom elements
- `components/ui/` is managed by shadcn CLI — DO NOT edit these files manually
- Tailwind CSS for all custom styling — no CSS modules, no styled-components
- Mobile-first responsive: stack on small screens, expand on md+
- Use `cn()` from `lib/utils.ts` for conditional classes
- Color conventions:
  - Completed todos: muted text + strikethrough
  - Delete actions: destructive variant (red)
  - Primary actions (create, sign in): default primary
  - Status: green badge = completed, outline badge = pending

### Components
- One component per file
- Props interfaces defined in the same file
- Use lucide-react for all icons: Plus, Trash2, Check, LogOut, Loader2, ListTodo, ClipboardList
- Loading states: Loader2 with `animate-spin` or shadcn Skeleton
- Error states: shadcn Toast or inline `text-destructive`
- Empty state: friendly message with icon when no todos exist

### API Routes
- All routes in `app/api/` using Next.js Route Handlers
- **Every todo route MUST check session** — return 401 if unauthenticated
- **Every todo mutation MUST verify ownership** — query by BOTH `id` AND `userId`
- Validate input: check required fields, trim whitespace, reject empty titles
- Return proper HTTP status codes: 200, 201, 400, 401, 404, 500
- Consistent JSON shape: `{ data }` on success, `{ error: "message" }` on failure
- Never return user password field in any response

### Authentication
- NextAuth.js v5 with credentials provider
- Passwords hashed with bcryptjs (minimum 10 salt rounds)
- Session strategy: JWT
- Custom sign-in and sign-up pages (not NextAuth defaults)
- `middleware.ts` protects `/todos` — redirect to `/auth/signin` if no session
- Session includes `user.id` via callbacks (jwt + session)
- Sign-out redirects to `/auth/signin`

## Key Implementation Details

### NextAuth Callbacks (critical — session must include user.id)
```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) token.id = user.id;
    return token;
  },
  async session({ session, token }) {
    if (session.user) session.user.id = token.id as string;
    return session;
  },
}
```

### Prisma Client Singleton
```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Todo API Pattern (follow for every route)
```
1. Get session via getServerSession() — return 401 if none
2. For [id] routes: await params to get id (Next.js 16 requirement)
3. Validate input (title not empty, id exists, etc.)
4. Query Prisma with userId filter — enforces ownership
5. Return typed JSON with proper status code
```

### Dynamic Route Params (Next.js 16 — critical)
```typescript
// app/api/todos/[id]/route.ts — params must be awaited
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ... rest of handler
}
```

### Middleware
```typescript
export { default } from "next-auth/middleware";
export const config = { matcher: ["/todos/:path*"] };
```

## Seed Data

`prisma/seed.ts` creates:
- Demo user: `demo@example.com` / `password123` (bcrypt hashed)
- 4 sample todos: 2 pending, 2 completed, with varied creation dates
- Add to `package.json`: `"prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }`

## UI Design Requirements

### Sign In / Sign Up Pages
- Centered card layout (max-w-md, mx-auto)
- shadcn Card with CardHeader, CardContent, CardFooter
- shadcn Input for email/password with Label
- shadcn Button for submit (full width)
- Link between sign-in and sign-up pages
- Show validation errors inline
- Loading spinner on submit button while authenticating

### Todo List Page
- Navbar at top: app name left, user email + sign out button right
- CreateTodo form: shadcn Input + Button inline (flex row)
- Todo items in a shadcn Card list:
  - shadcn Checkbox to toggle complete
  - Title text (strikethrough + muted when completed)
  - Creation date in small muted text
  - shadcn Badge showing "Completed" or "Pending"
  - Delete button (Trash2 icon, destructive ghost variant)
- Empty state: centered icon + "No todos yet" message
- Loading skeleton while fetching todos

### Responsive
- Full width on mobile with proper padding
- Max-width container (max-w-2xl) centered on desktop
- Touch-friendly tap targets (min 44px)

## Commands

```bash
npm run dev              # Start dev server (Turbopack default in Next.js 16)
npm run build            # Production build — MUST pass with zero errors
npx tsc --noEmit         # Type check
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to SQLite
npx prisma db seed       # Seed demo data
npx prisma studio        # Visual DB browser (debugging)
```

## Git Conventions
- Commit format: `type: description`
- Types: feat, fix, refactor, style, docs, chore
- Run `npm run build` before every commit — no broken builds

## Do NOT
- Do NOT overengineer — this is a 1-2 hour assessment, not a SaaS
- Do NOT add features beyond requirements (no categories, no due dates, no drag-and-drop, no dark mode toggle)
- Do NOT install additional CSS/UI libraries (no Material UI, no Chakra, no Ant Design)
- Do NOT create a `src/` directory
- Do NOT edit files in `components/ui/` — managed by shadcn CLI
- Do NOT use localStorage — Prisma + SQLite handles all persistence
- Do NOT leave `console.log` in production code
- Do NOT expose user passwords in API responses
- Do NOT skip input validation on any API route
- Do NOT allow users to access or modify other users' todos
- Do NOT forget the `.env.example` file — reviewers need it to run your app

## Assessment Evaluation Criteria (from the brief)
Reviewers are looking for:
1. **Clean, well-organized code** — file structure, naming, TypeScript usage
2. **Proper authentication** — sign-in / sign-up / sign-out, protected routes
3. **Effective API design** — RESTful, validated, proper status codes, ownership checks
4. **Data persistence** — survives refresh, per-user data isolation
5. **UX and UI** — responsive, loading states, error states, polished design
6. **Error handling** — graceful failures, user-friendly messages

## README.md (include in /fullstack/)

The README must include:
1. Project title + one-line description
2. Tech stack list
3. Setup instructions:
   - Clone + install deps
   - Copy `.env.example` to `.env`
   - `npx prisma generate && npx prisma db push`
   - `npx prisma db seed` (optional — for demo data)
   - `npm run dev`
4. Demo credentials: `demo@example.com` / `password123`
5. Screenshots (4): sign-in, empty state, todo list, mobile view
6. Built by: Elmar Angao — Full Stack Developer

## Troubleshooting (Next.js 16)
| Issue | Fix |
|-------|-----|
| `params` type error | Must `await params` — Next.js 16 makes params async |
| NextAuth middleware issues | Verify `middleware.ts` is at project root, not inside `app/` |
| Prisma client not found | Run `npx prisma generate` after schema changes |
| Turbopack issues | Fallback: `next dev --webpack` |
| SQLite lock errors | Restart dev server — SQLite doesn't handle concurrent writes |

## PR Submission Checklist
- [ ] `npm run build` passes with zero errors
- [ ] `npx tsc --noEmit` passes
- [ ] Auth flow works: sign up → sign in → sign out → redirect
- [ ] CRUD works: create → list → toggle complete → delete
- [ ] Data persists after page refresh
- [ ] User isolation: users only see their own todos
- [ ] Responsive on mobile
- [ ] `.env.example` included
- [ ] README.md with setup instructions
- [ ] No console.log in code
- [ ] 3-4 screenshots attached to PR description
