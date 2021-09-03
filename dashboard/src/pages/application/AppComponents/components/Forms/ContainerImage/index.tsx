import { ProFormGroup, ProFormText } from '@ant-design/pro-form';

import ContainerImagePullPolicy from './ContainerImagePullPolicy';
import ContainerImagePullSecrets from './ContainerImagePullSecrets';

const ContainerImage: React.FC = () => {
  return (
    <>
      <ProFormGroup>
        <ProFormText name="image" label="Image" required rules={[{ required: true }]} width="lg" />
        <ContainerImagePullPolicy />
      </ProFormGroup>
      <ContainerImagePullSecrets />
    </>
  );
};

export default ContainerImage;
