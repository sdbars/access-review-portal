package handlers

import (
	"net/http"

	"github.com/sdbars/access-review-portal/api/internal/auth"
	"github.com/sdbars/access-review-portal/api/internal/data"
	"github.com/sdbars/access-review-portal/api/internal/httpx"
	"github.com/sdbars/access-review-portal/api/internal/models"
)

func Resources(w http.ResponseWriter, r *http.Request) {
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

	var result []models.ResourceView
	for _, resource := range data.Resources {
		allowed := auth.HasRoleAccess(user.Role, resource.AllowedRoles)
		reason := "access denied"
		if allowed {
			reason = "access granted"
		}

		result = append(result, models.ResourceView{
			ID:           resource.ID,
			Name:         resource.Name,
			Description:  resource.Description,
			Allowed:      allowed,
			Reason:       reason,
			AllowedRoles: resource.AllowedRoles,
		})
	}

	httpx.WriteJSON(w, http.StatusOK, result)
}
