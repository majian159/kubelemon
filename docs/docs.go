// Package docs GENERATED BY THE COMMAND ABOVE; DO NOT EDIT
// This file was generated by swaggo/swag
package docs

import (
	"bytes"
	"encoding/json"
	"strings"
	"text/template"

	"github.com/swaggo/swag"
)

var doc = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "https://github.com/majian159/kubelemon",
        "contact": {
            "name": "API Support",
            "email": "46617237@qq.com"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/namespaces/{namespace}/applications": {
            "get": {
                "tags": [
                    "applications"
                ],
                "operationId": "listApplications",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "name": "keywords",
                        "in": "query"
                    },
                    {
                        "type": "integer",
                        "default": 10,
                        "name": "limit",
                        "in": "query"
                    },
                    {
                        "type": "integer",
                        "default": 0,
                        "name": "offset",
                        "in": "query"
                    },
                    {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "name": "sortBy",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/application.ListResponse"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/application.ListResponse"
                        }
                    }
                }
            }
        },
        "/namespaces/{namespace}/applications/{name}": {
            "get": {
                "tags": [
                    "applications"
                ],
                "summary": "Get application",
                "operationId": "getApplication",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Application name",
                        "name": "name",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/application.Application"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/application.Application"
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "applications"
                ],
                "summary": "Delete an application",
                "operationId": "deleteApplication",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Application name",
                        "name": "name",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "204": {
                        "description": "No Content",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            },
            "patch": {
                "tags": [
                    "applications"
                ],
                "summary": "Update application",
                "operationId": "patchApplication",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Application name",
                        "name": "name",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "request",
                        "name": "cluster",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/application.Application"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/application.Application"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/application.Application"
                        }
                    }
                }
            }
        },
        "/namespaces/{namespace}/clusters": {
            "get": {
                "tags": [
                    "clusters"
                ],
                "operationId": "listClusters",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "name": "keywords",
                        "in": "query"
                    },
                    {
                        "type": "integer",
                        "default": 10,
                        "name": "limit",
                        "in": "query"
                    },
                    {
                        "type": "integer",
                        "default": 0,
                        "name": "offset",
                        "in": "query"
                    },
                    {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "name": "sortBy",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/cluster.ListResponse"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/cluster.ListResponse"
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "clusters"
                ],
                "summary": "Create cluster",
                "operationId": "postCluster",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "request",
                        "name": "cluster",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/cluster.CreateClusterRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/cluster.Cluster"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/cluster.Cluster"
                        }
                    }
                }
            }
        },
        "/namespaces/{namespace}/clusters/{name}": {
            "get": {
                "tags": [
                    "clusters"
                ],
                "summary": "Get cluster",
                "operationId": "getCluster",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Cluster name",
                        "name": "name",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/cluster.Cluster"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/cluster.Cluster"
                        }
                    }
                }
            },
            "delete": {
                "tags": [
                    "clusters"
                ],
                "summary": "Delete a cluster",
                "operationId": "deleteCluster",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Cluster name",
                        "name": "name",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "204": {
                        "description": "No Content",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            },
            "patch": {
                "tags": [
                    "clusters"
                ],
                "summary": "Update cluster",
                "operationId": "patchCluster",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Cluster name",
                        "name": "name",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "request",
                        "name": "cluster",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/cluster.UpdateClusterRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/cluster.Cluster"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/cluster.Cluster"
                        }
                    }
                }
            }
        },
        "/namespaces/{namespace}/clusters/{name}/config": {
            "get": {
                "tags": [
                    "clusters"
                ],
                "summary": "Get cluster config",
                "operationId": "getClusterConfig",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Cluster name",
                        "name": "name",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/cluster.Config"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "default": {
                        "description": "",
                        "schema": {
                            "$ref": "#/definitions/cluster.Config"
                        }
                    }
                }
            },
            "put": {
                "tags": [
                    "clusters"
                ],
                "summary": "Put cluster config",
                "operationId": "putClusterConfig",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Namespace name",
                        "name": "namespace",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Cluster name",
                        "name": "name",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "config",
                        "name": "cluster",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/cluster.Config"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "default": {
                        "description": "",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "application.Application": {
            "type": "object",
            "properties": {
                "components": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/application.Component"
                    }
                },
                "creationTime": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "application.Component": {
            "type": "object",
            "properties": {
                "externalRevision": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "properties": {
                    "type": "object",
                    "additionalProperties": true
                },
                "scopes": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "string"
                    }
                },
                "traits": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/application.ComponentTrait"
                    }
                },
                "type": {
                    "type": "string"
                }
            }
        },
        "application.ComponentTrait": {
            "type": "object",
            "properties": {
                "properties": {
                    "type": "object",
                    "additionalProperties": true
                },
                "type": {
                    "type": "string"
                }
            }
        },
        "application.ListResponse": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/application.Application"
                    }
                },
                "total": {
                    "type": "integer"
                }
            }
        },
        "cluster.Cluster": {
            "type": "object",
            "properties": {
                "creationTime": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "cluster.Config": {
            "type": "object",
            "properties": {
                "config": {
                    "type": "string"
                }
            }
        },
        "cluster.CreateClusterRequest": {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "cluster.ListResponse": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/cluster.Cluster"
                    }
                },
                "total": {
                    "type": "integer"
                }
            }
        },
        "cluster.UpdateClusterRequest": {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string"
                }
            }
        }
    }
}`

type swaggerInfo struct {
	Version     string
	Host        string
	BasePath    string
	Schemes     []string
	Title       string
	Description string
}

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = swaggerInfo{
	Version:     "1.0",
	Host:        "",
	BasePath:    "/api/v1alpha1",
	Schemes:     []string{},
	Title:       "KubeLemon API",
	Description: "This is a swagger for KubeLemon",
}

type s struct{}

func (s *s) ReadDoc() string {
	sInfo := SwaggerInfo
	sInfo.Description = strings.Replace(sInfo.Description, "\n", "\\n", -1)

	t, err := template.New("swagger_info").Funcs(template.FuncMap{
		"marshal": func(v interface{}) string {
			a, _ := json.Marshal(v)
			return string(a)
		},
		"escape": func(v interface{}) string {
			// escape tabs
			str := strings.Replace(v.(string), "\t", "\\t", -1)
			// replace " with \", and if that results in \\", replace that with \\\"
			str = strings.Replace(str, "\"", "\\\"", -1)
			return strings.Replace(str, "\\\\\"", "\\\\\\\"", -1)
		},
	}).Parse(doc)
	if err != nil {
		return doc
	}

	var tpl bytes.Buffer
	if err := t.Execute(&tpl, sInfo); err != nil {
		return doc
	}

	return tpl.String()
}

func init() {
	swag.Register(swag.Name, &s{})
}
