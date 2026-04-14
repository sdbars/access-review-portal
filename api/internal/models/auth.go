package models

type LoginRequest struct {
	UserID string `json:"userId"`
}

type LoginResponse struct {
	Token string `json:"token"`
}
