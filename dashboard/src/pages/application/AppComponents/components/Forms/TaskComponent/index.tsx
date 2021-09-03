import { ProFormNumber } from '@/components/ProFormFields';
import { ProFormGroup, ProFormRadio } from '@ant-design/pro-form';

export default () => {
  return (
    <ProFormGroup>
      <ProFormNumber name="count" label="Parallel Count" min={1} />
      <ProFormRadio.Group
        name="restart"
        label="Restart Policy"
        initialValue="Never"
        options={[
          { label: 'Never', value: 'Never' },
          { label: 'OnFailure', value: 'OnFailure' },
        ]}
      ></ProFormRadio.Group>
    </ProFormGroup>
  );
};
