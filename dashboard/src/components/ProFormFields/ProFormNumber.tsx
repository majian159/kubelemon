import { ProFormText } from '@ant-design/pro-form';

export type ProFormNumberProps = typeof ProFormText.defaultProps & {
  min?: number;
  max?: number;
};

const ProFormNumber: React.FC<ProFormNumberProps> = (props) => {
  const { required, min, max } = props;
  return (
    <ProFormText
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
      {...props}
    />
  );
};

export default ProFormNumber;
