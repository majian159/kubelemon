import { ProFormText } from '@ant-design/pro-form';

const MemoryComponent: React.FC<{
  value?: string;
  setValue: (value: string) => void;
}> = ({ value, setValue }) => {
  return (
    <ProFormText
      label="Memory"
      fieldProps={{
        value,
        onChange: (e) => setValue(e.target.value),
      }}
    />
  );
};
export default MemoryComponent;
