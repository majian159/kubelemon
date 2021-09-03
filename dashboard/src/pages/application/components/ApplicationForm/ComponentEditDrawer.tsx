import { Button, Drawer, message } from 'antd';

import { useFormPart } from '@/components/FormPart';

import ComponentEdit from '../../AppComponents/components/ComponentEdit';

import type { ValidatesResult } from '@/components/FormPart';
import type { ComponentModel } from '../../types';

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

export default ComponentEditDrawer;
