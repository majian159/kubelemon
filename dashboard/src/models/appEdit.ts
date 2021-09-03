import { useState } from 'react';

import { convertApplication } from '@/pages/application/types';
import { getApplication, patchApplication } from '@/services/kubelemon/applications';

import type {
  ApplicationModel, ComponentModel, ComponentTraitModel
} from '@/pages/application/types';

export default () => {
  const [app, setApp] = useState<ApplicationModel & { namespace: string }>();

  return {
    app,
    load: async (params: { namespace: string; name: string }) => {
      const { namespace, name } = params;

      if (app?.namespace === namespace && app?.name === name) {
        return app;
      }

      const value = convertApplication(await getApplication(params));
      setApp({ ...value, namespace });
      return value;
    },
    update: (value: ApplicationModel & { namespace: string }) => {
      setApp(value);
    },
    clear: () => {
      setApp(undefined);
    },
    save: async () => {
      if (app == null) {
        return null;
      }

      const local: Partial<
        Omit<ApplicationModel, 'components'> & {
          components: Partial<
            Omit<ComponentModel, 'traits'> & { traits: Partial<ComponentTraitModel>[] }
          >[];
        }
      > = { ...app };

      local.components = local.components?.map((com) => {
        const c = { ...com };

        delete c.application;

        if (c.traits?.length === 0) {
          c.traits = undefined;
        } else {
          c.traits = c.traits?.map(trait => {
            const t = { ...trait };
            delete t.component;
            return t;
          });
        }
        return c;
      });

      return await patchApplication({ namespace: app!.namespace, name: app!.name! }, local);
    }
  };
};
