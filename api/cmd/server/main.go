package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/sdbars/access-review-portal/api/internal/handlers"
	"github.com/sdbars/access-review-portal/api/internal/httpx"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/health", handlers.Health)
	mux.HandleFunc("/api/login", handlers.Login)
	mux.HandleFunc("/api/me", handlers.Me)
	mux.HandleFunc("/api/resources", handlers.Resources)

	mux.HandleFunc("/api/access-requests", handlers.CreateAccessRequest)
	mux.HandleFunc("/api/access-requests/mine", handlers.GetMyAccessRequests)
	mux.HandleFunc("/api/admin/access-requests", handlers.GetAllAccessRequests)
	mux.HandleFunc("/api/admin/access-requests/", func(w http.ResponseWriter, r *http.Request) {
		switch {
		case strings.HasSuffix(r.URL.Path, "/approve"):
			handlers.ApproveAccessRequest(w, r)
		case strings.HasSuffix(r.URL.Path, "/reject"):
			handlers.RejectAccessRequest(w, r)
		default:
			http.NotFound(w, r)
		}
	})

	log.Println("API listening on :8080")

	server := httpx.WithLogging(httpx.WithCORS(mux))

	if err := http.ListenAndServe(":8080", server); err != nil {
		log.Fatal(err)
	}
}
