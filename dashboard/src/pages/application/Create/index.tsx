import { Card, Form } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

import { ProFormGroup, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';

import { ApplicationForm } from '../components/ApplicationForm';

export default () => {
  const { app, update } = useModel('appEdit');
  useEffect(() => {
    update({ components: [], namespace: 'default', isCreate: true });
  }, [update]);

  const [form] = Form.useForm();
  return (
    <PageContainer title="Create application">
      {app == null ? null : (
        <>
          <Card>
            <Form
              form={form}
              onValuesChange={(v) => {
                update({ ...app, ...v });
              }}
              layout="vertical"
            >
              <ProFormGroup label="Application">
                <ProFormText
                  name="name"
                  label="Name"
                  required
                  rules={[{ required: true }]}
                  width="md"
                />
                <ProFormText name="description" label="Description" width="lg" />
              </ProFormGroup>
            </Form>
          </Card>
          <ApplicationForm
            onSave={async () => {
              try {
                await form.validateFields();
                return true;
              } catch (e) {
                return false;
              }
            }}
            onSuccess={() => history.push(`./${app.name}`)}
          />
        </>
      )}
    </PageContainer>
  );
};
