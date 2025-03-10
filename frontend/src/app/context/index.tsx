"use client";

import { getConfig } from "../config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { type ReactNode, useState } from "react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

type Props = {
    children: ReactNode;
    cookies: string | null;
};

export function ContextProviders({ children, cookies }: Props) {
    const [config] = useState(() => getConfig());
    const [queryClient] = useState(() => new QueryClient());
    const initialState = cookieToInitialState(getConfig(), cookies);

    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider locale="en">{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
