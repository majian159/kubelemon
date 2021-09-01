import Ingress from './Ingress';

import type { TraitProps } from './types';

const Trait: React.FC<TraitProps> = (props) => {
  switch (props.trait.type) {
    case 'ingress':
      return <Ingress {...props} />;
    default:
      throw new Error('not support');
  }
};
export default Trait;
