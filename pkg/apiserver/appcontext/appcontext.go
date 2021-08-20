package appcontext

import (
	"github.com/majian159/kubevela-client/pkg/client/versioned"
	"k8s.io/client-go/kubernetes"
)

type AppContext struct {
	kubeClient kubernetes.Interface
	velaClient versioned.Interface
}

func NewAppContext(kubeClient kubernetes.Interface, velaClient versioned.Interface) *AppContext {
	return &AppContext{
		kubeClient: kubeClient,
		velaClient: velaClient,
	}
}

func (c *AppContext) GetKubeClient() kubernetes.Interface {
	return c.kubeClient
}

func (c *AppContext) GetVelaClient() versioned.Interface {
	return c.velaClient
}
