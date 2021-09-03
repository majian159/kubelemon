import { Form } from 'antd';
import { useEffect } from 'react';

import { aggreValidators, fillInstanceFromAntd, useFormPart } from '@/components/FormPart';
import ProCard from '@ant-design/pro-card';

import { Command, ContainerImage, FormContainer, HealthCheck } from '../../Forms';
import TaskComponent from '../TaskComponent';
import WebServiceComponent from '../WebServiceComponent';

import type { FormPartProps } from '@/components/FormPart';
import type {
  LivenessProbe,
  ReadinessProbe,
  ComponentBaseProperties,
  ComponentModel,
} from '@/pages/application/types';

const TypeComponent: React.FC<{ component: ComponentModel }> = ({ component }) => {
  switch (component.type) {
    case 'webservice':
      return <WebServiceComponent />;
    case 'task':
      return <TaskComponent />;
    default:
      return null;
  }
};

type BaseFormType = Omit<ComponentBaseProperties, 'cmd' | 'imagePullSecrets'> & {
  cmd?: string;
  imagePullSecrets?: string;
};

const BaseForm: React.FC<FormPartProps<ComponentBaseProperties> & { component: ComponentModel }> = (
  props,
) => {
  const { instance, values, onChange, component } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    if (instance == null) {
      return;
    }
    fillInstanceFromAntd(instance, form, {
      transform: (value: BaseFormType) => {
        const ref = value;

        let cmd = ref.cmd?.split('\n')?.filter((i) => i !== '');
        let imagePullSecrets = ref.imagePullSecrets?.split('\n')?.filter((i) => i !== '');

        if ((cmd?.length ?? 0) <= 0) {
          cmd = undefined;
        }
        if ((imagePullSecrets?.length ?? 0) <= 0) {
          imagePullSecrets = undefined;
        }
        return {
          ...ref,
          cmd,
          imagePullSecrets,
        };
      },
    });
  }, [instance, values, form]);

  const initialValues: BaseFormType = {
    image: '',
    ...{ imagePullPolicy: 'Always' },
    ...values,
    cmd: values?.cmd?.join('\n'),
    imagePullSecrets: values?.imagePullSecrets?.join('\n'),
  };
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={(_, vs) => {
        onChange?.(vs);
      }}
    >
      <FormContainer instance={instance} title="Basic">
        <TypeComponent component={component} />
        <ContainerImage />
        <Command name="cmd" />
      </FormContainer>
    </Form>
  );
};

function ComponentForm(props: FormPartProps<ComponentModel>) {
  const { instance, onChange, values } = props;

  const [baseFormInstance] = useFormPart<ComponentBaseProperties>();
  const [healthCheckFormInstance] = useFormPart<{
    readinessProbe?: ReadinessProbe;
    livenessProbe?: LivenessProbe;
  }>();

  useEffect(() => {
    if (instance == null || values == null) {
      return;
    }
    instance.getValues = () => {
      values.properties = {
        ...values.properties,
        ...baseFormInstance.getValues(),
        ...healthCheckFormInstance.getValues(),
      };

      return values;
    };
    instance.setValues = (v) => {
      const baseProperties = v?.properties as ComponentBaseProperties;
      baseFormInstance.setValues({ ...values, ...baseProperties });
      healthCheckFormInstance.setValues({
        readinessProbe: baseProperties.readinessProbe,
        livenessProbe: baseProperties.livenessProbe,
      });
    };
    instance.validates = aggreValidators([baseFormInstance, healthCheckFormInstance]);
  }, [instance, baseFormInstance, values, healthCheckFormInstance]);

  if (values == null) {
    return null;
  }

  const baseProperties: ComponentBaseProperties = (values.properties ?? {}) as any;

  return (
    <>
      <ProCard wrap gutter={[16, 16]}>
        <BaseForm
          instance={baseFormInstance}
          values={baseProperties}
          onChange={(v) => onChange?.({ ...values, properties: { ...values.properties, ...v } })}
          component={values}
        />
        <FormContainer instance={healthCheckFormInstance} title="Health Check">
          <HealthCheck
            instance={healthCheckFormInstance}
            values={{
              readinessProbe: baseProperties.readinessProbe,
              livenessProbe: baseProperties.livenessProbe,
            }}
            onChange={(v) => onChange?.({ ...values, properties: { ...values.properties, ...v } })}
          />
        </FormContainer>
      </ProCard>
    </>
  );
}

export default ComponentForm;
