import { useCallback } from 'react';
import MonacoEditor from 'react-monaco-editor';

export default ({
  language,
  theme = 'vs-dark',
  width = '100%',
  height = '100%',
  value,
  onChange,
}: {
  language?: 'yaml' | 'json';
  theme?: 'vs-light' | 'vs-dark';
  width?: string | number;
  height?: string | number;
  value?: string;
  onChange?: (v?: string) => void;
}) => {
  const localOnChange = useCallback(
    (v) => {
      onChange?.(v);
    },
    [onChange],
  );

  return (
    <MonacoEditor
      width={width}
      height={height}
      language={language}
      theme={theme}
      value={value}
      onChange={localOnChange}
      /* language="javascript"
      theme="vs-dark" */
      /*           value={code}
          options={options}
          onChange={::this.onChange}
          editorDidMount={::this.editorDidMount} */
    />
  );
};
