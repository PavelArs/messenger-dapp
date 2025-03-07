import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('Messenger', (m) => {
  const messenger = m.contract('Messenger');

  return { messenger };
});
