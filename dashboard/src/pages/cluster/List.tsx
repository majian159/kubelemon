import { message, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';
import { FormattedMessage } from 'umi';

import {
    deleteCluster, listClusters, patchCluster, postCluster, putClusterConfig
} from '@/services/kubelemon/clusters';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

import ClusterForm from './components/ClusterForm';

import type { ActionType } from '@ant-design/pro-table';

const Table: React.FC = () => {
  const [editCluster, setEditCluster] = useState<API.Cluster | null>(null);
  const namespace = 'default';
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<API.Cluster>
      headerTitle={<FormattedMessage id="menu.cluster.list" defaultMessage="Clusters" />}
      actionRef={actionRef}
      rowSelection={{ alwaysShowAlert: true }}
      toolBarRender={() => [
        <ClusterForm
          cluster={editCluster}
          setCluster={setEditCluster}
          onFinish={async ({ current, config, isCreate }) => {
            let task: Promise<any>;

            if (isCreate) {
              await postCluster({ namespace }, current);
              task = putClusterConfig({ namespace, name: current.name ?? '' }, { config });
            } else {
              const patchTask = patchCluster(
                { namespace, name: current.name ?? '' },
                {
                  description: current.description,
                },
              );
              const putConfigTask = putClusterConfig(
                { namespace, name: current.name ?? '' },
                { config },
              );
              task = Promise.all([patchTask, putConfigTask]);
            }

            await task;
            message.success(`${isCreate ? 'Create' : 'Edit'} cluster ${current.name} success!`);
            actionRef.current?.reload();
            return true;
          }}
        />,
      ]}
      tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
        return selectedRowKeys?.length === 0 ? null : (
          <Space size={16} style={{ marginRight: '100px' }}>
            <a onClick={onCleanSelected}>Deselect</a>
            <Popconfirm
              title="Are you sure to delete selected clusters?"
              onConfirm={() => {
                const tasks = selectedRowKeys.map((cluster) =>
                  deleteCluster({ namespace, name: cluster as string }),
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
            <a key="edit" onClick={() => setEditCluster(record)}>
              Edit
            </a>,
            <Popconfirm
              key="delete"
              title="Are you sure to delete this cluster?"
              onConfirm={async () => {
                await deleteCluster({ namespace, name: record.name as string });
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
        const resp = await listClusters({
          namespace,
          offset: ((params.current ?? 1) - 1) * (params.pageSize ?? 0),
          limit: params.pageSize,
          keywords: params.keyword,
          sortBy: Object.entries(sorter).map((item) => {
            return `${item[0]}|${item[1]}`;
          }),
        });
        return {
          data: resp.items,
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
    />
  );
};

const Cluster: React.FC = () => {
  return (
    <PageContainer>
      <Table />
    </PageContainer>
  );
};

export default Cluster;
