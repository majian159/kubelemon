import { Button, Empty, message, Popconfirm, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';

import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { FooterToolbar } from '@ant-design/pro-layout';

import ComponentEditDrawer from './ComponentEditDrawer';

import type { ProCardProps } from '@ant-design/pro-card';
import type { ComponentModel } from '../../types';

const ApplicationForm: React.FC<{
  onSave?: () => Promise<boolean | null>;
  onSuccess?: () => void;
}> = ({ onSave, onSuccess }) => {
  const { app, update, clear, save } = useModel('appEdit');

  const [newComponentName, setNewComponentName] = useState<string>();
  useEffect(() => {
    const defaultName = 'component';
    let current = defaultName;
    for (let index = 1; index <= (app?.components.length ?? 0) + 1; index += 1) {
      const n = current;
      if (app?.components.some((c) => c.name === n)) {
        current = `${defaultName}${index}`;
      } else {
        break;
      }
    }
    setNewComponentName(current);
  }, [app]);

  const componentCardProps: ProCardProps = {
    colSpan: { xs: 24, sm: 12, md: 10, lg: 6, xxl: 4 },
    bordered: true,
    hoverable: true,
  };

  const [editComponent, setEditComponent] = useState<ComponentModel>();

  const [saving, setSaving] = useState(false);

  return (
    <>
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
      <ProCard style={{ marginTop: 8 }} gutter={[16, 16]} wrap title="Components" headerBordered>
        {(app?.components?.length ?? 0) <= 0 ? (
          <Empty description="No Components" />
        ) : (
          app?.components.map((c) => (
            <ProCard
              {...componentCardProps}
              onClick={() => setEditComponent(c)}
              style={{ maxWidth: 300 }}
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={(e) => {
                    setEditComponent(c);
                    e.stopPropagation();
                  }}
                />,
                <CopyOutlined
                  key="copy"
                  onClick={(e) => {
                    const newComponent = { ...c, name: newComponentName };
                    update({
                      ...app!,
                      components: app.components.concat([newComponent]),
                    });
                    setEditComponent(newComponent);
                    e.stopPropagation();
                  }}
                />,
                <Popconfirm
                  title="Are you sure to delete this component?"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    update({ ...app, components: app.components.filter((i) => i.name !== c.name) });
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined key="delete" onClick={(e) => e.stopPropagation()} />
                </Popconfirm>,
              ]}
            >
              <Typography.Title
                level={5}
                ellipsis={{ tooltip: c.name }}
                onClick={(e) => e?.stopPropagation()}
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
      <ProCard title="Add components" style={{ marginTop: '20px' }} headerBordered wrap>
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
          loading={saving}
          type="primary"
          onClick={async () => {
            setSaving(true);
            try {
              if ((await onSave?.()) === false) {
                return;
              }
              await save();
              message.success('Save success!');
              onSuccess?.();
            } finally {
              setSaving(false);
            }
          }}
        >
          Save
        </Button>
      </FooterToolbar>
    </>
  );
};

export { ApplicationForm };
