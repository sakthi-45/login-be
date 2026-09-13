# Aqua World

This repository is ready to deploy as one Vercel project:

- `vite-project/` is the React frontend.
- `api/[...route].js` is the Vercel serverless-function entry point.
- `backend/index.js` contains the Express GET and POST API routes.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel, leaving **Root Directory** set to the repository root.
3. Deploy. Vercel reads `vercel.json` and installs/builds both projects.

The frontend uses same-origin URLs (`/api/health`, `/api/register`, and `/api/login`), so no production API URL or CORS setting is required.

## Local development

Open two terminals from the repository root:

```powershell
cd backend
npm run dev
```

```powershell
cd vite-project
npm run dev
```

The Vite proxy forwards frontend API calls to `http://localhost:3000` locally.

## Important data note

User accounts are currently held in server memory for learning/demo use. Serverless functions can restart at any time, so registrations are not durable on Vercel. Connect a database (such as Vercel Postgres, Neon, or Supabase) before using this for real accounts.
