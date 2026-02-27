# Todo App - Fullstack

A modern, fullstack todo application built with Next.js 16, TypeScript, and Prisma.

## Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js v5 (Credentials Provider), bcryptjs
- **Database**: Prisma ORM, SQLite
- **Testing**: Vitest, React Testing Library, @testing-library/user-event
- **Icons**: Lucide React

## Features

- User authentication (sign up, sign in, sign out)
- Create, read, update, delete todos
- Toggle todo completion status
- Per-user data isolation
- Responsive design (mobile-first)
- Comprehensive test coverage (80%+)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Setup

1. **Clone the repository and navigate to the fullstack directory**

   ```bash
   cd fullstack
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   The `.env` file should contain:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-random-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed demo data (optional)**

   ```bash
   npx prisma db seed
   ```

   This creates a demo user:
   - Email: `demo@example.com`
   - Password: `password123`

6. **Start development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

If you seeded the database, you can use:

- **Email**: `demo@example.com`
- **Password**: `password123`

## Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
fullstack/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── register/
│   │   └── todos/
│   ├── auth/
│   │   ├── signin/
│   │   └── signup/
│   ├── todos/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── AuthForm.tsx
│   ├── Navbar.tsx
│   ├── TodoItem.tsx
│   ├── TodoList.tsx
│   ├── CreateTodo.tsx
│   ├── TodoPageClient.tsx
│   └── Providers.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── __tests__/
│   ├── api/
│   ├── app/
│   ├── components/
│   └── helpers/
└── package.json
```

## Key Implementation Details

### Authentication

- Credentials-based authentication with NextAuth.js v5
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT session strategy
- Protected `/todos` route with middleware

### API Routes

All todo API routes include:
- Session validation (401 if unauthenticated)
- Ownership verification (users can only access their own todos)
- Input validation
- Proper HTTP status codes

Endpoints:
- `GET /api/todos` - Fetch all user's todos
- `POST /api/todos` - Create new todo
- `PATCH /api/todos/[id]` - Update todo
- `DELETE /api/todos/[id]` - Delete todo

### Database

Prisma schema includes:
- **User** model: email (unique), password hash, name
- **Todo** model: title, completed status, timestamps, user reference

### Testing

Test coverage includes:
- **Unit tests**: Components (TodoItem, TodoList, CreateTodo, AuthForm, Navbar)
- **Integration tests**: API routes with session and ownership validation
- **E2E flows**: Sign-up → Sign-in → Create/Toggle/Delete todos → Sign-out

Total: 84 tests passing

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Sync database schema |
| `npx prisma db seed` | Seed demo data |
| `npx prisma studio` | Open Prisma Studio UI |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The app uses SQLite for simplicity (stored in `fullstack/dev.db`)
- The database is automatically created on first run
- `.env` is in `.gitignore` but `.env.example` is committed for reviewers
- All tests are independent and can run in any order
- No external API calls are made (fully self-contained)

## Built by

Elmar Angao — Full Stack Developer

---

For more details about the project structure and implementation, refer to `CLAUDE.md`.
