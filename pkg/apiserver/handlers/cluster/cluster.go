package cluster

import (
	"context"
	"fmt"
	"github.com/ahmetb/go-linq/v3"
	"github.com/majian159/kubelemon/pkg/util"
	"github.com/oam-dev/kubevela-core-api/apis/core.oam.dev/v1beta1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"net/http"
	"strings"
	"time"

	atypes "github.com/majian159/kubelemon/pkg/apiserver/types"

	"github.com/gofiber/fiber/v2"
	"github.com/majian159/kubelemon/pkg/apiserver/appcontext"
)

type Cluster struct {
	Name         string    `json:"name,omitempty"`
	Description  string    `json:"description,omitempty"`
	CreationTime time.Time `json:"creationTime,omitempty"`
}

type ListResponse struct {
	Items []*Cluster `json:"items,omitempty"`
	Total int        `json:"total"`
}

type CreateClusterRequest struct {
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
}

type UpdateClusterRequest struct {
	Description string `json:"description,omitempty"`
}

func RegisterRoutes(r fiber.Router) {
	r.Get("/", List)
	r.Get("/:name", Get)
	r.Post("/", Create)
	r.Patch("/:name", Update)
	r.Delete("/:name", Delete)

	registerConfigRoutes(r)
}

func convert(c *v1beta1.Cluster) *Cluster {
	return &Cluster{
		Name:         c.Name,
		Description:  c.Annotations[atypes.DescriptionField],
		CreationTime: c.CreationTimestamp.UTC(),
	}
}

func convertVela(namespace string, c *Cluster) *v1beta1.Cluster {
	return &v1beta1.Cluster{
		ObjectMeta: v1.ObjectMeta{
			Namespace: namespace,
			Name:      c.Name,
			Labels: map[string]string{
				atypes.NameField: c.Name,
			},
			Annotations: map[string]string{
				atypes.DescriptionField: c.Description,
			},
		},
		Spec: v1beta1.ClusterSpec{
			KubeconfigSecretRef: v1beta1.LocalSecretReference{Name: c.Name},
		},
	}
}

// List
// @Tags clusters
// @ID listClusters
// @Param namespace path string true "Namespace name"
// @Param query query types.ListQuery false "query"
// @Success 200 {object} ListResponse
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} ListResponse
// @Router /namespaces/{namespace}/clusters [get]
func List(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")

	q := new(atypes.ListQuery)
	if err := ctx.QueryParser(q); err != nil {
		return err
	}

	clusters := appcontext.Get(ctx).GetVelaClient().
		CoreV1beta1().
		Clusters(namespace)

	list, err := clusters.List(context.Background(), v1.ListOptions{})
	if err != nil {
		return err
	}

	var items []*Cluster
	linq.From(list.Items).
		Where(func(i interface{}) bool {
			return i.(v1beta1.Cluster).DeletionTimestamp == nil
		}).
		Select(func(i interface{}) interface{} {
			cl := i.(v1beta1.Cluster)
			return convert(&cl)
		}).ToSlice(&items)

	var result []*Cluster
	total, err := q.CreateFilterExecutor(items,
		func(keywords string, i interface{}) bool {
			cl := i.(*Cluster)
			keywords = strings.ToLower(keywords)
			return strings.Contains(strings.ToLower(cl.Name), keywords) || strings.Contains(strings.ToLower(cl.Description), keywords)
		},
	).Exec(&result)
	if err != nil {
		return err
	}

	return ctx.JSON(&ListResponse{
		Items: result,
		Total: total,
	})
}

// Get
// @Summary Get cluster
// @Tags clusters
// @ID getCluster
// @Param namespace path string true "Namespace name"
// @Param name path string true "Cluster name"
// @Success 200 {object} Cluster
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} Cluster
// @Router /namespaces/{namespace}/clusters/{name} [get]
func Get(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")
	name := ctx.Params("name")

	clusters := appcontext.Get(ctx).GetVelaClient().CoreV1beta1().Clusters(namespace)
	cl, err := clusters.Get(context.Background(), name, v1.GetOptions{})
	if err != nil {
		return err
	}

	return ctx.JSON(convert(cl))
}

// Create
// @Summary Create cluster
// @Tags clusters
// @ID postCluster
// @Param namespace path string true "Namespace name"
// @Param cluster body CreateClusterRequest true "request"
// @Success 200 {object} Cluster
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} Cluster
// @Router /namespaces/{namespace}/clusters [post]
func Create(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")
	m := new(CreateClusterRequest)
	if err := ctx.BodyParser(m); err != nil {
		return err
	}

	clusters := appcontext.Get(ctx).GetVelaClient().CoreV1beta1().Clusters(namespace)
	cl, err := clusters.Create(context.Background(),
		convertVela(namespace, &Cluster{
			Name:        m.Name,
			Description: m.Description,
		}), v1.CreateOptions{})
	if err != nil {
		return err
	}

	return ctx.JSON(convert(cl))
}

// Update
// @Summary Update cluster
// @Tags clusters
// @ID patchCluster
// @Param namespace path string true "Namespace name"
// @Param name path string true "Cluster name"
// @Param cluster body UpdateClusterRequest true "request"
// @Success 200 {object} Cluster
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} Cluster
// @Router /namespaces/{namespace}/clusters/{name} [patch]
func Update(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")
	name := ctx.Params("name")
	m := new(UpdateClusterRequest)
	if err := ctx.BodyParser(m); err != nil {
		return err
	}

	payloadBytes := util.CreateReplacePatch(fmt.Sprintf("/metadata/annotations/%s", util.EscapeJsonPatch(atypes.DescriptionField)), m.Description)
	cr, err := appcontext.Get(ctx).GetVelaClient().CoreV1beta1().
		Clusters(namespace).
		Patch(context.Background(), name, types.JSONPatchType, payloadBytes, v1.PatchOptions{})
	if err != nil {
		return err
	}
	return ctx.JSON(convert(cr))
}

// Delete godoc
// @Summary Delete a cluster
// @Tags clusters
// @ID deleteCluster
// @Param namespace path string true "Namespace name"
// @Param name path string true "Cluster name"
// @Success 204 {object} string
// @Failure 400 {object} string
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Router /namespaces/{namespace}/clusters/{name} [delete]
func Delete(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")
	name := ctx.Params("name")

	clusters := appcontext.Get(ctx).GetVelaClient().CoreV1beta1().Clusters(namespace)
	err := clusters.Delete(context.Background(), name, v1.DeleteOptions{})
	if err != nil {
		return err
	}
	return ctx.SendStatus(http.StatusNoContent)
}
