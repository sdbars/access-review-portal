# Access Review Portal

A lightweight full-stack application simulating an access control system, built to explore:

- Go backend services
- Role-based access control (RBAC)
- Zero Trust-style authorization concepts
- React frontend (coming next)
- Docker + CI/CD (planned)

---

## Tech Stack

### Backend
- Go (net/http)
- Modular project structure (`internal/...`)
- In-memory data store

### Frontend (planned)
- React (Vite + TypeScript)

### DevOps (planned)
- Docker
- GitHub Actions / Jenkins

---

## Project Structure

access-review-portal/
├── api/
│ ├── cmd/server/ # Entry point
│ └── internal/
│ ├── auth/ # Auth logic
│ ├── data/ # Seed data (users/resources)
│ ├── handlers/ # HTTP handlers
│ ├── models/ # Types
│ └── httpx/ # Shared HTTP utilities
└── frontend/ # (coming next)

## Running the Backend

### Prerequisites
- Go (managed via `asdf`)

### Start server

```bash
cd api
go run ./cmd/server

Server runs at: http://localhost:8080

API Endpoints

Health

GET /api/health
curl http://localhost:8080/api/health

Login

POST /api/login

curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"alice"}'

Current User

GET /api/me

curl http://localhost:8080/api/me \
  -H "Authorization: Bearer fake-token-for-alice"

Resources

GET /api/resources

curl http://localhost:8080/api/resources \
  -H "Authorization: Bearer fake-token-for-alice"
```

## Test Users

| User  | Role              | Access Level   |
| ----- | ----------------- | -------------- |
| alice | frontend-engineer | partial access |
| bob   | backend-engineer  | more access    |
| carol | admin             | full access    |
| dave  | contractor        | limited access |

## Concepts Demonstrated

- Token-based authentication (simulated)
- Role-based access control (RBAC)
- Separation of concerns in Go:
   - handlers
   - auth
   - models
   - data
- Modular backend structure

## Notes

This project is intentionally simple and uses:

- in-memory data
- fake tokens

It is designed for learning, prototyping, and demonstrating system design concepts.