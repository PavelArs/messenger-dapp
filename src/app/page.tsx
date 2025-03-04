'use client'

import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount} from "wagmi";
import Messenger from "@/app/messenger/page";

export default function Home() {
    const { isConnected } = useAccount();

    return (
        <>
            <ConnectButton />
            {isConnected && (
                <>
                    <Messenger/>
                </>
            )}
        </>
    );
}
