import { Command } from '../';

export default () => {
  return <Command name={['exec', 'command']} required rules={[{ required: true }]} />;
};
