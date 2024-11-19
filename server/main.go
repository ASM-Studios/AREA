package main

import (
	"github.com/ASM-Studios/AREA/internal/routers"
)

func main() {
	router := routers.SetupRouter()
	err := router.Run()
	if err != nil {
		return
	}
}
