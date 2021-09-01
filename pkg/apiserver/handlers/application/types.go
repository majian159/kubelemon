package application

import (
	"time"
)

type Application struct {
	Name         string    `json:"name"`
	Description  string    `json:"description,omitempty"`
	CreationTime time.Time `json:"creationTime,omitempty"`

	Components []*Component `json:"components"`
}

type Component struct {
	Name             string                 `json:"name"`
	Type             string                 `json:"type"`
	ExternalRevision string                 `json:"externalRevision,omitempty"`
	Properties       map[string]interface{} `json:"properties,omitempty"`

	Traits []*ComponentTrait `json:"traits,omitempty"`
	Scopes map[string]string `json:"scopes,omitempty"`
}

type ComponentTrait struct {
	Properties map[string]interface{} `json:"properties,omitempty"`
	Type       string                 `json:"type"`
}

type ListResponse struct {
	Items []*Application `json:"items,omitempty"`
	Total int            `json:"total"`
}
