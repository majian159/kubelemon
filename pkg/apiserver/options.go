package apiserver

import (
	"github.com/oam-dev/kubevela-core-api/pkg/generated/client/clientset/versioned"
	"os"
	"path/filepath"

	"k8s.io/client-go/kubernetes"

	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

type ServerOptions struct {
	Listen     string
	kubeConfig *rest.Config
	kubeClient kubernetes.Interface
	velaClient versioned.Interface
}

func NewServerOptions() *ServerOptions {
	return &ServerOptions{
		Listen: ":8080",
	}
}

func (o *ServerOptions) GetKubeConfig() *rest.Config {
	if o.kubeConfig != nil {
		return o.kubeConfig
	}

	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	config, err := clientcmd.BuildConfigFromFlags("", filepath.Join(home, ".kube/config"))
	if err != nil {
		panic(err)
	}
	o.kubeConfig = config
	return o.kubeConfig
}

func (o *ServerOptions) GetKubeClient() kubernetes.Interface {
	if o.kubeClient != nil {
		return o.kubeClient
	}

	o.kubeClient = kubernetes.NewForConfigOrDie(o.GetKubeConfig())
	return o.kubeClient
}

func (o *ServerOptions) GetVelaClient() versioned.Interface {
	if o.velaClient != nil {
		return o.velaClient
	}

	o.velaClient = versioned.NewForConfigOrDie(o.GetKubeConfig())
	return o.velaClient
}
