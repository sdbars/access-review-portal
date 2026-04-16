package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/sdbars/access-review-portal/api/internal/auth"
	"github.com/sdbars/access-review-portal/api/internal/data"
	"github.com/sdbars/access-review-portal/api/internal/httpx"
	"github.com/sdbars/access-review-portal/api/internal/models"
)

func CreateAccessRequest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
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

	var input models.CreateAccessRequestInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		httpx.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid JSON body",
		})
		return
	}

	if input.ResourceID == "" {
		httpx.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "resourceId is required",
		})
		return
	}

	for _, existingRequest := range data.AccessRequests {
		if existingRequest.UserID == user.ID &&
			existingRequest.ResourceID == input.ResourceID &&
			existingRequest.Status == "pending" {
			httpx.WriteJSON(w, http.StatusConflict, map[string]string{
				"error": "pending request already exists for this resource",
			})
			return
		}
	}

	request := models.AccessRequest{
		ID:            generateRequestID(len(data.AccessRequests) + 1),
		UserID:        user.ID,
		ResourceID:    input.ResourceID,
		Justification: input.Justification,
		Status:        "pending",
	}

	data.AccessRequests = append(data.AccessRequests, request)

	httpx.WriteJSON(w, http.StatusCreated, request)
}

func GetMyAccessRequests(w http.ResponseWriter, r *http.Request) {
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

	result := make([]models.AccessRequest, 0)
	for _, request := range data.AccessRequests {
		if request.UserID == user.ID {
			result = append(result, request)
		}
	}

	httpx.WriteJSON(w, http.StatusOK, result)
}

func GetAllAccessRequests(w http.ResponseWriter, r *http.Request) {
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

	if user.Role != "admin" {
		httpx.WriteJSON(w, http.StatusForbidden, map[string]string{
			"error": "forbidden",
		})
		return
	}

	if data.AccessRequests == nil {
		httpx.WriteJSON(w, http.StatusOK, make([]models.AccessRequest, 0))
		return
	}

	httpx.WriteJSON(w, http.StatusOK, data.AccessRequests)
}

func ApproveAccessRequest(w http.ResponseWriter, r *http.Request) {
	updateAccessRequestStatus(w, r, "approve")
}

func RejectAccessRequest(w http.ResponseWriter, r *http.Request) {
	updateAccessRequestStatus(w, r, "reject")
}

func updateAccessRequestStatus(w http.ResponseWriter, r *http.Request, action string) {
	if r.Method != http.MethodPost {
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

	if user.Role != "admin" {
		httpx.WriteJSON(w, http.StatusForbidden, map[string]string{
			"error": "forbidden",
		})
		return
	}

	requestID, ok := extractRequestID(r.URL.Path, action)
	if !ok {
		httpx.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request path",
		})
		return
	}

	// 👇 derive status here
	var newStatus string
	switch action {
	case "approve":
		newStatus = "approved"
	case "reject":
		newStatus = "rejected"
	default:
		httpx.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid action",
		})
		return
	}

	for i, request := range data.AccessRequests {
		if request.ID == requestID {
			data.AccessRequests[i].Status = newStatus
			httpx.WriteJSON(w, http.StatusOK, data.AccessRequests[i])
			return
		}
	}

	httpx.WriteJSON(w, http.StatusNotFound, map[string]string{
		"error": "request not found",
	})
}

func extractRequestID(path string, action string) (string, bool) {
	prefix := "/api/admin/access-requests/"
	suffix := "/" + action

	if !strings.HasPrefix(path, prefix) || !strings.HasSuffix(path, suffix) {
		return "", false
	}

	requestID := strings.TrimPrefix(path, prefix)
	requestID = strings.TrimSuffix(requestID, suffix)
	requestID = strings.TrimSpace(requestID)

	if requestID == "" {
		return "", false
	}

	return requestID, true
}

func generateRequestID(n int) string {
	return "req-" + strconv.Itoa(n)
}
