import { cookieStorage, createStorage, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import 'dotenv/config';

export function getConfig() {
    return getDefaultConfig({
        appName: "messenger-dapp",
        projectId: `${process.env.NEXT_PUBLIC_ALCHEMY_PROJECT_ID}`,
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,
        }),
        chains: [mainnet, sepolia],
        transports: {
            [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
            [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
        },
    })
}
