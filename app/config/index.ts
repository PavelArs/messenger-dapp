import { cookieStorage, createStorage, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export function getConfig() {
    return getDefaultConfig({
        appName: "messenger-dapp",
        projectId: "fv9mdkqisqzpiknw",
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,  
        }),
        chains: [mainnet, sepolia],
        transports: {
            [mainnet.id]: http(),
            [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/ywSfx7m_nxh7EHS2dH7_hx5WDv09DZUj'),
        },
    })
}
