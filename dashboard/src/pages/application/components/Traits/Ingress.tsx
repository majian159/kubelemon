import { Card } from 'antd';

import ProForm, {
    ProFormDigit, ProFormGroup, ProFormList, ProFormSelect, ProFormText
} from '@ant-design/pro-form';

import type { TraitProps } from './types';

type HttpItem = { path: string; port: number };

const HttpList: React.FC<any> = () => {
  return (
    <ProFormList
      name="http"
      creatorButtonProps={{
        creatorButtonText: 'Add',
      }}
      creatorRecord={{}}
    >
      <ProFormGroup>
        <ProFormText
          name="path"
          label="Path"
          placeholder="Please path"
          required
          rules={[{ required: true }]}
        />
        <ProFormDigit
          name="port"
          label="Port"
          min={1}
          max={65535}
          fieldProps={{ precision: 0 }}
          placeholder="Please port"
          required
          /* rules={[{ required: true }]} */
          rules={[
            { required: true },
            ({ getFieldsValue }) => ({
              async validator(_, value) {
                const items = getFieldsValue().http as HttpItem[];
                if (items.filter((i) => i.port === value).length > 1) {
                  throw new Error('Duplicate port number!');
                }
              },
            }),
          ]}
        />
      </ProFormGroup>
    </ProFormList>
  );
};

const Ingress: React.FC<{
  rule: {
    domain: string;
    http: HttpItem[];
  };
}> = ({ rule }) => {
  return (
    <ProForm
      initialValues={rule}
      onFinish={async (values) => {
        console.info(values);
        return false;
      }}
    >
      <ProFormText name="domain" label="Domain" />
      <HttpList />
    </ProForm>
  );
};

export default ({ trait }: TraitProps) => {
  console.info(trait.component);
  const properties = trait.properties!;
  const { domain, http } = properties;
  const httpItems = Object.keys(http).map((k) => {
    return { path: k, port: http[k] };
  });
  return <Ingress rule={{ domain, http: httpItems }} />;
};
