# KubeLemon

# Getting Started

## Prerequisites

- [KubeVela](https://kubevela.io/docs/install)

## Quickstart

1. Start apiserver:
   ```sh
   make run-apiserver
   ```
2. Start dashboard:
   ```sh
   make run-dashboard
   ```
- The api swagger will be served at http://localhost:8080/swagger/
- The dashboard will be served at http://localhost:8000

# To-do

- Namespaces support
- More Component/Trait forms
- Provide Trait/Component forms as plugins
- Metric chart
- More...

# Screenshot

## Application

### Application List

![](doc/images/applications.png)

### Application Create

![](doc/images/applications_create.png)

### Application Edit

![](doc/images/applications_edit.png)

![](doc/images/applications_edit_component_1.png)

![](doc/images/applications_edit_component_2.png)

![](doc/images/applications_edit_component_3.png)

![](doc/images/applications_edit_component_4.png)

![](doc/images/applications_edit_component_5.png)

## Clusters

### Cluster List

![](doc/images/clusters.png)

![](doc/images/clusters_create.png)

![](doc/images/clusters_edit.png)

![](doc/images/clusters_delete.png)

## OpenAPI

![](doc/images/openapi.png)
