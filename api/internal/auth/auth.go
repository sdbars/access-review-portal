package auth

import (
	"net/http"
	"strings"

	"github.com/sdbars/access-review-portal/api/internal/data"
	"github.com/sdbars/access-review-portal/api/internal/models"
)

func AuthenticateRequest(r *http.Request) (models.User, bool) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return models.User{}, false
	}

	token := strings.TrimSpace(authHeader)
	const bearerPrefix = "Bearer "
	if strings.HasPrefix(token, bearerPrefix) {
		token = strings.TrimPrefix(token, bearerPrefix)
	}

	const tokenPrefix = "fake-token-for-"
	if !strings.HasPrefix(token, tokenPrefix) {
		return models.User{}, false
	}

	userID := strings.TrimPrefix(token, tokenPrefix)
	user, ok := data.Users[userID]
	return user, ok
}

func HasRoleAccess(role string, allowedRoles []string) bool {
	for _, allowedRole := range allowedRoles {
		if role == allowedRole {
			return true
		}
	}
	return false
}
