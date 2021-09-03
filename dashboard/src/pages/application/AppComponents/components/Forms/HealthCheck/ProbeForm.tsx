import { Form } from 'antd';
import React, { useEffect, useState } from 'react';

import { fillInstanceFromAntd } from '@/components/FormPart';
import { ProFormNumber } from '@/components/ProFormFields';
import ProCard from '@ant-design/pro-card';
import { ProFormRadio } from '@ant-design/pro-form';

import ExecProbeForm from './ExecProbeForm';
import HttpProbeForm from './HttpProbeForm';
import TcpProbeForm from './TcpProbeForm';

import type { LivenessProbe, ReadinessProbe } from '@/pages/application/types';
import type { FormPartProps } from '@/components/FormPart';

const colSpan = { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

function getItems(isReadiness: boolean, mode: string) {
  let items: React.ReactNode[] = [
    <ProCard key="1" colSpan={colSpan} bordered>
      <ProFormNumber
        name="initialDelaySeconds"
        label="Start Checking After"
        fieldProps={{ addonAfter: 'seconds' }}
        required
        min={0}
      />
    </ProCard>,
    <ProCard key="2" colSpan={colSpan} bordered>
      <ProFormNumber
        name="periodSeconds"
        label="Check Interval"
        fieldProps={{ addonAfter: 'seconds' }}
        required
        min={1}
      />
    </ProCard>,
    <ProCard key="3" colSpan={colSpan} bordered>
      <ProFormNumber
        name="timeoutSeconds"
        label="Check Timeout"
        fieldProps={{ addonAfter: 'seconds' }}
        required
        min={1}
      />
    </ProCard>,
    isReadiness ? (
      <ProCard key="4" colSpan={colSpan} bordered>
        <ProFormNumber
          name="successThreshold"
          label="Healthy After"
          fieldProps={{ addonAfter: 'successes' }}
          required
          min={1}
        />
      </ProCard>
    ) : null,
    <ProCard key="5" colSpan={colSpan} bordered>
      <ProFormNumber
        name="failureThreshold"
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
      modeComponent = <HttpProbeForm />;
      break;
    case 'tcpSocket':
      modeComponent = <TcpProbeForm />;
      break;
    case 'exec':
      modeComponent = <ExecProbeForm />;
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
  return items;
}

type ProbeMode = 'httpGet' | 'tcpSocket' | 'exec' | 'none';
function getMode(probe?: ReadinessProbe | LivenessProbe): ProbeMode {
  if (probe?.httpGet != null) {
    return 'httpGet';
  }
  if (probe?.tcpSocket != null) {
    return 'tcpSocket';
  }
  if (probe?.exec != null) {
    return 'exec';
  }
  return 'none';
}

const ProbeForm: React.FC<
  FormPartProps<ReadinessProbe | LivenessProbe> & {
    type: 'readinessProbe' | 'livenessProbe';
  }
> = (props) => {
  const { values, type, instance, onChange } = props;
  const [mode, setMode] = useState<ProbeMode>(() => getMode(values));
  const [form] = Form.useForm();

  useEffect(() => {
    if (instance == null) {
      return;
    }
    const specNames = ['httpGet', 'tcpSocket', 'exec'];
    fillInstanceFromAntd(instance, form, {
      normalize: (v?: ReadinessProbe | LivenessProbe) => () => {
        if (mode === 'none' || v == null) {
          return undefined;
        }
        const value: ReadinessProbe | LivenessProbe = v;
        specNames.forEach((name) => {
          if (name === mode) {
            return;
          }
          delete value[name];
        });
        return value;
      },
      transform: (v) => {
        setMode(getMode(v));
        if (v != null && Object.keys(v).some((k) => specNames.includes(k))) {
          return v;
        }
        return undefined;
      },
    });
  }, [mode, form, instance]);

  const isReadiness = type === 'readinessProbe';

  const items = getItems(isReadiness, mode);

  const initialValues: ReadinessProbe = {
    ...{
      failureThreshold: 1,
      initialDelaySeconds: 5,
      periodSeconds: 15,
      successThreshold: 1,
      timeoutSeconds: 5,
    },
    ...values,
  };

  return (
    <>
      <Form
        form={form}
        initialValues={initialValues}
        onValuesChange={(_, vs) => {
          onChange?.(vs);
        }}
      >
        <ProCard
          wrap
          gutter={[16, 16]}
          title={isReadiness ? 'Readiness Check' : 'Liveness Check'}
          headerBordered
        >
          <ProCard>
            <ProFormRadio.Group
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
              fieldProps={{
                value: mode,
                onChange: (e) => {
                  setMode(e.target.value);
                },
              }}
            />
          </ProCard>
          {items}
        </ProCard>
      </Form>
    </>
  );
};

const ReadinessProbeForm: React.FC<FormPartProps<ReadinessProbe>> = (props) => {
  return (
    <ProbeForm
      type="readinessProbe"
      values={props.values}
      instance={props.instance as any}
      onChange={props.onChange as any}
    />
  );
};
const LivenessProbeForm: React.FC<FormPartProps<LivenessProbe>> = (props) => {
  return (
    <ProbeForm type="livenessProbe" instance={props.instance as any} onChange={props.onChange} />
  );
};

export { ReadinessProbeForm, LivenessProbeForm };
