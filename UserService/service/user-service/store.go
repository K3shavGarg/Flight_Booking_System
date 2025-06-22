package userservice

import (
	"database/sql"
	"fmt"

	"github.com/K3shavGarg/user-service/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{
		db : db,
	}
}

func (s *Store) GetUserByEmail(email string) (*types.User, error) {
	row := s.db.QueryRow("SELECT * FROM users WHERE email = ?", email)
	
	var user types.User
	err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Password, &user.Email,&user.CreatedAt, &user.Is_Admin)
	if err == sql.ErrNoRows {
		return nil, nil // user not found
	}
	if err != nil {
		return nil, err // some other error
	}
	return &user, nil
}

func (s *Store) CreateUser(payload *types.RegisterUserPayload) (*types.User, error) {
	stmt, err := s.db.Prepare("INSERT INTO users (first_name, last_name, email, password,is_admin) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	res, err := stmt.Exec(payload.FirstName, payload.LastName, payload.Email, payload.Password, payload.IsAdmin)
	if err != nil {
		return nil, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}

	user := &types.User{
		ID:        id,
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		Email:     payload.Email,
		Password:  payload.Password,
		Is_Admin:  payload.IsAdmin,
	}

	return user, nil
}


func (s *Store) GetUserById(id int64) (*types.User, error) {
	// Id is unique so only one row will be returned
	row := s.db.QueryRow("SELECT * FROM users WHERE id = ?", id)
	var user types.User
	err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Password, &user.Email, &user.Is_Admin, &user.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil // user not found
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user by id: %v", err)
	}
	return &user, nil // user found
}
 

// Sessions

func (s *Store) CreateSession(session *types.Session) (*types.Session, error) {
	stmt, err := s.db.Prepare("INSERT INTO sessions (id, user_email, refresh_token, is_revoked, expires_at) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	_ , err = stmt.Exec(session.ID, session.UserEmail, session.RefreshToken, session.IsRevoked, session.Expires_At)
	if err != nil {
		return nil ,err
	}
	return session, nil
}

func (s *Store) DeleteSession(id string) error {
	_,err := s.db.Exec("DELETE FROM sessions WHERE id = ?", id)
	if err != nil {
		return err
	}
	return nil
}



