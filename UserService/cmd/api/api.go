package api

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/K3shavGarg/user-service/config"
	sessionservice "github.com/K3shavGarg/user-service/service/session-service"
	userService "github.com/K3shavGarg/user-service/service/user-service"
	"github.com/gorilla/mux"
)

type APIServer struct {
	addr string
	db   *sql.DB
}

func NewAPIServe(addr string, db *sql.DB) *APIServer {
	return &APIServer{
		addr: addr,
		db:   db,
	}
}


func (as *APIServer) Run() error {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1").Subrouter() // Create a subrouter for versioning
	// User Services
	userStore := userService.NewStore(as.db)
	userHandler := userService.NewHandler(userStore, config.TokenMaker)
	userHandler.RegisterRoutes(subrouter)

	// Session Services
	sessionStore := sessionservice.NewStore(as.db)
	sessionHandler := sessionservice.NewHandler(sessionStore, config.TokenMaker)
	sessionHandler.RegisterRoutes(subrouter)	


	log.Printf("Listening on PORT%v",as.addr)
	return http.ListenAndServe(as.addr, router)
}
