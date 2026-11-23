# Portfolio MERN Project (TypeScript Frontend)

## Structure
```
backend/          Express + MongoDB (JS)
  models/          Portfolio.js, Contact.js, Admin.js
  routes/          portfolioRoutes.js, contactRoutes.js, authRoutes.js
  controllers/     authController.js
  middleware/      auth.js (JWT protect)
  server.js

frontend/          React + TypeScript (Vite)
  src/types/        shared TS interfaces
  src/api/           axios instance + typed API calls
  src/components/    Hero, About, Skills, Projects, Contact (public site)
  src/pages/Home.tsx
  src/admin/          AdminLogin, AdminLayout, Dashboard,
                       ManagePortfolio, ManageContacts (fully dynamic)
  src/context/        AuthContext (admin session/JWT)
```

## How the "dynamic" contact/admin flow works
1. Visitor submits the `Contact.tsx` form → `POST /api/contact` → saved in MongoDB.
2. Admin logs in at `/admin/login` → `POST /api/auth/login` → gets a JWT stored in `localStorage`.
3. `/admin/contacts` (`ManageContacts.tsx`) calls `GET /api/contact` (JWT-protected) and
   renders the **live list from the database** — nothing is hardcoded. Admin can:
   - filter by All / Unread / Read
   - click a message to view full detail
   - mark as read/unread (`PATCH /api/contact/:id/read`)
   - delete (`DELETE /api/contact/:id`)
   - reply via a `mailto:` link
4. `/admin/portfolio` lets the admin edit hero/about/skills/projects, which
   `PUT /api/portfolio` persists — so the public Home page is fully CMS-driven too.

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev
```
On first boot, the server auto-creates an admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
in `.env` — use those to log in to `/admin/login`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL if backend isn't on localhost:5000
npm run dev
```

This scaffold assumes Vite + React Router. If your existing project (as in your screenshot)
already has `App.tsx`, `Home.tsx`, etc., merge these files in rather than overwriting —
the component names match what you already have (`About.tsx`, `Portfolio.js`, etc.).
