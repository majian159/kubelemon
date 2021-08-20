package main

import (
	"log"

	"github.com/majian159/kubelemon/pkg/apiserver"
)

func main() {
	cmd := apiserver.NewAPIServerCommand()

	if err := cmd.Execute(); err != nil {
		log.Fatalln(err)
	}
}
