import { Button, Drawer, Empty, message, Popconfirm, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useModel, useParams } from 'umi';

import { useFormPart } from '@/components/FormPart';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';

import ComponentEdit from '../AppComponents/components/ComponentEdit';

import type { ValidatesResult } from '@/components/FormPart';
import type { ComponentModel } from '../types';
import type { ProCardProps } from '@ant-design/pro-card';

const ComponentEditDrawer: React.FC<{
  component?: ComponentModel;
  onSave: (c: ComponentModel) => void;
  onClose: () => void;
}> = ({ component, onSave, onClose }) => {
  const [instance] = useFormPart<ComponentModel>();
  const save = async (option?: { error: (result: ValidatesResult<any>) => any }) => {
    const result = await instance.validates();
    if (result.errors.length === 0) {
      onSave(instance.getValues()!);
      onClose();
      return;
    }
    if (option?.error == null || option.error(result) === true) {
      onClose();
    }
  };

  return (
    <Drawer
      title={`Edit ${component?.name} component`}
      visible={component !== undefined}
      onClose={() => save()}
      width="60%"
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={() =>
              save({
                error: () => message.error('Verification failed, please check!'),
              })
            }
          >
            Save
          </Button>
        </div>
      }
    >
      {component == null ? null : (
        <ComponentEdit instance={instance} values={component} onChange={() => {}} />
      )}
    </Drawer>
  );
};

export default () => {
  const { name } = useParams<{ name: string }>();
  const { app, load, update, clear, save } = useModel('appEdit');

  useEffect(() => {
    load({ namespace: 'default', name });
  }, [name, load]);

  const [newComponentName, setNewComponentName] = useState<string>();
  useEffect(() => {
    const defaultName = 'component';
    let n = defaultName;
    let i = 0;
    while (app?.components.some((c) => c.name === n)) {
      i += 1;
      n = `${defaultName}${i}`;
    }
    setNewComponentName(n);
  }, [app]);

  const componentCardProps: ProCardProps = {
    colSpan: { xs: 24, sm: 12, md: 10, lg: 6, xxl: 4 },
    bordered: true,
    hoverable: true,
  };

  const [editComponent, setEditComponent] = useState<ComponentModel>();

  return (
    <PageContainer title={name} loading={app != null ? undefined : { delay: 300 }}>
      <ComponentEditDrawer
        component={editComponent}
        onSave={(c) => {
          update({
            ...app!,
            components: app!.components.map((z) => {
              if (z.name === c.name) {
                return c;
              }
              return z;
            }),
          });
        }}
        onClose={() => setEditComponent(undefined)}
      />
      <ProCard style={{ marginTop: 8 }} gutter={[16, 16]} wrap title="Components">
        {(app?.components?.length ?? 0) <= 0 ? (
          <Empty />
        ) : (
          app?.components.map((c) => (
            <ProCard
              {...componentCardProps}
              onClick={() => setEditComponent(c)}
              style={{ maxWidth: 300 }}
              actions={[
                <EditOutlined key="edit" onClick={() => setEditComponent(c)} />,
                <CopyOutlined
                  key="copy"
                  onClick={() => {
                    update({
                      ...app!,
                      components: app.components.concat([{ ...c, name: newComponentName }]),
                    });
                  }}
                />,
                <Popconfirm
                  title="Are you sure to delete this component?"
                  onConfirm={() => {
                    update({ ...app, components: app.components.filter((i) => i.name !== c.name) });
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined key="delete" />
                </Popconfirm>,
              ]}
            >
              <Typography.Title
                level={5}
                ellipsis={{ tooltip: c.name }}
                editable={{
                  onChange: (v) => {
                    update({
                      ...app,
                      components: app!.components.map((z) => {
                        if (z.name === c.name) {
                          return { ...z, name: v };
                        }
                        return z;
                      }),
                    });
                  },
                }}
              >
                {c.name}
              </Typography.Title>
              <div>Type: {c.type}</div>
              <div>Traits: {c.traits.length}</div>
              <div>ExternalRevision: {c.externalRevision}</div>
            </ProCard>
          ))
        )}
      </ProCard>
      <ProCard title="Add components" style={{ marginTop: '20px' }} wrap>
        <ProCard
          colSpan={4}
          bordered
          hoverable
          onClick={() => {
            const newComponent: ComponentModel = {
              application: app!,
              traits: [],
              name: newComponentName,
              type: 'webservice',
              properties: {},
            };
            setEditComponent(newComponent);
            update({
              ...app!,
              components: [...app!.components, newComponent],
            });
          }}
        >
          Web Service
        </ProCard>
      </ProCard>
      <FooterToolbar>
        <Button>
          <Link to="./../applications" onClick={clear}>
            Cancel
          </Link>
        </Button>
        <Button
          type="primary"
          onClick={async () => {
            try {
              await save();
              message.success('Save success!');
            } catch (e) {
              message.error('Save fail!');
            }
          }}
        >
          Save
        </Button>
      </FooterToolbar>
    </PageContainer>
  );
};
