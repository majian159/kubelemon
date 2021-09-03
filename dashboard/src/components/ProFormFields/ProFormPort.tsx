import type { ProFormNumberProps } from './ProFormNumber';
import ProFormNumber from './ProFormNumber';

const ProFormPort: React.FC<ProFormNumberProps> = (props) => {
  return <ProFormNumber min={1} max={65535} required {...props} />;
};

export default ProFormPort;
