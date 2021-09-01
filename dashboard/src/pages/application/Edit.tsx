import { Button, Card, Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import SubMenu from 'antd/es/menu/SubMenu';
import { Content } from 'antd/lib/layout/layout';

import {
    BlockOutlined, LaptopOutlined, NotificationOutlined, UserOutlined
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';

export default () => {
  return (
    <PageContainer>
      <ProCard split="vertical">
        <ProCard title="Components" colSpan="20%">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['1']}
            style={{ height: '100%' }}
          >
            <Menu.Item icon={<BlockOutlined />} key="1">
              option1
            </Menu.Item>
            <Menu.Item icon={<BlockOutlined />} key="2">
              option2
            </Menu.Item>
            <Menu.Item icon={<BlockOutlined />} key="3">
              option3
            </Menu.Item>
          </Menu>
        </ProCard>
        <ProCard title="左右分栏子卡片带标题" headerBordered>
          <div style={{ height: 360 }}>右侧内容</div>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
