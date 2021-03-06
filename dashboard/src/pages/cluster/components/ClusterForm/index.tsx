import { Button, Space } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import { FormattedMessage } from 'umi';

import { getClusterConfig } from '@/services/kubelemon/clusters';
import { ClusterOutlined, PlusOutlined } from '@ant-design/icons';
import { DrawerForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import type { FormInstance } from 'antd';

const FormContent: React.FC<{ isCreate: boolean }> = ({ isCreate }) => {
  return (
    <>
      <ProFormText
        name="name"
        label="Name"
        required
        readonly={!isCreate}
        rules={[{ required: true }]}
      />
      <ProFormTextArea name="description" label="Description" />
      <ProFormTextArea
        name="config"
        label="Config"
        required
        rules={[{ required: true }]}
        fieldProps={{ autoSize: { minRows: 20 } }}
      />
    </>
  );
};

const ClusterForm: React.FC<{
  cluster: API.Cluster | null;
  setCluster: (cluster: API.Cluster | null) => void;
  onFinish: (p: { current: API.Cluster; config: string; isCreate: boolean }) => Promise<boolean>;
}> = ({ cluster, setCluster, onFinish }) => {
  const isCreate = cluster?.name == null;
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    if (cluster == null) {
      return;
    }

    if (cluster.name != null) {
      getClusterConfig({ namespace: 'default', name: cluster?.name ?? '' }).then((resp) => {
        formRef.current?.setFields([
          {
            name: 'config',
            value: resp.config,
          },
        ]);
      });
    }

    formRef.current?.resetFields();
    formRef.current?.setFields(
      Object.entries(cluster).map((item) => ({ name: item[0], value: item[1] })),
    );
  }, [cluster]);

  const onCreate = useCallback(() => setCluster({}), [setCluster]);

  return (
    <DrawerForm<API.Cluster & { config: string }>
      formRef={formRef}
      title={
        <>
          <Space>
            <ClusterOutlined />
            {isCreate ? 'Create cluster' : `Edit cluster ${cluster?.name}`}
          </Space>
        </>
      }
      visible={cluster != null}
      onVisibleChange={(visible) => {
        if (!visible) {
          setCluster(null);
        }
      }}
      trigger={
        <Button type="primary" onClick={onCreate}>
          <PlusOutlined />
          Create
        </Button>
      }
      submitter={{
        searchConfig: {
          submitText: <FormattedMessage id="component.form.ok" defaultMessage="OK" />,
          resetText: <FormattedMessage id="component.form.cancel" defaultMessage="Cancel" />,
        },
      }}
      onFinish={(values) =>
        onFinish({
          current: {
            name: values.name,
            description: values.description,
          },
          config: values.config,
          isCreate,
        })
      }
    >
      <FormContent isCreate={isCreate} />
    </DrawerForm>
  );
};

export default ClusterForm;
