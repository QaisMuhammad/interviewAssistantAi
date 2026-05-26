# AI Resume Reviewer

Full-stack application that generates **personalized AI interview preparation plans** from a job description and candidate profile (resume PDF and/or self-description). Users register, log in, create reports, and view structured output (technical questions, behavioral questions, match score, skill gaps, and a preparation roadmap).

## Tech stack

| Layer    | Technologies |
|---------|---------------|
| **Frontend** | React 19, Vite 8, React Router 7, Sass |
| **Backend**  | Node.js, Express 5, MongoDB (Mongoose), JWT (httpOnly cookies via `cookie-parser`), Multer, `pdf-parse` |
| **AI**       | Google Generative AI (`@google/genai`) |

## Repository layout

```
AiResumeReviewer/
├── Backend/          # Express API (`npm run dev`)
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── controllers/
│       ├── routes/
│       ├── middlewares/
│       ├── models/
│       └── services/
└── Frontend/         # Vite + React SPA (`npm run dev`)
    └── src/
        ├── App.jsx
        ├── app.routes.jsx
        └── features/
            ├── auth/
            └── interview/
```

## Prerequisites

- **Node.js** (LTS recommended)
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (connection via `MONGO_URI`)
- **Google AI API key** for Gemini (`GOOGLE_GENAI_API_KEY`)

## Environment variables

### Backend (`Backend/.env`)

Create `Backend/.env` (never commit real secrets):

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string (required; server exits if missing) |
| `JWT_SECRET` | Secret for signing JWTs used in auth middleware |
| `GOOGLE_GENAI_API_KEY` | API key passed to `@google/genai` in `src/services/ai.service.js` |
| `PORT` | Optional; defaults to **3000** |

### Frontend (`Frontend/.env`)

Create `Frontend/.env` for local development:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the API (no trailing slash), e.g. `http://localhost:3000` |

The frontend Axios client (`withCredentials: true`) expects the backend to allow your dev origin (**`http://localhost:5173`**) — see `Backend/src/app.js` CORS settings. If you change the Vite port or deploy the frontend elsewhere, update CORS accordingly.

## Install and run locally

### 1. Backend

```bash
cd Backend
npm install
npm run dev
```

Starts the API with **nodemon** on `PORT` (default **3000**).

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

Opens the Vite dev server (default **http://localhost:5173**).

### Production build (frontend)

```bash
cd Frontend
npm run build
npm run preview   # optional: serve the built assets
```

## API overview (authenticated)

Protected routes expect a valid JWT (handled by backend auth middleware; frontend uses credentials).

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login |
| `GET`  | `/api/auth/logout` | Logout (if exposed) |
| `POST` | `/api/interview/` | Upload resume (`multipart/form-data`: `resume`, plus `jobDescription`, `selfDescription`) and generate/store report |
| `GET`  | `/api/interview/report/:interviewId` | Fetch full report by ID |
| `GET`  | `/api/interview` | List current user’s reports (summary fields only) |

**Note:** Interview generation on the backend currently parses an uploaded PDF resume (`pdf-parse`). If you only use “self-description” in the UI, ensure the backend and upload flow align with how you intend to deploy (DOCX-only flows may require additional parsing).

## Frontend routes

| Path | Description |
|------|-------------|
| `/login` | Login |
| `/register` | Register |
| `/` | Home — generate interview plan (protected) |
| `/interview/:interviewId` | Interview report viewer (protected) |

React Router reads URL parameters **by name** as defined in `app.routes.jsx`. The detail route uses `:interviewId`, so the interview page should read `interviewId` from `useParams()`, not `id`, or fetches keyed by ID may fail after navigation or refresh.

## MongoDB on Windows / Atlas

`Backend/src/config/database.js` sets public DNS servers for SRV lookups to improve reliability with `mongodb+srv` on some Windows setups. Ensure `MONGO_URI` is correct and your Atlas IP/network access rules allow your machine.

## Scripts reference

**Backend** (`Backend/package.json`):

- `npm run dev` — `nodemon src/server.js`
- `npm start` — `node src/server.js`

**Frontend** (`Frontend/package.json`):

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Contributing / development tips

- Keep `VITE_API_URL` in sync with the running API origin.
- After changing deployed origins, mirror them in backend CORS (`Backend/src/app.js`).
- `.env` files are local-only; rotate keys if they are ever leaked.

---

*Project name from package metadata: Backend `airesumereviewer`; Frontend workspace `frontend`.*
