import { Form } from 'antd';
import { useEffect } from 'react';

import { fillInstanceFromAntd } from '@/components/FormPart';
import { ProFormPort } from '@/components/ProFormFields';
import { ProFormGroup, ProFormList, ProFormText } from '@ant-design/pro-form';

import type { ComponentTraitModel } from '../../../../types';
import type { FormInstance } from 'antd';
import type { FormPartProps } from '@/components/FormPart';

type HttpItem = { path?: string; port?: number };

const HttpList: React.FC<{ trait: ComponentTraitModel; form: FormInstance }> = ({
  trait,
  form,
}) => {
  return (
    <ProFormList
      name="httpItems"
      creatorButtonProps={{
        creatorButtonText: 'Add Rule',
      }}
      creatorRecord={() => {
        const http = (form.getFieldValue('httpItems') as []) ?? [];
        const port = http.length === 0 ? (trait.component.properties as any).port : null;
        return { path: '/', port };
      }}
      actionRender={(_, __, doms) => {
        const http = (form.getFieldValue('httpItems') as []) ?? [];
        return http?.length > 1 ? doms : [doms[0]];
      }}
    >
      <ProFormGroup>
        <ProFormText
          name="path"
          label="Path"
          placeholder="Please path"
          required
          rules={[{ required: true }]}
          validateFirst={true}
        />
        <ProFormPort name="port" label="Port" validateFirst={true} width="xs" />
      </ProFormGroup>
    </ProFormList>
  );
};

function convertFormValues(properties?: Record<string, any>) {
  const { domain, http } = properties ?? { domain: '', http: {} };
  const httpItems: HttpItem[] = Object.keys(http).map((k) => {
    return { path: k, port: http[k] };
  });
  if (httpItems.length <= 0) {
    httpItems.push({ path: undefined, port: undefined });
  }
  return { domain, http, httpItems };
}

function convertValues(values: { domain: string; httpItems: HttpItem[] }) {
  const { domain, httpItems: items } = values;
  const http = {};
  items.forEach((item) => {
    http[item.path!] = item.port;
  });
  return { domain, http };
}

export const Ingress: React.FC<FormPartProps<ComponentTraitModel>> = (props) => {
  const { instance, values, onChange } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (instance == null || values == null) {
      return;
    }
    fillInstanceFromAntd(instance, form, {
      normalize: (v) => convertFormValues(v?.properties),
      transform: (v) => ({ ...values, properties: { ...values.properties, ...convertValues(v) } }),
    });
  }, [instance, form, values]);
  if (values == null) {
    return null;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={convertFormValues(values.properties)}
      onValuesChange={(_, vs) => {
        onChange?.({
          ...values,
          properties: { ...values.properties, ...convertValues(vs) },
        });
      }}
    >
      <ProFormText
        name={'domain'}
        label="Domain"
        required
        rules={[{ required: true }]}
        width="md"
      />
      <HttpList trait={values} form={form} />
    </Form>
  );
};
