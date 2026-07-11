# Marginalia — Notes Management System

A full-stack MERN notes app: React 19 + Vite + Tailwind on the frontend, Node/Express + MongoDB Atlas on the backend, with JWT auth, a rich-text editor, categories, favorites/pinned/archived views, a dashboard with charts, dark mode, and autosave.

```
notes-management-system/
├── client/     React 19 + Vite + Tailwind frontend
└── server/     Node + Express + MongoDB backend
```

## 1. Prerequisites

- Node.js 18+ and npm
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (or a local MongoDB instance)

## 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/notes-app?retryWrites=true&w=majority
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_DAYS=7
CLIENT_URL=http://localhost:5173
```

**Getting your MongoDB Atlas connection string:**
1. Create a free cluster at Atlas → Database → Build a Database.
2. Under Database Access, create a user with a username/password.
3. Under Network Access, add your IP (or `0.0.0.0/0` for development).
4. Click Connect → Drivers → copy the connection string and paste it into `MONGO_URI`, replacing `<username>`/`<password>` and adding a database name (e.g. `/notes-app`).

Seed the database with a demo account, categories, and sample notes:

```bash
npm run seed
```

This creates the login `demo@notesapp.com` / `password123`. To wipe the seeded data: `npm run seed:destroy`.

Start the API:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

## 3. Frontend setup

```bash
cd client
npm install --legacy-peer-deps
cp .env.example .env
```

> `--legacy-peer-deps` is needed because `react-quill`'s published peer dependency range hasn't been updated for React 19 yet, even though it works correctly with it.

Edit `client/.env` if your API isn't on the default port:

```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`, and log in with the demo account or register your own.

## 4. Building for production

```bash
cd client
npm run build      # outputs to client/dist
npm run preview    # serve the production build locally
```

Deploy `client/dist` to any static host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront). Deploy `server/` to any Node host (Render, Railway, Fly.io, a VPS). Set `CLIENT_URL` on the server to your deployed frontend URL, and `VITE_API_URL` on the client to your deployed API URL before building.

## 5. Project structure

```
server/
├── config/db.js              MongoDB connection
├── controllers/               Route handlers (auth, users, notes, categories)
├── middleware/                 JWT auth guard, error handler, rate limiters
├── models/                     User, Note, Category (Mongoose schemas)
├── routes/                     Express routers
├── validators/                 express-validator rule sets
├── seed/seed.js                 Demo data seeder
├── app.js / server.js           Express app + entry point

client/src/
├── components/                Reusable UI: NoteCard, NoteEditorModal, Sidebar, etc.
├── pages/                       Route-level views
├── layouts/                     AuthLayout, DashboardLayout
├── context/                     Auth, Theme, Notes React contexts
├── services/                    Axios wrappers per resource
├── routes/                       ProtectedRoute guard
└── utils/helpers.js             Formatting/word-count helpers
```

## 6. API reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Current session |
| GET | `/api/users/profile` | Profile + note stats |
| PUT | `/api/users/profile` | Update name/avatar |
| PUT | `/api/users/change-password` | Change password |
| GET | `/api/notes` | List notes (search, category, favorite, archived, pinned, sort, page, limit) |
| GET | `/api/notes/:id` | Single note |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Soft-delete (trash) |
| PATCH | `/api/notes/restore/:id` | Restore from trash |
| GET | `/api/notes/trash/all` | List trashed notes |
| DELETE | `/api/notes/permanent/:id` | Permanently delete |
| PATCH | `/api/notes/pin/:id` | Toggle pin |
| PATCH | `/api/notes/archive/:id` | Toggle archive |
| PATCH | `/api/notes/favorite/:id` | Toggle favorite |
| POST | `/api/notes/duplicate/:id` | Duplicate note |
| GET | `/api/notes/stats/dashboard` | Dashboard stats + charts |
| GET | `/api/categories` | List categories with note counts |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Rename/recolor category |
| DELETE | `/api/categories/:id` | Delete category (notes become uncategorized) |

## 7. Notes on the implementation

- **Auth**: JWT is issued on login/register, stored both as an httpOnly cookie and returned in the response body (also kept in `localStorage` client-side for the `Authorization` header) — this covers both cookie-based and header-based API consumption.
- **Autosave**: the note editor debounces changes for 2 seconds and calls the update endpoint silently; `Ctrl/Cmd+S` saves immediately.
- **Soft delete**: deleting a note sets `deleted: true` rather than removing it, so it can be restored; a permanent-delete endpoint exists for a future trash UI.
- **Rich text**: React Quill content is stored as sanitized-on-render HTML; add a server-side HTML sanitizer (e.g. `sanitize-html`) before production if notes will ever be rendered outside of your own trusted client.
- **Rate limiting**: a stricter limiter applies to `/api/auth/*` to slow down credential-stuffing attempts.
- **Design system**: colors, type (Fraunces + Public Sans + IBM Plex Mono), and the folded-corner note card are defined as Tailwind tokens in `client/tailwind.config.js` and `client/src/index.css`.

## 8. Known gaps to fill in before a real production launch

- Image upload for avatars/note images currently accepts a URL only — wire up S3/Cloudinary if you need real uploads.
- Add `sanitize-html` (or similar) server-side before storing/rendering rich text, to guard against stored XSS.
- Add automated tests (Jest/Supertest for the API, Vitest/RTL for the client).
- Add a proper trash/restore UI screen in the client (the API already supports it).
