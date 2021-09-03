import { Ingress } from './';

import type { FormPartProps } from '@/components/FormPart';
import type { ComponentTraitModel } from '@/pages/application/types';

const Trait: React.FC<FormPartProps<ComponentTraitModel>> = (props) => {
  const { values } = props;

  if (values == null) {
    return null;
  }
  switch (values.type) {
    case 'ingress':
      return <Ingress {...props} />;
    default:
      throw new Error('not support');
  }
};

export default Trait;
