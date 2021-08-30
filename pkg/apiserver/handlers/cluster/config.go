package cluster

import (
	"context"
	"encoding/base64"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/majian159/kubelemon/pkg/apiserver/appcontext"
	"github.com/majian159/kubelemon/pkg/util"
	"github.com/oam-dev/kubevela-core-api/apis/core.oam.dev/v1beta1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	ktypes "k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/kubernetes"
	"k8s.io/utils/pointer"
	"net/http"
)

const secretField = "config"

func registerConfigRoutes(r fiber.Router) {
	r.Get("/:name/config", GetConfig)
	r.Put("/:name/config", PutConfig)
}

type Config struct {
	Config string `json:"config"`
}

// GetConfig
// @Summary Get cluster config
// @Tags clusters
// @ID getClusterConfig
// @Param namespace path string true "Namespace name"
// @Param name path string true "Cluster name"
// @Success 200 {object} Config
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} Config
// @Router /namespaces/{namespace}/clusters/{name}/config [get]
func GetConfig(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")
	name := ctx.Params("name")

	config, err := getConfig(appcontext.Get(ctx).GetKubeClient(), namespace, name)
	if err != nil && !errors.IsNotFound(err) {
		return err
	}

	return ctx.JSON(config)
}

// PutConfig
// @Summary Put cluster config
// @Tags clusters
// @ID putClusterConfig
// @Param namespace path string true "Namespace name"
// @Param name path string true "Cluster name"
// @Param cluster body Config true "config"
// @Success 200 {object} string
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} string
// @Router /namespaces/{namespace}/clusters/{name}/config [put]
func PutConfig(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")
	name := ctx.Params("name")

	config := new(Config)
	if err := ctx.BodyParser(&config); err != nil {
		return err
	}
	appContext := appcontext.Get(ctx)

	secrets := appContext.GetKubeClient().
		CoreV1().
		Secrets(namespace)

	payloadBytes := util.CreateReplacePatch(fmt.Sprintf("/data/%s", util.EscapeJsonPatch(secretField)), base64.StdEncoding.EncodeToString([]byte(config.Config)))
	_, err := secrets.Patch(context.Background(), name, ktypes.JSONPatchType, payloadBytes, metav1.PatchOptions{})

	// patch success, return
	if err == nil {
		return ctx.SendStatus(http.StatusNoContent)
	}
	// patch error not notfound
	if !errors.IsNotFound(err) {
		return err
	}

	cluster, err := appContext.GetVelaClient().CoreV1beta1().Clusters(namespace).Get(context.Background(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}

	// create secret
	_, err = secrets.Create(context.Background(), &corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
			OwnerReferences: []metav1.OwnerReference{
				{
					APIVersion:         v1beta1.ClusterKindAPIVersion,
					Kind:               v1beta1.ClusterKind,
					Name:               cluster.Name,
					UID:                cluster.UID,
					Controller:         pointer.BoolPtr(true),
					BlockOwnerDeletion: pointer.BoolPtr(true),
				},
			},
		},
		Type: "Opaque",
		StringData: map[string]string{
			secretField: config.Config,
		},
	}, metav1.CreateOptions{})
	if err != nil {
		return err
	}

	return ctx.SendStatus(http.StatusNoContent)
}

func getConfig(client kubernetes.Interface, namespace, name string) (*Config, error) {
	config := &Config{Config: ""}

	item, err := client.CoreV1().
		Secrets(namespace).
		Get(context.Background(), name, metav1.GetOptions{})
	if err != nil {
		return config, err
	}

	if data := item.Data; data != nil {
		if bs, ok := data["config"]; ok {
			config.Config = string(bs)
		}
	}
	return config, nil
}
