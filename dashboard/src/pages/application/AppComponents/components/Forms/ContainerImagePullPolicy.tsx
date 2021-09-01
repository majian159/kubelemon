import { ProFormRadio } from '@ant-design/pro-form';

const ContainerImagePullPolicy: React.FC = () => {
  return (
    <ProFormRadio.Group
      name="imagePullPolicy"
      label="ImagePullPolicy"
      options={[
        {
          label: 'IfNotPresent',
          value: 'IfNotPresent',
        },
        {
          label: 'Always',
          value: 'Always',
        },
        {
          label: 'Never',
          value: 'Never',
        },
      ]}
    />
  );
};

export default ContainerImagePullPolicy;
