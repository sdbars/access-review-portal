package auth

import "github.com/sdbars/access-review-portal/api/internal/data"

func HasExplicitAccess(userID string, resourceID string) bool {
	resourceIDs, ok := data.UserAccess[userID]
	if !ok {
		return false
	}

	for _, grantedResourceID := range resourceIDs {
		if grantedResourceID == resourceID {
			return true
		}
	}

	return false
}

func GrantAccess(userID string, resourceID string) {
	if HasExplicitAccess(userID, resourceID) {
		return
	}

	data.UserAccess[userID] = append(data.UserAccess[userID], resourceID)
}
