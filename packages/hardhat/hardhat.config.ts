import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ignition-viem";
// import "@nomicfoundation/hardhat-chai-matchers";
import type { HardhatUserConfig } from "hardhat/types";
import { vars } from "hardhat/config";

const PRIVATE_KEY = vars.has("PRIVATE_KEY") ? [vars.get("PRIVATE_KEY")] : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      metadata: {
        bytecodeHash: "none", // disable ipfs
        useLiteralContent: true, // use source code
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    monadTestnet: {
      url: "https://testnet-rpc.monad.xyz",
      accounts: PRIVATE_KEY,
      chainId: 10143,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://testnet.monadexplorer.com",
  },
  etherscan: {
    enabled: false,
  },
};

export default config;
