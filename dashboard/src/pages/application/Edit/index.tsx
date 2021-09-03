import { useEffect } from 'react';
import { useModel, useParams } from 'umi';

import { PageContainer } from '@ant-design/pro-layout';

import { ApplicationForm } from '../components/ApplicationForm';

export default () => {
  const { name } = useParams<{ name: string }>();
  const { app, load } = useModel('appEdit');

  useEffect(() => {
    load({ namespace: 'default', name });
  }, [name, load]);

  return (
    <PageContainer
      title={name}
      subTitle={app?.description}
      loading={app != null ? undefined : { delay: 300 }}
    >
      <ApplicationForm />
    </PageContainer>
  );
};
