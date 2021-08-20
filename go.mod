module github.com/majian159/kubelemon

go 1.16

require (
	github.com/ahmetb/go-linq/v3 v3.2.0
	github.com/arsmn/fiber-swagger/v2 v2.17.0
	github.com/gofiber/fiber/v2 v2.17.0
	github.com/majian159/kubevela-client v1.0.7-1
	github.com/oam-dev/kubevela-core-api v1.0.7
	github.com/spf13/cobra v1.2.1
	github.com/swaggo/swag v1.7.1
	k8s.io/api v0.18.8
	k8s.io/apimachinery v0.18.8
	k8s.io/client-go v12.0.0+incompatible
	k8s.io/utils v0.0.0-20200603063816-c1c6865ac451
)

replace k8s.io/client-go => k8s.io/client-go v0.18.8
