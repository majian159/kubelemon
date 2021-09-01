import { ProFormText } from '@ant-design/pro-form';

export type ProFormNumberProps = typeof ProFormText.defaultProps & {
  min?: number;
  max?: number;
};

const ProFormNumber: React.FC<ProFormNumberProps> = ({
  name,
  label,
  required,
  fieldProps,
  min,
  max,
}) => {
  return (
    <ProFormText
      name={name}
      label={label}
      required={required}
      fieldProps={fieldProps}
      rules={[
        { required },
        {
          type: 'number',
          min,
          max,
          transform: Number,
        },
      ]}
      normalize={(v: any) => {
        if (v === '') {
          return '';
        }
        const n = Number(v);
        if (Number.isNaN(n)) {
          return v;
        }
        return n;
      }}
    />
  );
};
export default ProFormNumber;
