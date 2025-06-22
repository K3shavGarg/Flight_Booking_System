package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/K3shavGarg/user-service/config"
	"github.com/K3shavGarg/user-service/token"
	"github.com/K3shavGarg/user-service/utils"
)



func ChainMiddlewares(h http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	for i := len(middlewares) - 1; i >= 0; i-- {
		h = middlewares[i](h)
	}
	return h
}
type AuthKey struct {} // Why empty struct better than string? Because it avoids potential collisions with other string keys in the context. 


func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, err := VerifyClaimsFromAuthHeader(r)
		if err != nil {
			utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("unauthorized: %v", err))
			return
		}
		ctx := context.WithValue(r.Context(), AuthKey{}, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
 


func VerifyClaimsFromAuthHeader(r *http.Request) (*token.UserClaims, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return nil, fmt.Errorf("authorization header is missing")
	}
	fields := strings.Fields(authHeader) 
	// Bearer <token>
	if len(fields) != 2 || fields[0] != "Bearer" {
		return nil, fmt.Errorf("invalid authorization header format")
	}
	tokenString := fields[1]
	claims, err := config.TokenMaker.VerifyToken(tokenString)
	if err != nil {
		return nil, fmt.Errorf("error verifying token: %w", err)
	}
	return claims, nil
}