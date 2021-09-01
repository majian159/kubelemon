import { Col, Row } from 'antd';
import React from 'react';

import ProbeComponent from './Probe';

const HealthCheck: React.FC = () => {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col lg={24} xl={12}>
          <ProbeComponent type="readinessProbe" />
        </Col>
        <Col lg={24} xl={12}>
          <ProbeComponent type="livenessProbe" />
        </Col>
      </Row>
    </>
  );
};

export default HealthCheck;
