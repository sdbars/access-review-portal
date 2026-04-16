package models

type AccessRequest struct {
	ID            string `json:"id"`
	UserID        string `json:"userId"`
	ResourceID    string `json:"resourceId"`
	Justification string `json:"justification"`
	Status        string `json:"status"`
}

type CreateAccessRequestInput struct {
	ResourceID    string `json:"resourceId"`
	Justification string `json:"justification"`
}
