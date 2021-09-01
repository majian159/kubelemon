import React, { useState } from 'react';

import ProFormNumber from '@/components/ProFormFields/ProFormNumber';
import ProCard from '@ant-design/pro-card';
import { ProFormGroup, ProFormRadio, ProFormText } from '@ant-design/pro-form';

import CmdComponent from '../Command';

import type { ProFormNumberProps } from '@/components/ProFormFields/ProFormNumber';

const ProFormPort: React.FC<ProFormNumberProps> = (props) => {
  return <ProFormNumber min={1} max={65535} {...props} />;
};

const HttpProbeComponent: React.FC<{ namePrefix: string }> = ({ namePrefix }) => {
  return (
    <>
      <ProFormGroup>
        <ProFormPort name={[namePrefix, 'httpGet', 'port']} label="Port" required />
        <ProFormText
          name={[namePrefix, 'httpGet', 'path']}
          label="Path"
          required
          rules={[{ required: true }]}
        />
      </ProFormGroup>
    </>
  );
};

const TcpProbeComponent: React.FC<{ namePrefix: string }> = ({ namePrefix }) => {
  return <ProFormPort name={[namePrefix, 'tcpSocket', 'port']} label="Port" required />;
};

const ExecProbeComponent: React.FC<{ namePrefix: string }> = ({ namePrefix }) => {
  return (
    <CmdComponent name={[namePrefix, 'exec', 'command']} required rules={[{ required: true }]} />
  );
};

const ProbeComponent: React.FC<{
  type: 'readinessProbe' | 'livenessProbe';
}> = ({ type }) => {
  const [mode, setMode] = useState<string>('none');
  const isReadiness = type === 'readinessProbe';
  const namePrefix = type;

  const colSpan = { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };
  let items: React.ReactNode[] = [
    <ProCard key="1" colSpan={colSpan} bordered>
      <ProFormNumber
        name={[namePrefix, 'initialDelaySeconds']}
        label="Start Checking After"
        fieldProps={{ addonAfter: 'seconds' }}
        required
        min={0}
      />
    </ProCard>,
    <ProCard key="2" colSpan={colSpan} bordered>
      <ProFormNumber
        name={[namePrefix, 'periodSeconds']}
        label="Check Interval"
        fieldProps={{ addonAfter: 'seconds' }}
        required
        min={1}
      />
    </ProCard>,
    <ProCard key="3" colSpan={colSpan} bordered>
      <ProFormNumber
        name={[namePrefix, 'timeoutSeconds']}
        label="Check Timeout"
        fieldProps={{ addonAfter: 'seconds' }}
        required
        min={1}
      />
    </ProCard>,
    isReadiness ? (
      <ProCard key="4" colSpan={colSpan} bordered>
        <ProFormNumber
          name={[namePrefix, 'successThreshold']}
          label="Healthy After"
          fieldProps={{ addonAfter: 'successes' }}
          required
          min={1}
        />
      </ProCard>
    ) : null,
    <ProCard key="5" colSpan={colSpan} bordered>
      <ProFormNumber
        name={[namePrefix, 'failureThreshold']}
        label="Unhealthy After"
        fieldProps={{ addonAfter: 'failures' }}
        required
        min={1}
      />
    </ProCard>,
  ];
  let modeComponent: React.ReactNode = null;
  switch (mode) {
    case 'httpGet':
      modeComponent = <HttpProbeComponent namePrefix={namePrefix} />;
      break;
    case 'tcpSocket':
      modeComponent = <TcpProbeComponent namePrefix={namePrefix} />;
      break;
    case 'exec':
      modeComponent = <ExecProbeComponent namePrefix={namePrefix} />;
      break;
    default:
      items = [];
      break;
  }
  if (modeComponent != null) {
    items = [
      <ProCard key="6" colSpan={24} bordered title={mode} headerBordered>
        {modeComponent}
      </ProCard>,
      ...items,
    ];
  }
  return (
    <>
      <ProCard
        wrap
        gutter={[16, 16]}
        title={isReadiness ? 'Readiness Check' : 'Liveness Check'}
        headerBordered
      >
        <ProCard>
          <ProFormRadio.Group
            name={[namePrefix, 'mode']}
            layout="vertical"
            options={[
              {
                label: 'HTTP request returns a successful status (2xx or 3xx)',
                value: 'httpGet',
              },
              { label: 'TCP connection opens successfully', value: 'tcpSocket' },
              { label: 'Command run inside the container exits with status 0', value: 'exec' },
              { label: 'None', value: 'none' },
            ]}
            fieldProps={{ value: mode, onChange: (e) => setMode(e.target.value) }}
          />
        </ProCard>
        {items}
      </ProCard>
    </>
  );
};

export default ProbeComponent;
