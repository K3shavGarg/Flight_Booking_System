package token

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTMaker struct {
	secretKey string
}

func NewJWTMaker(secretKey string) *JWTMaker {
	return &JWTMaker{
		secretKey: secretKey,
	}
}

func (maker *JWTMaker) CreateToken(id int64, email string, is_Admin bool, duration time.Duration) (string, *UserClaims, error) {
	claims, err := NewUserClaims(id, email, is_Admin, duration)
	if err != nil {
		return "", nil, err
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(maker.secretKey))
	if err != nil {
		return "", nil, err
	}

	return tokenString, claims, nil
}

func (maker *JWTMaker) VerifyToken(tokenString string) (*UserClaims, error) {
	token,err := jwt.ParseWithClaims(
		tokenString, 
		&UserClaims{}, 
		func(token *jwt.Token) (interface{}, error) {
			// Verify the signing method
			_,ok := token.Method.(*jwt.SigningMethodHMAC)
			if !ok {
				return nil, fmt.Errorf("invalid token sigining method")
			}
			return []byte(maker.secretKey), nil
		},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %v", err)
	}
	claims, ok := token.Claims.(*UserClaims)

	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}
	return claims, nil
}