package cluster

import "time"

type Cluster struct {
	Name        string    `json:"name,omitempty"`
	Description string    `json:"description,omitempty"`
	Config      string    `json:"config,omitempty"`
	CreatedTime time.Time `json:"createdTime,omitempty"`
}
