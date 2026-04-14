package data

import "github.com/sdbars/access-review-portal/api/internal/models"

var Users = map[string]models.User{
	"alice": {
		ID:   "alice",
		Name: "Alice",
		Role: "frontend-engineer",
		Team: "cms",
	},
	"bob": {
		ID:   "bob",
		Name: "Bob",
		Role: "backend-engineer",
		Team: "cms",
	},
	"carol": {
		ID:   "carol",
		Name: "Carol",
		Role: "admin",
		Team: "platform",
	},
	"dave": {
		ID:   "dave",
		Name: "Dave",
		Role: "contractor",
		Team: "cms",
	},
}

var Resources = []models.Resource{
	{
		ID:           "cms-dashboard",
		Name:         "CMS Dashboard",
		Description:  "Frontend dashboard for content operations",
		AllowedRoles: []string{"frontend-engineer", "backend-engineer", "admin"},
	},
	{
		ID:           "content-api",
		Name:         "Content Admin API",
		Description:  "Protected backend API for content administration",
		AllowedRoles: []string{"backend-engineer", "admin"},
	},
	{
		ID:           "deploy-pipeline",
		Name:         "Deployment Pipeline",
		Description:  "CI/CD pipeline controls and deployment history",
		AllowedRoles: []string{"admin"},
	},
	{
		ID:           "audit-logs",
		Name:         "Audit Logs",
		Description:  "Security and access audit records",
		AllowedRoles: []string{"admin"},
	},
}
