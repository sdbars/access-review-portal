package main

import (
	"log"
	"net/http"

	"github.com/sdbars/access-review-portal/api/internal/handlers"
	"github.com/sdbars/access-review-portal/api/internal/httpx"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/health", handlers.Health)
	mux.HandleFunc("/api/login", handlers.Login)
	mux.HandleFunc("/api/me", handlers.Me)
	mux.HandleFunc("/api/resources", handlers.Resources)

	log.Println("API listening on :8080")

	server := httpx.WithCORS(mux)

	if err := http.ListenAndServe(":8080", server); err != nil {
		log.Fatal(err)
	}
}
