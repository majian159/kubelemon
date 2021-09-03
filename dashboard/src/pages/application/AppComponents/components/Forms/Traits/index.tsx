import { Button, Dropdown, Menu, message, Tabs } from 'antd';
import { useEffect, useState } from 'react';

import { aggreValidators, useFormPart } from '@/components/FormPart';
import { ApiOutlined, PlusOutlined } from '@ant-design/icons';

import { Ingress } from './Ingress';
import Trait from './Trait';

import type { FormPartInstance, FormPartProps } from '@/components/FormPart';
import type { ComponentModel, ComponentTraitModel } from '@/pages/application/types';

const Content: React.FC<
  FormPartProps<ComponentTraitModel> & {
    setInstance: (i: FormPartInstance<ComponentTraitModel>) => void;
  }
> = (props) => {
  const { setInstance } = props;
  const [instance] = useFormPart<ComponentTraitModel>();
  useEffect(() => {
    setInstance(instance);
  }, [instance, setInstance]);

  return <Trait {...props} instance={instance} />;
};

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

  const removeTrait = (type: string) => {
    delete instances[type];
    setInstances({ ...instances });
    const newTraits = traits.filter((t) => t.type !== type);
    setTraits(newTraits);
    onChange?.({ ...values!, traits: newTraits });
  };
  const addTrait = (type: string) => {
    if (traits.some((t) => t.type === type)) {
      message.error(`A rait of type '${type}' already exists!`);
      return;
    }
    const newTraits = [{ component: values!, type }];
    setTraits(newTraits);
    onChange?.({ ...values!, traits: newTraits });
  };

  const menu = (
    <Menu
      onClick={({ key }) => {
        addTrait(key);
      }}
    >
      <Menu.Item
        key="ingress"
        icon={<ApiOutlined />}
        disabled={traits.some((t) => t.type === 'ingress')}
      >
        Ingress
      </Menu.Item>
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
            return (
              <Tabs.TabPane tab={trait.type} key={trait.type} closable={true}>
                <Content
                  setInstance={(i) => {
                    if (instances[trait.type!] != null) {
                      return;
                    }
                    setInstances({
                      ...instances,
                      [trait.type!]: i,
                    });
                  }}
                  values={trait}
                  onChange={(v) => {
                    onChange?.(mergeTraits(values!, [v]));
                  }}
                />
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
