# Portfolio setup

This repository already uses Express, Sequelize and MySQL for the backend and React/Vite for the frontend. The public portfolio reads skills, projects, experience, education and services from that API, with local component data as a fallback.

## Backend

1. Create a MySQL database (or use the backend's automatic local database creation).
2. From `backend`, run `npm install`.
3. Copy `.env.example` to `.env` and set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL`, and admin credentials.
4. To receive contact notifications, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_EMAIL`.
5. Run `npm run dev`.

The API seeds missing portfolio records without replacing records already managed in the admin area. `POST /api/contact` stores contact messages and applies input validation, a honeypot field and an in-memory limit of five submissions per minute per IP. Put the owner's CV at `backend/storage/Kavin_B_CV.pdf` for `GET /api/cv` to download it.

## Frontend

1. From `frontend`, run `npm install`.
2. Copy `.env.example` to `.env`; set `VITE_API_URL` to the backend API base URL and `VITE_ADMIN_EMAIL` to the same email as `ADMIN_EMAIL` in `backend/.env`.
3. Run `npm run dev`.

The site uses dark mode by default. The theme switch saves the choice in local storage. Portfolio API requests fall back to the built-in display data when the backend is unavailable.
