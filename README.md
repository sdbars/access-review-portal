# Access Review Portal

A lightweight full-stack application simulating an access control system, built to explore:

* Go backend services
* React frontend (Vite + TypeScript)
* Role-based access control (RBAC)
* Zero Trust-style authorization concepts
* Full-stack integration (frontend ↔ API)
* Docker + CI/CD (planned)

---

## Tech Stack

### Backend

* Go (`net/http`)
* Modular project structure (`internal/...`)
* In-memory data store
* Middleware (CORS)

### Frontend

* React
* Vite
* TypeScript
* React Router
* Fetch API

### DevOps (planned)

* Docker
* GitHub Actions / Jenkins

---

## Project Structure

```
access-review-portal/
├── api/
│   ├── cmd/server/        # Entry point
│   └── internal/
│       ├── auth/          # Auth logic
│       ├── data/          # Seed data (users/resources)
│       ├── handlers/      # HTTP handlers
│       ├── models/        # Types
│       └── httpx/         # Shared HTTP utilities (CORS, JSON)
└── frontend/
    ├── src/
    │   ├── api/           # API client
    │   ├── pages/         # Login, Dashboard, Resources
    │   ├── components/    # UI components (future)
    │   └── auth/          # Auth utilities (future)
```

---

## Running the Application

### 1. Start Backend

```bash
cd api
go run ./cmd/server
```

Backend runs at:

```
http://localhost:8080
```

---

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## Application Flow

1. User navigates to `/login`
2. Enters a user ID (e.g. `alice`)
3. Frontend calls:

```
POST /api/login
```

4. Backend returns a token:

```json
{ "token": "fake-token-for-alice" }
```

5. Token is stored in `localStorage`
6. Frontend calls:

   * `GET /api/me`
   * `GET /api/resources`
7. UI renders:

   * user info (Dashboard)
   * resource access (Resources page)

---

## API Endpoints

### Health

```
GET /api/health
```

```bash
curl http://localhost:8080/api/health
```

---

### Login

```
POST /api/login
```

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"alice"}'
```

---

### Current User

```
GET /api/me
```

```bash
curl http://localhost:8080/api/me \
  -H "Authorization: Bearer fake-token-for-alice"
```

---

### Resources

```
GET /api/resources
```

```bash
curl http://localhost:8080/api/resources \
  -H "Authorization: Bearer fake-token-for-alice"
```

---

## Test Users

| User  | Role              | Access Level   |
| ----- | ----------------- | -------------- |
| alice | frontend-engineer | partial access |
| bob   | backend-engineer  | more access    |
| carol | admin             | full access    |
| dave  | contractor        | limited access |

---

## Concepts Demonstrated

### Backend

* Token-based authentication (simulated)
* Role-based access control (RBAC)
* Middleware pattern (CORS)
* Modular Go architecture

### Frontend

* React routing (multi-page app)
* API integration with fetch
* State management with hooks
* Token persistence via `localStorage`

### Full Stack

* Cross-origin communication (CORS)
* Authenticated API requests
* Separation of frontend and backend concerns

---

## Running with Docker

You can run the full application (backend + frontend) using Docker.

### Prerequisites
- Docker Desktop installed and running

### Build and start services

From the project root:

```
docker compose up --build
```

This will:

- build the Go backend image
- build the React frontend image
- start both services

### Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

### Example API test

```
curl http://localhost:8080/api/health
```

Expected response:

```
{"status":"ok"}
```

### Stopping the application

Press:

```
Ctrl + C
```

Then clean up containers:

```
docker compose down
```

### Rebuilding after code changes

If you make changes to the code, rebuild:

```
docker compose up --build
```

### Troubleshooting

**Port already in use**

If you see an error like:

```
port is already allocated
```

Stop any running local servers using those ports:

```
lsof -i :8080
lsof -i :5173
kill -9 <PID>
```

**API not reachable from frontend**

- Ensure the API container is running
- Verify:

```
curl http://localhost:8080/api/health
```

### Development Notes

-Backend uses in-memory storage (data resets on restart)
- Frontend communicates with API via http://localhost:8080
- Docker setup is intended for local development and learning

## General Notes

This project intentionally uses:

* in-memory data
* fake tokens

It is designed for:

* learning
* prototyping
* demonstrating system design patterns
