package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/K3shavGarg/user-service/cmd/api"
	"github.com/K3shavGarg/user-service/config"
	"github.com/K3shavGarg/user-service/db"
	"github.com/go-sql-driver/mysql"
)

func main() {

	db, err := db.NewMySQLStorage(mysql.Config{
		User:                 config.Env.DBUser,
		Passwd:               config.Env.DBPassword,
		Addr:                 config.Env.DBAddress,
		DBName:               config.Env.DBName,
		Net:                  "tcp",
		AllowNativePasswords: true, // this means that the MySQL server will use the native password authentication plugin.
		ParseTime:            true, // meaning time fields will be parsed as time.Time of golang
	})

	if err != nil {
		log.Fatal("error connecting to MySQL:", err)
	}

	initStorage(db)

	server := api.NewAPIServe(":8080", db)
	if err := server.Run(); err != nil {
		log.Fatal("error starting server")
	}

}

func initStorage(db *sql.DB) error {
	err := db.Ping()
	if err != nil {
	log.Println("Error pinging MySQL:", err)
		return fmt.Errorf("error pinging MySQL: %w", err)
	}
	
	log.Println("Successfully connected to MySQL")
	return nil
}
