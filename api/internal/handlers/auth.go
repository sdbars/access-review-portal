package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/sdbars/access-review-portal/api/internal/auth"
	"github.com/sdbars/access-review-portal/api/internal/data"
	"github.com/sdbars/access-review-portal/api/internal/httpx"
	"github.com/sdbars/access-review-portal/api/internal/models"
)

func Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		httpx.WriteJSON(w, http.StatusMethodNotAllowed, map[string]string{
			"error": "method not allowed",
		})
		return
	}

	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid JSON body",
		})
		return
	}

	if req.UserID == "" {
		httpx.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "userId is required",
		})
		return
	}

	if _, ok := data.Users[req.UserID]; !ok {
		httpx.WriteJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unknown user",
		})
		return
	}

	httpx.WriteJSON(w, http.StatusOK, models.LoginResponse{
		Token: "fake-token-for-" + req.UserID,
	})
}

func Me(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		httpx.WriteJSON(w, http.StatusMethodNotAllowed, map[string]string{
			"error": "method not allowed",
		})
		return
	}

	user, ok := auth.AuthenticateRequest(r)
	if !ok {
		httpx.WriteJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	httpx.WriteJSON(w, http.StatusOK, user)
}
