'use client'

import { messenger } from "@/contracts/messenger";
import { BaseError, useReadContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { useState, useEffect, useCallback, memo } from "react";

interface Message {
    sender: string;
    receiver: string;
    content: string;
    timestamp: bigint;
}

// Memoize the component to prevent unnecessary re-renders
export const FetchMessages = memo(function FetchMessages({
    triggerRefresh = false,
    transactionHash,
    messageType = 'all'
    }: {
    triggerRefresh?: boolean;
    transactionHash?: string;
    messageType?: 'all' | 'sent' | 'received';
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const { address } = useAccount();
    
    // Derive function name only when messageType changes
    const functionName = messageType === 'sent' 
        ? 'getSentMessages' 
        : messageType === 'received' 
            ? 'getReceivedMessages' 
            : 'getAllMessages';

    // Console log with additional metadata
    useEffect(() => {
        console.log(`[FetchMessages] Type: ${messageType}, Function: ${functionName}, Connected address: ${address}`);
    }, [messageType, functionName, address]);

    const {
        data,
        error,
        isPending,
        refetch
    } = useReadContract({
        ...messenger,
        functionName,
        query: {
            refetchInterval: 30000,
            staleTime: 10000,
        },
    });

    const { isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash: transactionHash,
        onSuccess: () => {
            refetch();
        },
    });

    // Use a memoized handler for the refresh button
    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    // Only update messages state when data changes
    useEffect(() => {
        if (data) {
            console.log(`[FetchMessages] Received data for ${messageType}:`, data);
            setMessages(data as Message[]);
        }
    }, [data, messageType]);

    // Handle triggerRefresh changes
    useEffect(() => {
        if (triggerRefresh) {
            refetch();
        }
    }, [triggerRefresh, refetch]);

    if (isPending) {
        return <div>Loading messages...</div>;
    }

    if (error) {
        return (
            <div className="error">
                Error fetching messages: {(error as BaseError).shortMessage || error.message}
                <button
                    onClick={handleRefresh}
                    className="retry-btn"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!messages || messages.length === 0) {
        return <div>No messages found for {messageType} type</div>;
    }

    return (
        <div className="messages-container">
            {isConfirming && <div>Confirming new message...</div>}
            <h3>{messageType.charAt(0).toUpperCase() + messageType.slice(1)} Messages ({messages.length})</h3>
            {messages.map((msg: Message, index: number) => (
                <div key={`${msg.sender}-${msg.receiver}-${Number(msg.timestamp)}-${index}`} className="message-card">
                    <p>
                        <strong>From:</strong>{" "}
                        {msg.sender.slice(0, 6)}...{msg.sender.slice(-4)}
                        {msg.sender.toLowerCase() === address?.toLowerCase() && " (You)"}
                    </p>
                    <p>
                        <strong>To:</strong>{" "}
                        {msg.receiver.slice(0, 6)}...{msg.receiver.slice(-4)}
                        {msg.receiver.toLowerCase() === address?.toLowerCase() && " (You)"}
                    </p>
                    <p className="message-content">{msg.content}</p>
                    <p className="timestamp">
                        {new Date(Number(msg.timestamp) * 1000).toLocaleString()}
                    </p>
                </div>
            ))}
            <button
                onClick={handleRefresh}
                className="refresh-btn"
                disabled={isPending || isConfirming}
            >
                Refresh Messages
            </button>
        </div>
    );
});
