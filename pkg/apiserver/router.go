package apiserver

import (
	swagger "github.com/arsmn/fiber-swagger/v2"
	"github.com/gofiber/fiber/v2"
	_ "github.com/majian159/kubelemon/docs"
	"github.com/majian159/kubelemon/pkg/apiserver/handlers"
)

// @title KubeLemon API
// @version 1.0
// @description This is a swagger for KubeLemon
// @termsOfService https://github.com/majian159/kubelemon
// @contact.name API Support
// @contact.email 46617237@qq.com
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @BasePath /api/v1alpha1
func registerRoute(app *fiber.App) {

	// swagger
	{
		app.Get("/swagger/*", swagger.Handler)
		app.Get("/swagger/*", swagger.New(swagger.Config{
			DocExpansion: "none",
		}))
	}

	v1Group := app.Group("/api/v1alpha1")
	_ = v1Group

	nsGroup := v1Group.Group("/namespaces/:namespace")

	{
		clusterGroup := nsGroup.Group("/clusters")
		clusterGroup.Get("/", handlers.ListCluster)
		clusterGroup.Get("/:name", handlers.GetCluster)
		clusterGroup.Post("/", handlers.CreateCluster)
		clusterGroup.Patch("/:name", handlers.UpdateCluster)
		clusterGroup.Delete("/:name", handlers.DeleteCluster)
	}

}
