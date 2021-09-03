import { Table } from 'antd';
import { Link } from 'umi';

import type { ComponentModel } from '../../types';

export default ({ components }: { components: ComponentModel[] }) => {
  return (
    <Table
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Type', dataIndex: 'type' },
        { title: 'Image', dataIndex: ['properties', 'image'] },
        {
          title: 'Option',
          key: 'option',
          width: 180,
          render: (_, record) => [
            <Link to={`./applications/${record.application.name}/components/${record.name!}`}>
              Edit
            </Link>,
          ],
        },
      ]}
      rowKey="name"
      dataSource={components}
      pagination={{ hideOnSinglePage: true }}
    />
  );
};
