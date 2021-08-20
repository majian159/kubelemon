package cluster

type Cluster struct {
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	Config      string `json:"config,omitempty"`
}
