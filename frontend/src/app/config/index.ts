import { Config, cookieStorage, createStorage, http } from 'wagmi';
import { Chain, mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import 'dotenv/config';
import { HttpTransport } from 'viem';

export const hardhatLocal: Chain = {
  id: 31337,
  name: 'Hardhat Local',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] }
  }
};

const isLocalDev = process.env.NEXT_PUBLIC_NETWORK === 'local';

export function getConfig(): Config {
  const chains = isLocalDev ? [hardhatLocal] : [mainnet, sepolia];

  const transports: Record<number, HttpTransport> = {};

  if (!isLocalDev) {
    transports[mainnet.id] = http(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );
    transports[sepolia.id] = http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );
  } else {
    transports[hardhatLocal.id] = http('http://127.0.0.1:8545');
  }

  return getDefaultConfig({
    appName: 'messenger-dapp',
    projectId: `${process.env.NEXT_PUBLIC_ALCHEMY_PROJECT_ID}`,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage
    }),
    chains,
    transports
  });
}

export const currentChain = isLocalDev ? hardhatLocal : sepolia;
