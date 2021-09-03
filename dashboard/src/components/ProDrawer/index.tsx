import { Drawer } from 'antd';

import type { ReactNode } from 'react';
import type { DrawerProps } from 'antd';

const ProDrawer: React.FC<DrawerProps & { extra?: ReactNode }> = (props) => {
  const { extra, title } = props;
  return (
    <Drawer
      {...{
        ...props,
        extra: undefined,
      }}
      title={
        extra == null ? (
          title
        ) : (
          <>
            {title}
            <div style={{ float: 'right', marginRight: '30px' }}>{extra}</div>
          </>
        )
      }
    >
      {props.children}
    </Drawer>
  );
};
export default ProDrawer;
