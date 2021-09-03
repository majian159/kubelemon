import { Tooltip } from 'antd';
import { useState } from 'react';

import { WarningTwoTone } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';

import type { FieldError, FormPartInstance } from '@/components/FormPart';

const FormPart: React.FC<{
  instance?: FormPartInstance<any>;
  title: string;
  defaultCollapsed?: boolean;
}> = ({ instance, title, defaultCollapsed, children }) => {
  const [errors, setErrors] = useState<FieldError[]>();
  return (
    <ProCard
      title={title}
      style={{ marginTop: '20px' }}
      headStyle={{ userSelect: 'none' }}
      bordered
      headerBordered
      collapsible
      defaultCollapsed={defaultCollapsed}
      extra={
        (errors?.length ?? 0) > 0 ? (
          <Tooltip
            color="red"
            title={errors?.map((err) => {
              const name = err.name.join('.');
              return (
                <div key={name}>
                  {name}
                  <ol>
                    {err.errors?.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ol>
                </div>
              );
            })}
          >
            <WarningTwoTone twoToneColor="#f5222d" style={{ fontSize: '1rem' }} />
          </Tooltip>
        ) : null
      }
      onCollapse={async () => {
        const result = await instance?.validates();
        setErrors(result?.errors);
      }}
    >
      {children}
    </ProCard>
  );
};

export default FormPart;
