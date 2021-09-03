import { Card, Statistic } from 'antd';
import { useEffect } from 'react';

import { aggreValidators, useFormPart } from '@/components/FormPart';
import ProCard from '@ant-design/pro-card';

import { ComponentForm } from './Forms';
import Traits from './Forms/Traits';

import type { FormPartProps } from '@/components/FormPart';
import type { ComponentModel } from '@/pages/application/types';

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

const ComponentEdit: React.FC<FormPartProps<ComponentModel>> = (props) => {
  const { instance, onChange, values: component } = props;

  const [componentFormPartInstance] = useFormPart<ComponentModel>();
  const [traitsInstance] = useFormPart<ComponentModel>();

  useEffect(() => {
    if (instance == null) {
      return;
    }
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
    <>
      <Summary component={component!} />
      <div id="component" style={{ marginTop: '20px' }}>
        <ComponentForm values={component} instance={componentFormPartInstance} />
      </div>
      <Card id="traits" style={{ marginTop: '20px' }}>
        <Traits instance={traitsInstance} values={component} onChange={onChange} />
      </Card>
    </>
  );
};

export default ComponentEdit;
