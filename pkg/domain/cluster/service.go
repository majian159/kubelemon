package cluster

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"

	"k8s.io/apimachinery/pkg/types"

	"k8s.io/utils/pointer"

	corev1 "k8s.io/api/core/v1"

	"github.com/ahmetb/go-linq/v3"

	"github.com/oam-dev/kubevela-core-api/apis/core.oam.dev/v1beta1"

	"github.com/majian159/kubelemon/pkg/domain"
	"github.com/majian159/kubevela-client/pkg/client/versioned"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

const (
	clusterLabel     = "cluster"
	secretField      = "config"
	descriptionField = "lemon/description"
)

type Service interface {
	List(namespace string, query *domain.Query) (clusters []*Cluster, total int, err error)
	Get(namespace, name string) (*Cluster, error)
	Create(namespace string, cluster *Cluster) (*Cluster, error)
	Update(namespace string, cluster *Cluster) (*Cluster, error)
	Delete(namespace, name string) error
}

type clusterService struct {
	kubeClient kubernetes.Interface
	velaClient versioned.Interface
}

func NewClusterService(kubeClient kubernetes.Interface, velaClient versioned.Interface) Service {
	return &clusterService{kubeClient: kubeClient, velaClient: velaClient}
}

func (c *clusterService) List(namespace string, query *domain.Query) (clusters []*Cluster, total int, err error) {
	clusterList, err := c.velaClient.CoreV1beta1().
		Clusters(namespace).
		List(context.Background(), metav1.ListOptions{
			LabelSelector: query.LabelSelector,
		})

	if err != nil {
		return nil, 0, err
	}

	// ignore deleting
	lq := linq.From(clusterList.Items).
		Where(func(i interface{}) bool {
			return i.(v1beta1.Cluster).ObjectMeta.DeletionTimestamp == nil
		})

	total = lq.Count()
	if total <= 0 {
		return []*Cluster{}, 0, nil
	}

	start, end := query.Pagination.GetPage(total)
	lq = lq.Skip(start).Take(end)

	if lq.Count() <= 0 {
		return []*Cluster{}, total, nil
	}

	var clusterNames []string
	lq.Select(func(i interface{}) interface{} {
		return i.(v1beta1.Cluster).Name
	}).ToSlice(&clusterNames)

	secrets, err := c.listConfigSecrets(namespace, clusterNames)
	if err != nil {
		return nil, 0, err
	}

	var result []*Cluster
	lq.Select(func(c interface{}) interface{} {
		cluster := c.(v1beta1.Cluster)
		secret := secrets[cluster.Name]
		return convertCluster(&cluster, secret)
	}).ToSlice(&result)

	return result, total, err
}

func (c *clusterService) Get(namespace, name string) (*Cluster, error) {
	list, total, err := c.List(namespace, &domain.Query{
		LabelSelector: fmt.Sprintf("%s = %s", clusterLabel, name),
		Pagination:    domain.NoPagination,
	})
	if err != nil {
		return nil, err
	}
	if total <= 0 || len(list) == 0 {
		return nil, domain.ErrNotExist
	}
	return list[0], nil
}

func (c *clusterService) Create(namespace string, cluster *Cluster) (*Cluster, error) {
	clusterResult, err := c.velaClient.CoreV1beta1().
		Clusters(namespace).
		Create(context.Background(),
			convertVelaCluster(namespace, cluster),
			metav1.CreateOptions{})

	if err != nil {
		return nil, err
	}

	_, err = c.kubeClient.CoreV1().Secrets(namespace).Create(context.Background(), &corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name: cluster.Name,
			Labels: map[string]string{
				clusterLabel: cluster.Name,
			},
			OwnerReferences: []metav1.OwnerReference{{
				APIVersion:         v1beta1.ClusterKindAPIVersion,
				Kind:               v1beta1.ClusterKind,
				Name:               clusterResult.Name,
				UID:                clusterResult.UID,
				Controller:         pointer.BoolPtr(true),
				BlockOwnerDeletion: pointer.BoolPtr(true),
			}},
		},
		StringData: map[string]string{
			secretField: cluster.Config,
		},
		Type: "Opaque",
	}, metav1.CreateOptions{})

	return convertCluster(clusterResult, cluster.Config), err
}

func (c *clusterService) Update(namespace string, cluster *Cluster) (*Cluster, error) {
	currentCluster, err := c.Get(namespace, cluster.Name)
	if err != nil {
		return currentCluster, err
	}

	if currentCluster.Config != cluster.Config {
		payloadBytes := createReplacePatch("/data/config", base64.StdEncoding.EncodeToString([]byte(cluster.Config)))
		_, err := c.kubeClient.CoreV1().
			Secrets(namespace).
			Patch(context.Background(), cluster.Name, types.JSONPatchType, payloadBytes, metav1.PatchOptions{})
		if err != nil {
			return nil, err
		}
	}

	if currentCluster.Description != cluster.Description {
		payloadBytes := createReplacePatch(fmt.Sprintf("/metadata/annotations/%s", escapeJsonPatch(descriptionField)), cluster.Description)
		cr, err := c.velaClient.CoreV1beta1().
			Clusters(namespace).
			Patch(context.Background(), cluster.Name, types.JSONPatchType, payloadBytes, metav1.PatchOptions{})

		if err != nil {
			return nil, err
		}
		return convertCluster(cr, cluster.Config), nil
	}

	return cluster, nil
}

func (c *clusterService) Delete(namespace, name string) error {
	return c.velaClient.CoreV1beta1().
		Clusters(namespace).
		Delete(context.Background(), name, metav1.DeleteOptions{})
}

func (c *clusterService) listConfigSecrets(namespace string, clusterNames []string) (map[string]string, error) {
	selector := fmt.Sprintf("%s in (%s)", clusterLabel, strings.Join(clusterNames, ","))

	list, err := c.kubeClient.CoreV1().
		Secrets(namespace).
		List(context.Background(), metav1.ListOptions{LabelSelector: selector})

	if err != nil {
		return nil, err
	}

	items := list.Items
	m := make(map[string]string, len(items))
	for _, s := range items {
		data, ok := s.Data[secretField]
		if !ok {
			continue
		}
		m[s.ObjectMeta.Labels[clusterLabel]] = string(data)
	}

	return m, nil
}

func convertCluster(cluster *v1beta1.Cluster, config string) *Cluster {
	annotations := cluster.ObjectMeta.Annotations
	description := annotations[descriptionField]

	return &Cluster{
		Name:        cluster.Name,
		Description: description,
		Config:      config,
		CreatedTime: cluster.ObjectMeta.CreationTimestamp.UTC(),
	}
}

func convertVelaCluster(namespace string, cluster *Cluster) *v1beta1.Cluster {
	return &v1beta1.Cluster{
		ObjectMeta: metav1.ObjectMeta{
			Namespace: namespace,
			Name:      cluster.Name,
			Labels: map[string]string{
				clusterLabel: cluster.Name,
			},
			Annotations: map[string]string{
				descriptionField: cluster.Description,
			},
		},
		Spec: v1beta1.ClusterSpec{
			KubeconfigSecretRef: v1beta1.LocalSecretReference{Name: cluster.Name},
		},
	}
}

func escapeJsonPatch(v string) string {
	if strings.Contains(v, "~") {
		v = strings.ReplaceAll(v, "~", "~0")
	}
	if strings.Contains(v, "/") {
		v = strings.ReplaceAll(v, "/", "~1")
	}
	return v
}

func createReplacePatch(path string, value interface{}) []byte {
	data, _ := json.Marshal(value)
	v := string(data)
	return []byte(fmt.Sprintf(`[{"op":"replace","path":"%s","value":%s}]`, path, v))
}
