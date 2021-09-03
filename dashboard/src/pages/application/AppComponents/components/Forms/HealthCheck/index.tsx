import { Col, Row } from 'antd';
import React, { useEffect } from 'react';

import { aggreValidators, useFormPart } from '@/components/FormPart';

import { LivenessProbeForm, ReadinessProbeForm } from './ProbeForm';

import type { LivenessProbe, ReadinessProbe } from '@/pages/application/types';

import type { FormPartProps } from '@/components/FormPart';

type HealthCheckValue = {
  readinessProbe?: ReadinessProbe;
  livenessProbe?: LivenessProbe;
};
const HealthCheck: React.FC<FormPartProps<HealthCheckValue>> = (props) => {
  const { instance, onChange, values } = props;
  const { readinessProbe, livenessProbe } = values ?? {};

  const [readinessProbeInstance] = useFormPart<ReadinessProbe>();
  const [livenessProbeInstance] = useFormPart<LivenessProbe>();

  useEffect(() => {
    if (instance == null) {
      return;
    }
    instance.getValues = () => {
      const readinessProbeValue = readinessProbeInstance.getValues();
      const livenessProbeValue = livenessProbeInstance.getValues();
      return {
        readinessProbe: readinessProbeValue,
        livenessProbe: livenessProbeValue,
      };
    };
    instance.setValues = (value) => {
      readinessProbeInstance.setValues(value?.readinessProbe);
      livenessProbeInstance.setValues(value?.livenessProbe);
    };
    instance.validates = aggreValidators([readinessProbeInstance, livenessProbeInstance]);
  }, [instance, readinessProbeInstance, livenessProbeInstance]);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col lg={24} xl={12}>
          <ReadinessProbeForm
            values={readinessProbe}
            instance={readinessProbeInstance}
            onChange={(v) => onChange?.({ ...values, readinessProbe: v })}
          />
        </Col>
        <Col lg={24} xl={12}>
          <LivenessProbeForm
            values={livenessProbe}
            instance={livenessProbeInstance}
            onChange={(v) => onChange?.({ ...values, livenessProbe: v })}
          />
        </Col>
      </Row>
    </>
  );
};

export default HealthCheck;
