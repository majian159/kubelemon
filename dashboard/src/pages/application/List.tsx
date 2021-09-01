import { Card, message, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';
import { FormattedMessage } from 'umi';

import { deleteApplication, listApplications } from '@/services/kubelemon/applications';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

import Component from './components/Component';
import ComponentList from './components/ComponentList';
import { convertApplications } from './types';

import type { ApplicationModel } from './types';
import type { ActionType } from '@ant-design/pro-table';

const Table: React.FC = () => {
  const namespace = 'default';
  const actionRef = useRef<ActionType>();
  const [application, setApplication] = useState<ApplicationModel | null>();

  return (
    <>
      <ProTable<ApplicationModel>
        headerTitle={<FormattedMessage id="menu.application.list" defaultMessage="Applications" />}
        actionRef={actionRef}
        rowSelection={{ alwaysShowAlert: true }}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
          return selectedRowKeys?.length === 0 ? null : (
            <Space size={16} style={{ marginRight: '100px' }}>
              <a onClick={onCleanSelected}>Deselect</a>
              <Popconfirm
                title="Are you sure to delete selected applications?"
                onConfirm={() => {
                  const tasks = selectedRowKeys.map((name) =>
                    deleteApplication({ namespace, name: name as string }),
                  );
                  tasks.forEach(async (t) => await t);
                  actionRef.current?.reload();
                  message.success('Delete success!');
                }}
              >
                <a>Delete</a>
              </Popconfirm>
            </Space>
          );
        }}
        columns={[
          { title: 'Name', dataIndex: 'name', sorter: true },
          { title: 'Description', dataIndex: 'description', search: false },
          {
            title: 'Created',
            dataIndex: 'creationTime',
            search: false,
            sorter: true,
          },
          {
            title: 'Option',
            key: 'option',
            width: 180,
            valueType: 'option',
            render: (_, record) => [
              <a key="edit" onClick={() => {}}>
                Edit
              </a>,
              <Popconfirm
                key="delete"
                title="Are you sure to delete this application?"
                onConfirm={async () => {
                  await deleteApplication({ namespace, name: record.name as string });
                  actionRef.current?.reload();
                  message.success('Delete success!');
                }}
              >
                <a>Delete</a>
              </Popconfirm>,
            ],
          },
        ]}
        options={{ search: true }}
        search={false}
        request={async (params, sorter) => {
          const resp = await listApplications({
            namespace,
            offset: ((params.current ?? 1) - 1) * (params.pageSize ?? 0),
            limit: params.pageSize,
            keywords: params.keyword,
            sortBy: Object.entries(sorter).map((item) => {
              return `${item[0]}|${item[1]}`;
            }),
          });
          setApplication(convertApplications(resp.items ?? [])[0]);
          return {
            data: convertApplications(resp.items ?? []),
            total: resp.total,
            success: true,
          };
        }}
        rowKey="name"
        cardBordered
        onLoad={() => {
          if (actionRef.current?.clearSelected) {
            actionRef.current.clearSelected();
          }
        }}
        expandedRowRender={({ components }) => <ComponentList components={components ?? []} />}
      />
      <Card title="Component">
        {application == null ? null : <Component component={application?.components[0]} />}
      </Card>
    </>
  );
};

const ApplicationList: React.FC = () => {
  return (
    <PageContainer>
      <Table />
    </PageContainer>
  );
};

export default ApplicationList;
