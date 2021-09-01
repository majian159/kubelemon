import { ProFormTextArea } from '@ant-design/pro-form';

const ContainerImagePullSecrets: React.FC<{
  value?: string[];
  setValue: (value: string[]) => void;
}> = ({ value, setValue }) => {
  return (
    <ProFormTextArea
      label="ImagePullSecrets"
      extra="If you need more than one, please separate with ','"
    />
  );
};

export default ContainerImagePullSecrets;
