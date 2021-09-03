import { Ingress } from './';

import type { FormPartProps } from '@/components/FormPart';
import type { ComponentTraitModel } from '@/pages/application/types';
import Editor from './Editor';

const Trait: React.FC<FormPartProps<ComponentTraitModel>> = (props) => {
  const { values } = props;

  if (values == null) {
    return null;
  }
  switch (values.type) {
    case 'ingress':
      return <Ingress {...props} />;
    default:
      return <Editor {...props} />;
  }
};

export default Trait;
