import { useCallback, useState } from 'react';

import { convertApplication } from '@/pages/application/types';
import {
  getApplication,
  patchApplication,
  postApplication,
} from '@/services/kubelemon/applications';

import type {
  ApplicationModel,
  ComponentModel,
  ComponentTraitModel,
} from '@/pages/application/types';

function reverseApplication(app: ApplicationModel): API.Application {
  const local: Partial<
    Omit<ApplicationModel, 'components'> & {
      components: Partial<
        Omit<ComponentModel, 'traits'> & { traits: Partial<ComponentTraitModel>[] }
      >[];
    } & Pick<ApplicationModelType, 'isCreate' | 'namespace'>
  > = { ...app };

  delete local.namespace;
  delete local.isCreate;

  local.components = local.components?.map((com) => {
    const c = { ...com };

    delete c.application;

    if (c.traits?.length === 0) {
      c.traits = undefined;
    } else {
      c.traits = c.traits?.map((trait) => {
        const t = { ...trait };
        delete t.component;
        return t;
      });
    }
    return c;
  });

  return local;
}

type ApplicationModelType = ApplicationModel & { namespace: string; isCreate: boolean };
export default () => {
  const [app, setApp] = useState<ApplicationModelType>();

  const load = useCallback(
    async (params: { namespace: string; name: string }) => {
      const { namespace, name } = params;

      if (app?.namespace === namespace && app?.name === name && app?.isCreate === false) {
        return app;
      }

      const value = convertApplication(await getApplication(params));
      setApp({ ...value, namespace, isCreate: false });
      return value;
    },
    [app],
  );

  const update = useCallback((value: ApplicationModelType) => {
    setApp(value);
  }, []);

  const clear = useCallback(() => setApp(undefined), []);

  const save = useCallback(async () => {
    if (app == null) {
      return null;
    }

    const localApp = reverseApplication(app);
    let result: API.Application;
    if (app.isCreate) {
      result = await postApplication({ namespace: app.namespace }, localApp);
    } else {
      result = await patchApplication({ namespace: app!.namespace, name: app!.name! }, localApp);
    }
    return result;
  }, [app]);

  return {
    app,
    load,
    update,
    clear,
    save,
  };
};
