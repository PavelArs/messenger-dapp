import { Config, cookieStorage, createStorage, http } from "wagmi";
import { Chain, mainnet, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createPublicClient, http as viemHttp, HttpTransport, webSocket } from "viem";
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
        default: { http: ["http://127.0.0.1:8545"] },
        public: { http: ["http://127.0.0.1:8545"] },
    },
};

const isLocalDev = process.env.NEXT_PUBLIC_NETWORK === "local";

const getWebSocketUrl = (chainId: number): string => {
    switch (chainId) {
        case mainnet.id:
            return `wss://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
        case sepolia.id:
            return `wss://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
        case hardhatLocal.id:
            return "ws://127.0.0.1:8545";
        default:
            throw new Error(`No WebSocket URL configured for chain ID ${chainId}`);
    }
};

export const createWsClient = (chainId: number) => {
    const chain = [mainnet, sepolia, hardhatLocal].find((c) => c.id === chainId);
    if (!chain) throw new Error(`Chain with ID ${chainId} not supported`);

    return createPublicClient({
        chain,
        transport: webSocket(getWebSocketUrl(chainId), {
            reconnectAttempts: 5,
            reconnectDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
        }),
    });
};

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
        transports[hardhatLocal.id] = http("http://127.0.0.1:8545");
    }

    return getDefaultConfig({
        appName: "messenger-dapp",
        projectId: `${process.env.NEXT_PUBLIC_ALCHEMY_PROJECT_ID}`,
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,
        }),
        // @ts-expect-error idc
        chains,
        transports,
    });
}

export const createHybridTransport = (chainId: number) => {
    try {
        return webSocket(getWebSocketUrl(chainId), {
            // Fall back to HTTP if WebSocket connection fails
            onClose: () => console.warn("WebSocket connection closed, falling back to HTTP"),
            onError: (error) => console.error("WebSocket error:", erro),
        });
    } catch (error) {
        console.error("Failed to create WebSocket transport, using HTTP fallback:", error);
        // Determine the HTTP URL based on the chain
        let httpUrl: string;

        if (chainId === hardhatLocal.id) {
            httpUrl = "http://127.0.0.1:8545";
        } else {
            httpUrl = `https://eth-${chainId === mainnet.id ? "mainnet" : "sepolia"}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
        }

        return viemHttp(httpUrl);
    }
};

declare module "wagmi" {
    interface Register {
        config: ReturnType<typeof getConfig>;
    }
}

export const currentChain = isLocalDev ? hardhatLocal : sepolia;
