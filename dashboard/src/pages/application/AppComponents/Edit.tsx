import { Button, Card, message, Statistic } from 'antd';
import { useEffect, useState } from 'react';

import { aggreValidators, useFormPart } from '@/components/FormPart';
import { getApplication, patchApplication } from '@/services/kubelemon/applications';
import ProCard from '@ant-design/pro-card';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { useParams } from '@umijs/runtime';

import { convertApplication } from '../types';
import { ComponentForm } from './components/Forms';
import Traits from './components/Forms/Traits';

import type { ApplicationModel, ComponentTraitModel, ComponentModel } from '../types';

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

export default () => {
  const { appName, name } = useParams<{ appName: string; name: string }>();
  const [component, setComponent] = useState<ComponentModel>();
  const namespace = 'default';
  useEffect(() => {
    getApplication({ namespace, name: appName }).then((item) => {
      const app = convertApplication(item);
      setComponent(app.components.filter((c) => c.name === name)[0]);
    });
  }, [appName, name]);

  const [componentFormPartInstance] = useFormPart<ComponentModel>();
  const [traitsInstance] = useFormPart<ComponentModel>();
  const [instance] = useFormPart<ComponentModel>();

  useEffect(() => {
    instance.getValues = () => {
      return {
        ...component!,
        ...componentFormPartInstance.getValues(),
        ...traitsInstance.getValues(),
      };
    };
    instance.setValues = (v) => {
      componentFormPartInstance.setValues(v);
      traitsInstance.setValues(v);
    };
    instance.validates = aggreValidators([componentFormPartInstance, traitsInstance]);
  }, [instance, component, componentFormPartInstance, traitsInstance]);

  return (
    <PageContainer title={name} subTitle={appName} loading={component === undefined}>
      {component == null ? null : (
        <>
          <Summary component={component} />
          <div id="component" style={{ marginTop: '20px' }}>
            <ComponentForm values={component} instance={componentFormPartInstance} />
          </div>
          <Card id="traits" style={{ marginTop: '20px' }}>
            <Traits instance={traitsInstance} values={component} onChange={setComponent} />
          </Card>
        </>
      )}
      <FooterToolbar>
        <Button
          type="primary"
          onClick={async () => {
            const result = await instance.validates();
            if (result.errors.length > 0) {
              message.error('validates err');
              return;
            }
            const app: Partial<
              Omit<ApplicationModel, 'components'> & {
                components: Partial<
                  Omit<ComponentModel, 'traits'> & { traits: Partial<ComponentTraitModel>[] }
                >[];
              }
            > = component!.application!;

            app.components = app.components?.map((com) => {
              let c = com;
              if (c.name === name) {
                c = instance.getValues()!;
              }
              delete c.application;
              if (c.traits?.length === 0) {
                c.traits = undefined;
              } else {
                c.traits?.forEach((trait) => {
                  const t = trait;
                  delete t.component;
                });
              }

              return c;
            });
            console.info(app);
            console.info(JSON.stringify(app));
            patchApplication({ namespace, name: appName }, app);
          }}
        >
          Save
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};
