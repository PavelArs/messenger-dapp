'use client'

import { messenger } from "@/contracts/messenger";
import { BaseError, useReadContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { useState, useEffect, useCallback, memo, useRef } from "react";
import React from "react";
import { Button } from "@/components/ui/Button";
import { MessageCard } from "@/components/MessageCard";

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

    useEffect(() => {
        console.log(`[FetchMessages] Debug Info:`, {
            messageType,
            functionName,
            connectedAddress: address,
            contractAddress: messenger.address
        });
    }, [messageType, functionName, address]);

    // Console log with additional metadata - use useRef to avoid double logs in StrictMode
    const isInitialRender = React.useRef(true);
    useEffect(() => {
        // Only log on real changes after initial render
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
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
        account: address,
        query: {
            refetchInterval: 30000,
            staleTime: 10000,
        },
    });

    useEffect(() => {
        if (error) {
            console.error(`[FetchMessages] Contract Read Error:`, error);
        }
        if (data) {
            console.log(`[FetchMessages] Raw Contract Data:`, data);
        }
    }, [data, error]);

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
    const dataLoggedRef = useRef(false);
    useEffect(() => {
        if (data) {
            // Only log once per data update
            if (!dataLoggedRef.current) {
                console.log(`[FetchMessages] Received data for ${messageType}:`, data);
                dataLoggedRef.current = true;
                // Reset after a delay to allow for future data updates
                setTimeout(() => {
                    dataLoggedRef.current = false;
                }, 1000);
            }
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
        return <div className="py-4 text-center text-text-light">Loading messages...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>Error fetching messages: {(error as BaseError).shortMessage || error.message}</p>
                <Button
                    onClick={handleRefresh}
                    variant="default"
                    className="mt-2"
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (!messages || messages.length === 0) {
        return (
            <div className="bg-secondary p-6 rounded-lg my-4 text-center">
                <p className="text-text-light mb-0">No messages found for {messageType} type</p>
            </div>
        );
    }

    return (
        <div className="messages-container">
            {isConfirming && (
                <div className="bg-blue-50 text-primary p-2 rounded-md mb-4 text-center">
                    Confirming new message...
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                    {messageType.charAt(0).toUpperCase() + messageType.slice(1)} Messages ({messages.length})
                </h3>

                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    disabled={isPending || isConfirming}
                >
                    Refresh
                </Button>
            </div>

            <div className="space-y-4">
                {messages.map((msg: Message, index: number) => (
                    <MessageCard
                        key={`${msg.sender}-${msg.receiver}-${Number(msg.timestamp)}-${index}`}
                        sender={msg.sender}
                        receiver={msg.receiver}
                        content={msg.content}
                        timestamp={msg.timestamp}
                        currentAddress={address}
                    />
                ))}
            </div>
        </div>
    );
});
