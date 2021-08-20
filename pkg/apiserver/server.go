package apiserver

import (
	"github.com/gofiber/fiber/v2"
	"github.com/majian159/kubelemon/pkg/apiserver/appcontext"
	"github.com/spf13/cobra"
)

func NewAPIServerCommand() *cobra.Command {
	s := NewServerOptions()

	cmd := &cobra.Command{
		Use: "kubelemon-apiserver",
		RunE: func(cmd *cobra.Command, args []string) error {
			return Run(s)
		},
		SilenceUsage: true,
	}

	versionCmd := &cobra.Command{
		Use:   "version",
		Short: "Print the version of apiserver",
		Run: func(cmd *cobra.Command, args []string) {
			cmd.Println("1.0.0")
		},
	}

	cmd.AddCommand(versionCmd)

	return cmd
}

func Run(o *ServerOptions) error {
	appContext := appcontext.NewAppContext(o.GetKubeClient(), o.GetVelaClient())

	app := fiber.New()

	app.Use(func(c *fiber.Ctx) error {
		appcontext.Set(c, appContext)
		return c.Next()
	})

	registerRoute(app)

	return app.Listen(o.Listen)
}
