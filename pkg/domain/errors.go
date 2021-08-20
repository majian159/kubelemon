package domain

import (
	"errors"
)

var (
	ErrNotExist = errors.New("resource does not exist")
	ErrExist    = errors.New("resource already exists")
)

func IsNotExist(err error) bool {
	return errors.Is(err, ErrNotExist)
}

func IsExist(err error) bool {
	return errors.Is(err, ErrExist)
}
