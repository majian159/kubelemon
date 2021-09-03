export type ComponentTraitModel = API.ComponentTrait & { component: ComponentModel }

export type ComponentModel = Omit<API.Component, "traits"> & { application: ApplicationModel, traits: ComponentTraitModel[] }

export type ApplicationModel = Omit<API.Application, "components"> & { components: ComponentModel[] }

export function convertApplications(applications: API.Application[]): ApplicationModel[] {
    return applications.map(convertApplication);
}

export function convertApplication(application: API.Application): ApplicationModel {
    const model: ApplicationModel = {
        ...application,
        components: [],
    };
    model.components = convertComponents(model, application.components ?? []);
    return model;
}

function convertComponents(
    application: ApplicationModel,
    components: API.Component[],
): ComponentModel[] {
    return components.map((component) => {
        const model: ComponentModel = {
            ...component,
            application,
            traits: [],
        };
        model.traits = convertTraits(model, component.traits ?? []);
        return model;
    });
}

function convertTraits(
    component: ComponentModel,
    traits: API.ComponentTrait[],
): ComponentTraitModel[] {
    return traits.map((trait) => {
        const model: ComponentTraitModel = {
            ...trait,
            component,
        };
        return model;
    });
}

export type ComponentBaseProperties = {
    cmd?: string[];
    env?: Env[];
    image: string;
    imagePullPolicy?: ImagePullPolicy;
    cpu?: string;
    memory?: string;
    volumes?: Volume[];
    livenessProbe?: LivenessProbe;
    readinessProbe?: ReadinessProbe;
    imagePullSecrets?: string[];
};

export type ImagePullPolicy = 'Always' | 'IfNotPresent' | 'Never' | string;

export type WorkerComponentProperties = ComponentBaseProperties;

export type WebServiceComponentProperties = ComponentBaseProperties & {
    port: number;
};

export type TaskComponentProperties = Omit<
    ComponentBaseProperties,
    'imagePullPolicy' | 'imagePullSecrets'
> & {
    count: number;
    restart: 'Never' | 'OnFailure' | string;
};

export type Env = {
    name: string;
    value?: string;
    valueFrom?: {
        secretKeyRef: { name: string; key: string };
    };
};

export type ReadinessProbe = {
    exec?: { command: string[] };
    httpGet?: { path: string; port: number; httpHeaders: { name: string; value: string }[] };
    tcpSocket?: { port: number };
    initialDelaySeconds: number;
    periodSeconds: number;
    timeoutSeconds: number;
    successThreshold: number;
    failureThreshold: number;
};

export type LivenessProbe = Omit<ReadinessProbe, 'successThreshold'>;

export type Volume = {
    name: string;
    mountPath: string;
    type: VolumeType;
};

export type VolumeType = 'pvc' | 'configMap' | 'secret' | 'emptyDir' | string;
