import { Button, Form, Statistic, Tabs, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

import { getApplication } from '@/services/kubelemon/applications';
import { WarningTwoTone } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { useParams } from '@umijs/runtime';

import Trait from '../components/Traits/Trait';
import { convertApplication } from '../types';
import Command from './components/Forms/Command';
import ContainerImage from './components/Forms/ContainerImage';
import ContainerImagePullPolicy from './components/Forms/ContainerImagePullPolicy';
import HealthCheck from './components/Forms/HealthCheck';

import type {
  LivenessProbe,
  ReadinessProbe,
  ComponentBaseProperties,
  ComponentModel,
  WebServiceComponentProperties,
} from '../types';
import type { Store } from 'antd/lib/form/interface';
import type { FormInstance } from 'antd';

const { Divider } = ProCard;

const Summary: React.FC<{ component: ComponentModel }> = ({ component }) => {
  return (
    <ProCard.Group direction="row">
      <ProCard>
        <Statistic title="Type" value={component.type} />
      </ProCard>
      <Divider type="vertical" />
      <ProCard>
        <Statistic title="External Revision" value={component.externalRevision} />
      </ProCard>
      <Divider type="vertical" />
      <ProCard>
        <Statistic title="Taris Count" value={component.traits.length} />
      </ProCard>
    </ProCard.Group>
  );
};

type FieldError = { name: any; value: any; errors?: string[] };

const FormPart: React.FC<{
  title: string;
  initialValues?: Store;
  onChange?: (values: any, form: FormInstance) => void;
  errors: FieldError[];
  setErrors: (errors: FieldError[]) => void;
}> = ({ title, initialValues, onChange, errors, setErrors, children }) => {
  const [form] = Form.useForm();

  return (
    <ProCard
      title={title}
      style={{ marginTop: '20px' }}
      headStyle={{ userSelect: 'none' }}
      bordered
      headerBordered
      collapsible
      extra={
        errors.length > 0 ? (
          <Tooltip
            color="red"
            title={errors.map((err) => {
              return (
                <div key={err.name}>
                  {err.name}
                  <ol>
                    {err.errors?.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ol>
                </div>
              );
            })}
          >
            <WarningTwoTone twoToneColor="#f5222d" style={{ fontSize: '1rem' }} />
          </Tooltip>
        ) : null
      }
      onCollapse={() => {
        form.validateFields();
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFieldsChange={(_, allFields) => {
          setErrors(
            allFields
              .filter((f) => (f.errors?.length ?? 0) > 0)
              .map((f) => ({ name: f.name, value: f.value, errors: f.errors })),
          );
        }}
        onValuesChange={(_, values) => {
          onChange?.(values, form);
        }}
      >
        {children}
      </Form>
    </ProCard>
  );
};

const ComponentForm: React.FC<{ component: ComponentModel }> = ({ component }) => {
  const [properties, setProperties] = useState<ComponentBaseProperties>(() => {
    const p = component.properties as ComponentBaseProperties;
    if (p.imagePullPolicy == null) {
      p.imagePullPolicy = 'IfNotPresent';
    }
    return p;
  });

  const [errors, setErrors] = useState<Record<string, FieldError[]>>({});

  return (
    <>
      <ProCard wrap gutter={[16, 16]}>
        <FormPart
          title="Base"
          initialValues={properties}
          onChange={(values) => {
            setProperties({ ...properties, ...values });
          }}
          errors={errors.base ?? []}
          setErrors={(es) => setErrors({ ...errors, base: es })}
        >
          <ContainerImage />
          <ContainerImagePullPolicy />
          <Command name="cmd" />
        </FormPart>
        <FormPart
          title="Health Check"
          onChange={(
            values: {
              readinessProbe?: ReadinessProbe & { mode: string };
              livenessProbe?: LivenessProbe & { mode: string };
            },
            form,
          ) => {
            const { readinessProbe, livenessProbe } = values;

            const port = (properties as WebServiceComponentProperties)?.port;
            const defaultProbe: LivenessProbe = {
              failureThreshold: 1,
              initialDelaySeconds: 5,
              periodSeconds: 15,
              timeoutSeconds: 5,
              httpGet: { port, path: '/', httpHeaders: [] },
              tcpSocket: { port },
            };

            const model: {
              livenessProbe?: LivenessProbe;
              readinessProbe?: ReadinessProbe;
            } = {};

            if (readinessProbe != null) {
              model.readinessProbe = {
                ...{
                  ...defaultProbe,
                  successThreshold: 1,
                },
                ...readinessProbe,
              };
            }
            if (livenessProbe != null) {
              model.livenessProbe = {
                ...defaultProbe,
                ...livenessProbe,
              };
            }

            if (model.readinessProbe != null && model.livenessProbe != null) {
              form.setFieldsValue({ ...model });
            }

            setProperties({ ...properties, ...model });
          }}
          errors={errors.health ?? []}
          setErrors={(es) => setErrors({ ...errors, health: es })}
        >
          <HealthCheck />
        </FormPart>
      </ProCard>
    </>
  );
};

const Taris: React.FC<{ component: ComponentModel }> = ({ component }) => {
  return (
    <Tabs tabPosition="left">
      {[
        component?.traits.map((trait) => {
          return (
            <Tabs.TabPane tab={trait.type} key={trait.type}>
              <Trait trait={trait} />
            </Tabs.TabPane>
          );
        }),
      ]}
    </Tabs>
  );
};
const Edit: React.FC<{ component: ComponentModel }> = ({ component }) => {
  return (
    <>
      <Summary component={component} />
      <div style={{ marginTop: '20px' }}>
        <ComponentForm component={component} />
      </div>
      <FormPart errors={[]} setErrors={() => {}} title="Taris">
        <Taris component={component} />
      </FormPart>
    </>
  );
};

export default () => {
  const { appName, name } = useParams<{ appName: string; name: string }>();
  const [component, setComponent] = useState<ComponentModel>();
  useEffect(() => {
    getApplication({ namespace: 'default', name: appName }).then((item) => {
      const app = convertApplication(item);
      setComponent(app.components.filter((c) => c.name === name)[0]);
    });
  }, [appName, name]);
  return (
    <PageContainer title={appName} subTitle={name} loading={component === undefined}>
      {component == null ? null : <Edit component={component} />}
      <FooterToolbar
        style={{
          left: 208,
          width: `calc(100% - 208px)`,
        }}
      >
        <Button type="primary">Save</Button>
      </FooterToolbar>
    </PageContainer>
  );
};
