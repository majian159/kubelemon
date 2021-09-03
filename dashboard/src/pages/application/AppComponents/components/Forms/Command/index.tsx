import { ProFormTextArea } from '@ant-design/pro-form';

export type CommandProps = typeof ProFormTextArea.defaultProps;

const Command: React.FC<CommandProps> = (props) => {
  const { label, extra } = props;
  return (
    <ProFormTextArea
      {...props}
      label={label ?? 'Command'}
      extra={extra ?? 'If you need more than one, please newline'}
    />
  );
};

export default Command;
