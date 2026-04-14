package main

import (
	"log"
	"net/http"

	"github.com/sdbars/access-review-portal/api/internal/handlers"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/health", handlers.Health)
	mux.HandleFunc("/api/login", handlers.Login)
	mux.HandleFunc("/api/me", handlers.Me)
	mux.HandleFunc("/api/resources", handlers.Resources)

	log.Println("API listening on :8080")

	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}
