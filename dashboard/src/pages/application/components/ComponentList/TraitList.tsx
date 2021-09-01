import { Card } from 'antd';

import Trait from '../Traits/Trait';

import type { ComponentTraitModel } from '../../types';

const TraitList: React.FC<{
  traits: ComponentTraitModel[];
}> = ({ traits }) => {
  return (
    <>
      <Card>
        {traits.map((t) => (
          <Trait key={t.type} trait={t} />
        ))}
      </Card>
    </>
  );
};

export default TraitList;
