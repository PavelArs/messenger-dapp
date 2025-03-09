import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";

import { HardhatUserConfig } from "hardhat/types";
import { vars } from "hardhat/config";

const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const PRIVATE_KEY = vars.has("PRIVATE_KEY") ? [vars.get("PRIVATE_KEY")] : [];
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: PRIVATE_KEY,
      chainId: 11155111,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
