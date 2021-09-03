import { Button, Dropdown, Menu, message, Tabs } from 'antd';
import { useEffect, useState } from 'react';

import { aggreValidators, createFormPart } from '@/components/FormPart';
import { ApiOutlined, PlusOutlined } from '@ant-design/icons';

import { Ingress } from './Ingress';
import Trait from './Trait';

import type { FormPartInstance, FormPartProps } from '@/components/FormPart';
import type { ComponentModel, ComponentTraitModel } from '@/pages/application/types';

function mergeTraits(component: ComponentModel, traits: ComponentTraitModel[]): ComponentModel {
  return { ...component, traits: [...traits] };
}

const Traits: React.FC<FormPartProps<ComponentModel>> = (props) => {
  const { instance, values, onChange } = props;

  const [instances, setInstances] = useState<Record<string, FormPartInstance<ComponentTraitModel>>>(
    {},
  );
  const [traits, setTraits] = useState(values?.traits ?? []);

  useEffect(() => {
    if (instance == null || values == null) {
      return;
    }

    instance.getValues = () => {
      return mergeTraits(
        values,
        Object.values(instances)
          .map((i) => i.getValues())
          .filter((v) => v != null)
          .map((v) => v!),
      );
    };
    instance.setValues = (vs) => {
      vs?.traits.forEach((t) => {
        instances[t.type!].setValues(t);
      });
    };
    instance.validates = aggreValidators(Object.values(instances));
  }, [instance, instances, values]);

  const [activeKey, setActiveKey] = useState<string>();

  const removeTrait = (type: string) => {
    delete instances[type];
    setInstances({ ...instances });
    const newTraits = traits.filter((t) => t.type !== type);
    setTraits(newTraits);
    onChange?.({ ...values!, traits: newTraits });
    setActiveKey(undefined);
  };

  const addTrait = (type: string, properties?: Record<string, any>) => {
    setActiveKey(type);
    if (traits.some((t) => t.type === type)) {
      message.error(`A rait of type '${type}' already exists!`);
      return;
    }
    const newTraits = [...traits, { component: values!, type, properties }];
    setTraits(newTraits);
    onChange?.({ ...values!, traits: newTraits });
  };

  const traitDefs = [
    {
      type: 'ingress',
      title: 'Ingress',
      properties: {
        domain: 'domain',
        http: { '/': 80 },
      },
    },
    { type: 'scaler', title: 'Scaler', properties: { replicas: 1 } },
    { type: 'resource', title: 'Resource', properties: { cpu: 1, memory: '2048Mi' } },
    { type: 'expose', title: 'Expose', properties: { port: [80, 8080], type: 'ClusterIP' } },
    { type: 'labels', title: 'Labels', properties: { release: 'stable' } },
    { type: 'annotations', title: 'Annotations', properties: { description: 'web application' } },
    { type: 'configmap', title: 'ConfigMap', properties: { key: 'value' } },
    {
      type: 'hostalias',
      title: 'HostAlias',
      properties: { hostAliases: { ip: '127.0.0.1', hostnames: ['localhost', 'local'] } },
    },
    {
      type: 'service-binding',
      title: 'ServiceBinding',
      properties: {
        envMappings: [
          {
            secret: 'db-conn-example',
            key: 'password',
          },
        ],
      },
    },
    {
      type: 'sidecar',
      title: 'Sidecar',
      properties: {
        name: '',
        cmd: [],
        image: '',
        volumes: [{ name: '', path: '' }],
      },
    },
    {
      type: 'volumes',
      title: 'Volumes',
      properties: {
        volumes: [{ name: '', type: 'pvc' }],
      },
    },
    { type: 'cpuscaler', title: 'CpuScaler', properties: { min: 1, max: 10, cpuUtil: 50 } },
    {
      type: 'lifecycle',
      title: 'Lifecycle',
      properties: {
        postStart: { httpGet: {} },
        preStop: { exec: {} },
      },
    },
    {
      type: 'rollout',
      title: 'Rollout',
      properties: {
        targetRevision: '',
        rolloutBatches: [{ replicas: 1 }],
        targetSize: 3,
        batchPartition: 1,
      },
    },
    {
      type: 'other',
      title: 'Other',
      properties: {
        key: 'value',
      },
    },
  ];

  const menu = (
    <Menu
      onClick={({ key }) => {
        addTrait(key, traitDefs.find((td) => td.type === key)?.properties);
      }}
    >
      {traitDefs.map((td) => {
        return (
          <Menu.Item
            key={td.type}
            icon={<ApiOutlined />}
            disabled={traits.some((t) => t.type === td.type)}
          >
            {td.title}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <>
      <Tabs
        tabBarExtraContent={
          <Dropdown overlay={menu}>
            <Button icon={<PlusOutlined />} type="primary" style={{ marginRight: '10px' }}>
              Add Traits
            </Button>
          </Dropdown>
        }
        tabPosition="left"
        type="editable-card"
        hideAdd
        activeKey={activeKey}
        onTabClick={setActiveKey}
        onEdit={(key, action) => {
          switch (action) {
            case 'remove': {
              removeTrait(key as string);
              break;
            }
            default:
              break;
          }
        }}
      >
        {[
          traits.map((trait) => {
            const inst = createFormPart<ComponentTraitModel>();
            instances[trait.type!] = inst;
            return (
              <Tabs.TabPane
                tab={traitDefs.find((td) => td.type === trait.type)?.title}
                key={trait.type}
                closable={true}
              >
                <Trait instance={inst} values={trait} />
              </Tabs.TabPane>
            );
          }),
        ]}
      </Tabs>
    </>
  );
};

export { Trait, Ingress };
export default Traits;
