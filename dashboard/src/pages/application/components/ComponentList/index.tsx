import { Table } from 'antd';

import CmdComponent from '../../AppComponents/components/Forms/Command';
import Component from '../Component';
import TraitList from './TraitList';

import type { ComponentModel } from '../../types';
const ComponentList: React.FC<{
  components: ComponentModel[];
}> = ({ components }) => {
  return (
    <Table
      columns={[
        { title: 'Name', dataIndex: 'name' },
        { title: 'Type', dataIndex: 'type' },
        { title: 'Image', dataIndex: ['properties', 'image'] },
      ]}
      rowKey="name"
      dataSource={components}
      expandable={{ defaultExpandAllRows: true }}
      expandedRowRender={(component) => {
        return (
          <>
            <Component component={component} />
            <TraitList traits={component.traits ?? []} />
          </>
        );
      }}
      pagination={{ hideOnSinglePage: true }}
    />
  );
};

export default ComponentList;
