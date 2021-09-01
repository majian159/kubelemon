import { ProFormTextArea } from '@ant-design/pro-form';

export type CommandComponentProps = typeof ProFormTextArea.defaultProps;
const CommandComponent: React.FC<CommandComponentProps> = (props) => {
  const { label, extra } = props;
  return (
    <ProFormTextArea
      {...props}
      label={label ?? 'Command'}
      extra={extra ?? "If you need more than one, please separate with ','"}
      normalize={(v) => v?.split(',')}
    />
  );
};

export default CommandComponent;
