# Vconstech Website Monorepo

This repository contains the Vconstech website frontend and the independent website backend.

## Structure

```text
Vconstech-site-master/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── .env.example
│   └── .gitignore
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── package.json
│   ├── package-lock.json
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── .gitignore
└── README.md
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
cd frontend
npm run build
```

## Backend

```bash
cd backend
npm install
npm run dev
```

Build check:

```bash
cd backend
npm run build
```

## Notes

- Frontend API configuration belongs in `frontend/.env`.
- Backend secrets and service configuration belong in `backend/.env`.
- CRM, Brevo SMTP, Razorpay, ERP integration, API routes, and application logic are unchanged.
