package sessionservice

import (
	"fmt"
	"net/http"
	"time"

	"github.com/K3shavGarg/user-service/middleware"
	"github.com/K3shavGarg/user-service/token"
	"github.com/K3shavGarg/user-service/types"
	"github.com/K3shavGarg/user-service/utils"
	"github.com/gorilla/mux"
)

type Handler struct {
	tokenMaker *token.JWTMaker
	store *Store
}

func NewHandler(store *Store, tokenMaker *token.JWTMaker) *Handler {
	return &Handler{
		tokenMaker: tokenMaker,
		store: store,
	}
}


func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/renew",h.RenewAccessToken).Methods("POST")
	router.Handle("/revoke", middleware.ChainMiddlewares(http.HandlerFunc(h.RevokeSession), middleware.AuthMiddleware)).Methods("PATCH") 
}




func (h *Handler) RenewAccessToken(w http.ResponseWriter, r *http.Request) {
	var req types.RenewAccessTokenPayload

	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("failed to parse request: %v", err))
		return
	}
	refreshClaims, err := h.tokenMaker.VerifyToken(req.RefreshToken)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("error verifying token: %v", err))
		return
	}
	session, err := h.store.GetSession(refreshClaims.RegisteredClaims.ID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to get session: %v", err))
		return
	}

	if session == nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("session not found or invalid"))
		return
	}
	if session.IsRevoked {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("session is revoked"))
		return
	}
	if session.UserEmail != refreshClaims.Email {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("session email does not match token email"))
		return
	}
	accessToken, claims, err := h.tokenMaker.CreateToken(refreshClaims.ID, refreshClaims.Email, refreshClaims.IsAdmin, 15*time.Minute)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to create access token: %v", err))
		return
	}
	res := types.RenewAccessTokenResponse{
		AccessToken:          accessToken,
		AccessTokenExpiresAt: claims.ExpiresAt.Time,
	}
	utils.WriteJSON(w, http.StatusOK, res)
} 

func (h *Handler) RevokeSession(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.AuthKey{}).(*token.UserClaims)
	sessionID := claims.RegisteredClaims.ID

	if sessionID == "" {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("session ID is required"))
		return
	}
	err := h.store.RevokeSession(sessionID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to revoke session: %v", err))
		return
	}
	w.WriteHeader(http.StatusNoContent)
}