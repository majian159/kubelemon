import { ProFormText } from '@ant-design/pro-form';

const CpuComponent: React.FC<{
  value?: string;
  setValue: (value: string) => void;
}> = ({ value, setValue }) => {
  return (
    <ProFormText
      label="CPU"
      fieldProps={{
        value,
        onChange: (e) => setValue(e.target.value),
      }}
    />
  );
};
export default CpuComponent;
