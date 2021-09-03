import CodeEditor from '@/components/CodeEditor';
import type { FormPartProps } from '@/components/FormPart';
import { reverseTrait } from '@/pages/application/types';
import { useEffect, useState } from 'react';
import YAML from 'yaml';
import type { ComponentTraitModel } from '@/pages/application/types';

export default (props: FormPartProps<ComponentTraitModel>) => {
  const { instance, values } = props;
  const [codeValue, setCodeValue] = useState<string | undefined>(() =>
    values == null ? undefined : YAML.stringify(reverseTrait(values)),
  );

  useEffect(() => {
    if (instance == null) {
      return;
    }
    instance.getValues = () => {
      return codeValue == null ? {} : YAML.parse(codeValue);
    };
    instance.setValues = (v) => {
      setCodeValue(v == null ? '' : YAML.stringify(v));
    };
  }, [codeValue, instance, values]);

  return (
    <>
      <CodeEditor
        language="yaml"
        width={900}
        height={300}
        value={codeValue}
        onChange={(v) => {
          setCodeValue(v);
        }}
      />
    </>
  );
};
