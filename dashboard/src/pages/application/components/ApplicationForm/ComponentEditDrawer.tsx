import { Button, message } from 'antd';
import { useState } from 'react';
import YAML from 'yaml';

import CodeEditor from '@/components/CodeEditor';
import { useFormPart } from '@/components/FormPart';

import ComponentEdit from '../../AppComponents/components/ComponentEdit';
import { reverseComponent } from '@/pages/application/types';

import type { ValidatesResult } from '@/components/FormPart';
import type { ComponentModel } from '@/pages/application/types';
import { useEffect } from 'react';
import ProDrawer from '@/components/ProDrawer';

type EditMode = 'form' | 'editor';

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

  const [mode, setMode] = useState<EditMode>('form');
  const isForm = mode === 'form';

  const [codeValue, setCodeValue] = useState<string>();
  useEffect(() => {
    if (mode === 'editor' && codeValue === undefined) {
      setCodeValue(component == null ? '' : YAML.stringify(reverseComponent(component)));
    }
  }, [component, mode, codeValue]);

  return (
    <ProDrawer
      title={`Edit ${component?.name} component`}
      extra={
        <a
          onClick={() => {
            setMode(isForm ? 'editor' : 'form');
            if (isForm) {
              setCodeValue(YAML.stringify(reverseComponent(instance.getValues()!)));
            } else {
              instance.setValues(YAML.parse(codeValue ?? ''));
            }
          }}
        >
          {isForm ? 'Switch to editor' : 'Switch to form'}
        </a>
      }
      visible={component !== undefined}
      onClose={() => save()}
      width="80%"
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={() => {
              if (!isForm) {
                instance.setValues(YAML.parse(codeValue ?? ''));
              }
              save({
                error: () => message.error('Verification failed, please check!'),
              });
            }}
          >
            Save
          </Button>
        </div>
      }
    >
      {component == null ? null : (
        <>
          <div style={{ display: isForm ? 'block' : 'none' }}>
            <ComponentEdit instance={instance} values={component} onChange={() => {}} />
          </div>
          {isForm ? null : (
            <CodeEditor
              language="yaml"
              value={codeValue}
              onChange={(v) => {
                setCodeValue(v);
              }}
            />
          )}
        </>
      )}
    </ProDrawer>
  );
};

export default ComponentEditDrawer;
