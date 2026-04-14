package models

type Resource struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	Description  string   `json:"description"`
	AllowedRoles []string `json:"-"`
}

type ResourceView struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	Description  string   `json:"description"`
	Allowed      bool     `json:"allowed"`
	Reason       string   `json:"reason"`
	AllowedRoles []string `json:"allowedRoles"`
}
