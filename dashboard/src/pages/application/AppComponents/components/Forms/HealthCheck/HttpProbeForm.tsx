import { ProFormPort } from '@/components/ProFormFields';
import { ProFormGroup, ProFormText } from '@ant-design/pro-form';

export default () => {
  return (
    <>
      <ProFormGroup>
        <ProFormPort name={['httpGet', 'port']} label="Port" />
        <ProFormText
          name={['httpGet', 'path']}
          label="Path"
          required
          rules={[{ required: true }]}
        />
      </ProFormGroup>
    </>
  );
};
