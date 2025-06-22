package userservice

import (
	"fmt"
	"net/http"
	"time"

	"github.com/K3shavGarg/user-service/middleware"
	"github.com/K3shavGarg/user-service/token"
	"github.com/K3shavGarg/user-service/types"
	"github.com/K3shavGarg/user-service/utils"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type Handler struct {
	// You can add fields here if needed, such as a database connection or logger
	// Inject dependencies as needed
	store types.UserStore
	tokenMaker *token.JWTMaker
} 

func NewHandler(store types.UserStore, tokenMaker *token.JWTMaker) *Handler {
	return &Handler{
		store: store,
		tokenMaker: tokenMaker,
	}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	// Register user-related routes here
	router.HandleFunc("/login", h.handleLogin).Methods("POST") // url = /api/v1/login
	router.HandleFunc("/register", h.handleRegister).Methods("POST")
	router.Handle("/logout", middleware.ChainMiddlewares(http.HandlerFunc(h.handleLogout),middleware.AuthMiddleware)).Methods("POST") 
}

func (h *Handler) handleRegister(w http.ResponseWriter, r *http.Request) {
	var payload types.RegisterUserPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}
	
	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("validation failed: %v", errors))
		return
	}
	
	res,_ := h.store.GetUserByEmail(payload.Email)
	if res != nil {
		utils.WriteError(w,http.StatusBadRequest,fmt.Errorf("user with email %v already exists", payload.Email))
		return
	}
	var createdUser *types.User
	
	HashesPassword,err := utils.HashPassword(payload.Password)
	
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to hash password: %v", err))
		return
	}
	
	createdUser,err = h.store.CreateUser(&types.RegisterUserPayload{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Email:     payload.Email,
		Password:  HashesPassword,
		IsAdmin:   payload.IsAdmin,
	})

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to create user: %v", err))
		return
	}
	utils.WriteJSON(w, http.StatusCreated, createdUser)
}

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {
	var payload types.LoginUserPayload
	if err := utils.ParseJSON(r, &payload); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}
	
	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("validation failed: %v", errors))
		return
	}

	res, err := h.store.GetUserByEmail(payload.Email)
	if err == nil && res == nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("user with email %v not found", payload.Email))
		return
	}else if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to get user: %v", err))
		return
	}

	err = utils.ComparePassword(res.Password, payload.Password)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("invalid credentials"))
		return
	}

	accessToken, accessClaims, err := h.tokenMaker.CreateToken(res.ID, res.Email, res.Is_Admin, 15 * time.Minute)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to create access token: %v", err))
		return
	}
	refreshToken, refreshClaims, err := h.tokenMaker.CreateToken(res.ID, res.Email, res.Is_Admin, 7 * 24 * time.Hour) // 7 days
	if err != nil { 
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to create refresh token: %v", err))
		return
	}
	session, err := h.store.CreateSession(&types.Session{
		ID: refreshClaims.RegisteredClaims.ID,
		UserEmail: res.Email,
		RefreshToken: refreshToken,
		IsRevoked: false,
		Expires_At: refreshClaims.ExpiresAt.Time,
	})

	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to create session: %v", err))
		return
	}

	
	response := types.LoginUserResponse{
		SessionID: session.ID,
		AccessToken: accessToken,
		RefreshToken: refreshToken,
		User: types.UserRes{
			Name:  fmt.Sprintf("%s %s", res.FirstName, res.LastName),
			Email: res.Email,
			IsAdmin: res.Is_Admin,
		},
		AccessTokenExpiresAt: accessClaims.ExpiresAt.Time,
		RefreshTokenExpiresAt: refreshClaims.ExpiresAt.Time,
	}
	utils.WriteJSON(w, http.StatusOK, response)
}

func (h *Handler) handleLogout(w http.ResponseWriter, r *http.Request) {
	// Get ID from params
	claims := r.Context().Value(middleware.AuthKey{}).(*token.UserClaims)
	sessionID := claims.RegisteredClaims.ID
	if sessionID == "" {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("session ID is required"))
		return
	}
	fmt.Print("Session ID: ", sessionID)
	err := h.store.DeleteSession(sessionID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to delete session: %v", err))
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

