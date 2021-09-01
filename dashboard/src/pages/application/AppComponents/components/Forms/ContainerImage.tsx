import { ProFormText } from '@ant-design/pro-form';

const ContainerImage: React.FC = () => {
  return <ProFormText name="image" label="Image" required rules={[{ required: true }]} />;
};

export default ContainerImage;
