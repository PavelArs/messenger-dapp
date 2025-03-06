'use client'

import { FetchMessages } from "./FetchMessages";
import { SendMessage } from "@/app/messenger/SendMessage";
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from "@/components/ui/Button";
import { TabButton } from "@/components/ui/TabButton";

export default function Messenger() {
    const [messageType, setMessageType] = useState<'all' | 'sent' | 'received'>('all');
    const [transactionHash, setTransactionHash] = useState<string | undefined>();
    const { address } = useAccount();
    const router = useRouter();
    
    const renderLoggedRef = useRef(false);
    useEffect(() => {
        if (!renderLoggedRef.current) {
            console.log('[Messenger Page] Rendering with address:', address);
            renderLoggedRef.current = true;
            // Reset after a delay to allow for future renders
            return () => {
                setTimeout(() => {
                    renderLoggedRef.current = false;
                }, 100);
            };
        }
    }, [address]);
    
    // Handler for going back to home
    const handleBackToHome = useCallback(() => {
        router.push('/');
    }, [router]);
    
    // Memoize handlers to prevent recreating functions on each render
    const handleSendSuccess = useCallback((txHash: string) => {
        console.log('[Messenger Page] Send success with hash:', txHash);
        setTransactionHash(txHash);
    }, []);
    
    const handleSelectAll = useCallback(() => setMessageType('all'), []);
    const handleSelectSent = useCallback(() => setMessageType('sent'), []);
    const handleSelectReceived = useCallback(() => setMessageType('received'), []);
    
    return (
        <div className="messenger-container">
            <div className="messenger-header">
                <div className="left-section">
                    <Button 
                        onClick={handleBackToHome}
                        variant="link"
                        className="flex items-center gap-1"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        Back to Home
                    </Button>
                    <h1 className="text-2xl font-bold">Messenger</h1>
                </div>
                <div className="right-section">
                    <ConnectButton />
                </div>
            </div>
            
            <div className="flex gap-2 mb-6">
                <TabButton 
                    onClick={handleSelectAll}
                    active={messageType === 'all'}
                >
                    All Messages
                </TabButton>
                <TabButton 
                    onClick={handleSelectSent}
                    active={messageType === 'sent'}
                >
                    Sent Messages
                </TabButton>
                <TabButton 
                    onClick={handleSelectReceived}
                    active={messageType === 'received'}
                >
                    Received Messages
                </TabButton>
            </div>
            
            <FetchMessages
                key={messageType}
                messageType={messageType}
                transactionHash={transactionHash}
            />
            
            <SendMessage onSendSuccess={handleSendSuccess} />
        </div>
    );
}