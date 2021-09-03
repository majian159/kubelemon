import { Table } from 'antd';

import type { ComponentModel } from '../../types';

export default ({ components }: { components: ComponentModel[] }) => {
  return (
    <Table
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Type', dataIndex: 'type' },
        { title: 'Image', dataIndex: ['properties', 'image'] },
      ]}
      rowKey="name"
      dataSource={components}
      pagination={{ hideOnSinglePage: true }}
    />
  );
};
