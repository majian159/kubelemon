package application

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/ahmetb/go-linq/v3"
	"github.com/gofiber/fiber/v2"
	"github.com/majian159/kubelemon/pkg/apiserver/appcontext"
	atypes "github.com/majian159/kubelemon/pkg/apiserver/types"
	"github.com/oam-dev/kubevela-core-api/apis/core.oam.dev/common"
	"github.com/oam-dev/kubevela-core-api/apis/core.oam.dev/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
)

func RegisterRoutes(r fiber.Router) {
	r.Get("/", List)
	r.Get("/:name", Get)
	r.Patch("/:name", Update)
	r.Delete("/:name", Delete)
}

// List
// @Tags applications
// @ID listApplications
// @Param namespace path string true "Namespace name"
// @Param query query types.ListQuery false "query"
// @Success 200 {object} ListResponse
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} ListResponse
// @Router /namespaces/{namespace}/applications [get]
func List(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")

	q := new(atypes.ListQuery)
	if err := ctx.QueryParser(q); err != nil {
		return err
	}

	client := appcontext.Get(ctx).GetVelaClient()
	list, err := client.CoreV1beta1().Applications(namespace).List(context.Background(), metav1.ListOptions{})
	if err != nil {
		return err
	}

	var apps []*Application
	linq.From(list.Items).
		Where(func(i interface{}) bool {
			return i.(v1beta1.Application).DeletionTimestamp == nil
		}).
		Select(func(i interface{}) interface{} {
			app := i.(v1beta1.Application)
			return convertApplication(&app)
		}).ToSlice(&apps)

	var result []*Application
	total, err := q.CreateFilterExecutor(apps, func(keywords string, i interface{}) bool {
		app := i.(*Application)
		keywords = strings.ToLower(keywords)
		return strings.Contains(strings.ToLower(app.Name), keywords) || strings.Contains(strings.ToLower(app.Description), keywords)
	}).Exec(&result)
	if err != nil {
		return err
	}

	return ctx.JSON(&ListResponse{
		Items: result,
		Total: total,
	})
}

// Get
// @Summary Get application
// @Tags applications
// @ID getApplication
// @Param namespace path string true "Namespace name"
// @Param name path string true "Application name"
// @Success 200 {object} Application
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} Application
// @Router /namespaces/{namespace}/applications/{name} [get]
func Get(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")
	name := ctx.Params("name")

	application, err := appcontext.Get(ctx).GetVelaClient().CoreV1beta1().Applications(namespace).Get(context.Background(), name, metav1.GetOptions{})
	if err != nil {
		return err
	}

	return ctx.JSON(convertApplication(application))
}

// Update
// @Summary Update application
// @Tags applications
// @ID patchApplication
// @Param namespace path string true "Namespace name"
// @Param name path string true "Application name"
// @Param cluster body Application true "request"
// @Success 200 {object} Application
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Response default {object} Application
// @Router /namespaces/{namespace}/applications/{name} [patch]
func Update(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")
	name := ctx.Params("name")

	app := new(Application)
	if err := ctx.BodyParser(&app); err != nil {
		return err
	}

	applications := appcontext.Get(ctx).GetVelaClient().CoreV1beta1().Applications(namespace)

	application, err := applications.Get(context.Background(), name, metav1.GetOptions{})

	fillApplication(app, application)

	application, err = applications.Update(context.Background(), application, metav1.UpdateOptions{})
	if err != nil {
		return err
	}

	return ctx.JSON(convertApplication(application))
}

// Delete godoc
// @Summary Delete an application
// @Tags applications
// @ID deleteApplication
// @Param namespace path string true "Namespace name"
// @Param name path string true "Application name"
// @Success 204 {object} string
// @Failure 400 {object} string
// @Failure 404 {object} string
// @Failure 500 {object} string
// @Router /namespaces/{namespace}/applications/{name} [delete]
func Delete(ctx *fiber.Ctx) error {
	namespace := ctx.Params("namespace")
	name := ctx.Params("name")

	applications := appcontext.Get(ctx).GetVelaClient().CoreV1beta1().Applications(namespace)
	err := applications.Delete(context.Background(), name, metav1.DeleteOptions{})
	if err != nil {
		return err
	}
	return ctx.SendStatus(http.StatusNoContent)
}

func fillApplication(app *Application, application *v1beta1.Application) {
	if application.Annotations == nil {
		application.Annotations = make(map[string]string)
	}

	application.Annotations[atypes.DescriptionField] = app.Description

	appComponents := make([]common.ApplicationComponent, 0, len(app.Components))
	for _, component := range app.Components {
		traits := make([]common.ApplicationTrait, 0, len(component.Traits))
		for _, trait := range component.Traits {
			properties, _ := convertProperties(trait.Properties)
			traits = append(traits, common.ApplicationTrait{
				Type:       trait.Type,
				Properties: runtime.RawExtension{Raw: properties.Raw},
			})
		}

		properties, _ := convertProperties(component.Properties)
		appComponents = append(appComponents, common.ApplicationComponent{
			Name:             component.Name,
			Type:             component.Type,
			ExternalRevision: component.ExternalRevision,
			Properties:       runtime.RawExtension{Raw: properties.Raw},
			Traits:           traits,
			Scopes:           component.Scopes,
		})
	}

	application.Spec.Components = appComponents
}

func convertApplication(app *v1beta1.Application) *Application {
	return &Application{
		Name:         app.Name,
		Description:  app.Annotations[atypes.DescriptionField],
		CreationTime: app.CreationTimestamp.UTC(),
		Components:   convertComponents(app.Spec.Components),
	}
}

func convertComponents(components []common.ApplicationComponent) []*Component {
	var result []*Component
	linq.From(components).Select(func(i interface{}) interface{} {
		component := i.(common.ApplicationComponent)
		return convertComponent(component)
	}).ToSlice(&result)
	return result
}

func convertComponent(component common.ApplicationComponent) *Component {
	properties, _ := convertRawExtension(component.Properties)

	return &Component{
		Name:             component.Name,
		Type:             component.Type,
		ExternalRevision: component.ExternalRevision,
		Properties:       properties,
		Traits:           convertTraits(component.Traits),
		Scopes:           component.Scopes,
	}
}

func convertTraits(traits []common.ApplicationTrait) []*ComponentTrait {
	var result []*ComponentTrait
	linq.From(traits).Select(func(i interface{}) interface{} {
		trait := i.(common.ApplicationTrait)
		return convertTrait(trait)
	}).ToSlice(&result)
	return result
}

func convertTrait(trait common.ApplicationTrait) *ComponentTrait {
	properties, _ := convertRawExtension(trait.Properties)
	return &ComponentTrait{
		Properties: properties,
		Type:       trait.Type,
	}
}

func convertRawExtension(re runtime.RawExtension) (map[string]interface{}, error) {
	properties := make(map[string]interface{}, 10)
	if err := json.Unmarshal(re.Raw, &properties); err != nil {
		return nil, err
	}
	return properties, nil
}

func convertProperties(properties map[string]interface{}) (*runtime.RawExtension, error) {
	data, err := json.Marshal(properties)
	if err != nil {
		return nil, err
	}
	return &runtime.RawExtension{Raw: data}, nil
}
