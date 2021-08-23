package handlers

import (
	"net/http"
	"strings"

	"github.com/majian159/kubelemon/pkg/apiserver/types"

	"github.com/gofiber/fiber/v2"
	"github.com/majian159/kubelemon/pkg/apiserver/appcontext"
	"github.com/majian159/kubelemon/pkg/domain"
	"github.com/majian159/kubelemon/pkg/domain/cluster"
)

type ClusterListResponse struct {
	Items []*cluster.Cluster `json:"items,omitempty"`
	Total int                `json:"total"`
}

type CreateClusterRequest struct {
	Name        string `json:"name,omitempty"`
	Config      string `json:"config,omitempty"`
	Description string `json:"description,omitempty"`
}

type UpdateClusterRequest struct {
	Config      string `json:"config,omitempty"`
	Description string `json:"description,omitempty"`
}

// ListCluster
// @Tags clusters
// @ID listClusters
// @Param namespace path string true "Namespace name"
// @Param query query types.ListQuery false "query"
// @Success 200 {object} ClusterListResponse
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} ClusterListResponse
// @Router /namespaces/{namespace}/clusters [get]
func ListCluster(c *fiber.Ctx) error {
	namespace := c.Params("namespace")

	q := new(types.ListQuery)
	if err := c.QueryParser(q); err != nil {
		return err
	}

	service := getService(c)
	list, _, err := service.List(namespace, q.CreateQuery())
	if err != nil {
		return err
	}

	total, err := q.CreateFilterExecutor(list, func(keywords string, i interface{}) bool {
		cl := i.(*cluster.Cluster)
		return strings.Contains(cl.Name, keywords) || strings.Contains(cl.Description, q.Keywords)
	}).Exec(&list)
	if err != nil {
		return err
	}

	return c.JSON(&ClusterListResponse{
		Items: list,
		Total: total,
	})
}

// GetCluster
// @Summary Get cluster
// @Tags clusters
// @ID getCluster
// @Param namespace path string true "Namespace name"
// @Param cluster path string true "Cluster name"
// @Success 200 {object} cluster.Cluster
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} cluster.Cluster
// @Router /namespaces/{namespace}/clusters/{cluster} [get]
func GetCluster(c *fiber.Ctx) error {
	namespace := c.Params("namespace")
	name := c.Params("name")

	service := getService(c)
	cl, err := service.Get(namespace, name)
	if domain.IsNotExist(err) {
		return c.SendStatus(http.StatusNotFound)
	}
	if err != nil {
		return err
	}

	return c.JSON(cl)
}

// CreateCluster
// @Summary Create cluster
// @Tags clusters
// @ID postCluster
// @Param namespace path string true "Namespace name"
// @Param cluster body CreateClusterRequest true "Create cluster"
// @Success 200 {object} cluster.Cluster
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} cluster.Cluster
// @Router /namespaces/{namespace}/clusters [post]
func CreateCluster(c *fiber.Ctx) error {
	namespace := c.Params("namespace")
	m := new(CreateClusterRequest)
	if err := c.BodyParser(m); err != nil {
		return err
	}

	cl, err := getService(c).Create(namespace, &cluster.Cluster{
		Name:        m.Name,
		Description: m.Description,
		Config:      m.Config,
	})
	if domain.IsExist(err) {
		return c.SendStatus(http.StatusConflict)
	}
	if err != nil {
		return err
	}

	return c.JSON(cl)
}

// UpdateCluster
// @Summary Update cluster
// @Tags clusters
// @ID patchCluster
// @Param namespace path string true "Namespace name"
// @Param cluster path string true "Cluster name"
// @Param cluster body UpdateClusterRequest true "Patch cluster"
// @Success 200 {object} cluster.Cluster
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} cluster.Cluster
// @Router /namespaces/{namespace}/clusters/{cluster} [patch]
func UpdateCluster(c *fiber.Ctx) error {
	namespace := c.Params("namespace")
	name := c.Params("name")
	m := new(UpdateClusterRequest)
	if err := c.BodyParser(m); err != nil {
		return err
	}

	cl, err := getService(c).Update(namespace, &cluster.Cluster{
		Name:        name,
		Description: m.Description,
		Config:      m.Config,
	})
	if domain.IsNotExist(err) {
		return c.SendStatus(http.StatusNotFound)
	}
	if err != nil {
		return err
	}

	return c.JSON(cl)
}

// DeleteCluster godoc
// @Summary Delete a cluster
// @Tags clusters
// @ID deleteCluster
// @Param namespace path string true "Namespace name"
// @Param cluster path string true "Cluster name"
// @Success 204 {object} string
// @Failure 400 {object} string
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Router /namespaces/{namespace}/clusters/{cluster} [delete]
func DeleteCluster(c *fiber.Ctx) error {
	namespace := c.Params("namespace")
	name := c.Params("name")

	err := getService(c).Delete(namespace, name)
	if domain.IsNotExist(err) {
		return c.SendStatus(http.StatusNotFound)
	}
	if err != nil {
		return err
	}
	return c.SendStatus(http.StatusNoContent)
}

func getService(c *fiber.Ctx) cluster.Service {
	context := appcontext.Get(c)
	return cluster.NewClusterService(context.GetKubeClient(), context.GetVelaClient())
}
