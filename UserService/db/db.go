package db

import (
	"database/sql"
	"fmt"
	"github.com/go-sql-driver/mysql"
)

func NewMySQLStorage(cfg mysql.Config) (*sql.DB, error){
	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		return nil, fmt.Errorf("error opening MySQL connection: %w", err)
	}
	return db, nil
}