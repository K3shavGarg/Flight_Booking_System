package userservice

// import (
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"net/http/httptest"
// 	"strings"
// 	"testing"

// 	"github.com/K3shavGarg/ecom/types"
// 	"github.com/gorilla/mux"
// )

// func TestUserHandler(t *testing.T) {
// 	mockStore := &MockUserStore{} // Assuming you have a mock implementation of UserStore

// 	handler := NewHandler(mockStore)

// 	t.Run("should fail when payload is invalid", func(t *testing.T) {
// 		payload := types.RegisterUserPayload{
// 			FirstName: "user",
// 			LastName: "test",
// 			Email: "abc@gmail.com",
// 			Password: "12345",
// 		}
// 		body, _ := json.Marshal(payload) // Marshal the payload to JSON

// 		req, err := http.NewRequest("POST", "/register", strings.NewReader(string(body))) // Create a new HTTP request;

// 		if err != nil {
// 			t.Fatalf("Failed to create request: %v", err)
// 		}

// 		rr := httptest.NewRecorder() // Create a ResponseRecorder to capture the response
// 		router := mux.NewRouter() // Create a new router
// 		router.HandleFunc("/register", handler.handleRegister).Methods("POST") // Register the handler function for the route
// 		router.ServeHTTP(rr, req) // Serve the HTTP request using the router

// 		if rr.Code != http.StatusBadRequest {
// 			t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, rr.Code)
// 		}
// 	})

// 	t.Run("should create user successfully", func(t *testing.T) {})
// }


// type MockUserStore struct {
	
// }



// func (m *MockUserStore) GetUserByEmail(email string) (*types.User, error) {
// 	return nil,fmt.Errorf("Mail was not found")
// }

// func (m *MockUserStore) CreateUser(payload *types.RegisterUserPayload) (*types.User, error) {
// 	return &types.User{ID: 1, FirstName: payload.FirstName, Email: payload.Email, LastName: payload.LastName}, nil
// }
 
// func (m *MockUserStore) GetUserById(id int64) (*types.User, error) {
// 	return nil, nil
// }