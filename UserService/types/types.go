package types

import "time"

type UserStore interface { // Why interface? To allow for mocking in tests.
	// How in mocking? By creating a mock implementation of this interface.
	GetUserByEmail(email string) (*User, error)
	CreateUser(payload *RegisterUserPayload) (*User, error)
	GetUserById(id int64) (*User, error)
	CreateSession(*Session) (*Session, error)
	DeleteSession(id string) error
}

type RegisterUserPayload struct {
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=3"` // Password must be at least 8 characters long
	IsAdmin   bool   `json:"is_admin" validate:"required"` 
}

type LoginUserPayload struct {
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required"`
}

type LoginUserResponse struct {
	SessionID     string `json:"session_id"`
	AccessToken string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	AccessTokenExpiresAt time.Time `json:"access_token_expires_at"`
	RefreshTokenExpiresAt time.Time `json:"refresh_token_expires_at"`
	User		 UserRes `json:"user"` 
}

type RenewAccessTokenPayload struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}
type RenewAccessTokenResponse struct {
	AccessToken string   `json:"access_toke"`
	AccessTokenExpiresAt time.Time `json:"access_token_expires_at"`
}

type UserRes struct {
	Name 	string `json:"name"`
	Email 	string `json:"email"`
	IsAdmin bool   `json:"is_admin"`
}

type User struct {
	ID        int64     `json:"id" db:"id"`
	FirstName string    `json:"first_name" db:"first_name"`
	LastName  string    `json:"last_name" db:"last_name"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"-" db:"password"` // Password should not be exposed in API responses
	Is_Admin   bool      `json:"is_admin" db:"is_admin"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Session struct {
	ID		string     `db:"id"`
	UserEmail string    `db:"user_email"`
	RefreshToken string `db:"refresh_token"`
	IsRevoked bool      `db:"is_revoked"`
	CreatedAt time.Time `db:"created_at"`
	Expires_At time.Time `db:"expires_at"`
}