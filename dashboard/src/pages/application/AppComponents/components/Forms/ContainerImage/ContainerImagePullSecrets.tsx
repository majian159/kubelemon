import { ProFormTextArea } from '@ant-design/pro-form';

const ContainerImagePullSecrets: React.FC = () => {
  return (
    <ProFormTextArea
      name="imagePullSecrets"
      label="ImagePullSecrets"
      extra="If you need more than one, please newline"
      width="xl"
    />
  );
};

export default ContainerImagePullSecrets;
