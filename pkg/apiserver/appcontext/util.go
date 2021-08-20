package appcontext

import (
	"github.com/gofiber/fiber/v2"
)

const appContextKey = "appContext"

func Set(ctx *fiber.Ctx, appContext *AppContext) {
	ctx.Locals(appContextKey, appContext)
}

func Get(ctx *fiber.Ctx) *AppContext {
	appContext := ctx.Locals(appContextKey)
	return appContext.(*AppContext)
}
