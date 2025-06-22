package sessionservice

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
		db: db,
	}
}
func (s *Store) RevokeSession(id string) error {
	res,err := s.db.Exec("UPDATE sessions SET is_revoked = ? WHERE id = ?", 1, id)
	if err != nil {
		return err
	}
	aff, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if aff == 0 {
		return fmt.Errorf("either no session with given id or is_revoked is already true for given id %s", id)
	}
	return nil
}
func (s *Store) GetSession(id string) (*types.Session, error) {
	row := s.db.QueryRow("SELECT * FROM sessions WHERE id = ?", id)

	var session types.Session
	err := row.Scan(&session.ID, &session.UserEmail, &session.RefreshToken, &session.IsRevoked, &session.CreatedAt, &session.Expires_At)

	if err != nil {
		return nil, err 
	}
	return &session, nil
}


