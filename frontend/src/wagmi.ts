import { type Config, cookieStorage, createStorage, fallback, http, webSocket } from "wagmi";
import { type Chain, mainnet, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import type { Transport } from "viem";
import "dotenv/config";

const hardhatLocal: Chain = {
    id: 31337,
    name: "Hardhat Local",
    nativeCurrency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ["http://127.0.0.1:8545"], webSocket: ["ws://127.0.0.1:8545"] },
        public: { http: ["http://127.0.0.1:8545"], webSocket: ["ws://127.0.0.1:8545"] },
    },
};

const isLocalDev = process.env.NEXT_PUBLIC_NETWORK === "local";

export function getConfig(): Config {
    const chains = isLocalDev ? [hardhatLocal] : [mainnet, sepolia];

    const transports: Record<number, Transport> = {
        [hardhatLocal.id]: fallback([
            webSocket("ws://127.0.0.1:8545"),
            http("http://127.0.0.1:8545"),
        ]),
        [mainnet.id]: !isLocalDev
            ? fallback([
                  webSocket(
                      `wss://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
                  ),
                  http(
                      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
                  ),
              ])
            : http(),
        [sepolia.id]: !isLocalDev
            ? fallback([
                  webSocket(
                      `wss://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
                  ),
                  http(
                      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
                  ),
              ])
            : http(),
    };

    return getDefaultConfig({
        appName: "messenger-dapp",
        projectId: `${process.env.NEXT_PUBLIC_ALCHEMY_PROJECT_ID}`,
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,
        }),
        // @ts-expect-error Type workaround for chains array
        chains,
        transports,
    });
}

declare module "wagmi" {
    interface Register {
        config: ReturnType<typeof getConfig>;
    }
}

export const currentChain = isLocalDev ? hardhatLocal : sepolia;
