'use client'

import { FetchMessages } from "./FetchMessages";
import { SendMessage } from "@/app/messenger/SendMessage";
import { useState, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';

export default function Messenger() {
    const [messageType, setMessageType] = useState<'all' | 'sent' | 'received'>('all');
    const [transactionHash, setTransactionHash] = useState<string | undefined>();
    const { address } = useAccount();
    
    // Log when page renders
    console.log('[Messenger Page] Rendering with address:', address);
    
    // Memoize handlers to prevent recreating functions on each render
    const handleSendSuccess = useCallback((txHash: string) => {
        console.log('[Messenger Page] Send success with hash:', txHash);
        setTransactionHash(txHash);
    }, []);
    
    const handleSelectAll = useCallback(() => setMessageType('all'), []);
    const handleSelectSent = useCallback(() => setMessageType('sent'), []);
    const handleSelectReceived = useCallback(() => setMessageType('received'), []);
    
    // Memoize button classes to prevent object recreation
    const allButtonClass = useMemo(() => 
        messageType === 'all' ? 'message-filter-btn active' : 'message-filter-btn', 
    [messageType]);
    
    const sentButtonClass = useMemo(() => 
        messageType === 'sent' ? 'message-filter-btn active' : 'message-filter-btn', 
    [messageType]);
    
    const receivedButtonClass = useMemo(() => 
        messageType === 'received' ? 'message-filter-btn active' : 'message-filter-btn', 
    [messageType]);
    
    return (
        <div className="messenger-container">
            <div className="message-filters">
                <button 
                    onClick={handleSelectAll}
                    className={allButtonClass}
                >
                    All Messages
                </button>
                <button 
                    onClick={handleSelectSent}
                    className={sentButtonClass}
                >
                    Sent Messages
                </button>
                <button 
                    onClick={handleSelectReceived}
                    className={receivedButtonClass}
                >
                    Received Messages
                </button>
            </div>
            
            {/* Show connected wallet address */}
            {address && (
                <div className="wallet-info">
                    Connected: {address.slice(0, 6)}...{address.slice(-4)}
                </div>
            )}
            
            {/* The key prop forces re-mounting when message type changes */}
            <FetchMessages 
                key={messageType}
                messageType={messageType}
                transactionHash={transactionHash}
            />
            
            <SendMessage onSendSuccess={handleSendSuccess} />
        </div>
    );
}