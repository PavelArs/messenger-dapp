import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MessengerModule = buildModule("Messenger", (m) => {
  const messenger = m.contract("Messenger");

  return { messenger };
});

export default MessengerModule;
