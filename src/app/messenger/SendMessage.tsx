'use client'

import { messenger } from "@/contracts/messenger";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { useState, useEffect, useCallback, memo } from "react";

interface SendMessageProps {
    onSendSuccess?: (txHash: string) => void;
}

// Memoize the component to prevent unnecessary re-renders
export const SendMessage = memo(function SendMessage({ onSendSuccess }: SendMessageProps) {
    const [targetAddress, setTargetAddress] = useState("");
    const [message, setMessage] = useState("");
    const { address } = useAccount();

    // Console log for debugging
    useEffect(() => {
        console.log('[SendMessage] Component mounted, connected address:', address);
    }, [address]);

    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });
    
    // Handle transaction hash effect
    useEffect(() => {
        if (hash && onSendSuccess) {
            console.log('[SendMessage] Transaction hash created:', hash);
            onSendSuccess(hash);
        }
    }, [hash, onSendSuccess]);
    
    // Reset form on success
    useEffect(() => {
        if (isSuccess) {
            console.log('[SendMessage] Transaction successful, clearing form');
            setTargetAddress("");
            setMessage("");
        }
    }, [isSuccess]);

    // Memoized handler for sending messages
    const handleSendMessage = useCallback(() => {
        if (!targetAddress || !message) {
            alert("Please fill in both the target address and message.");
            return;
        }

        console.log('[SendMessage] Sending message to:', targetAddress);
        
        writeContract({
            ...messenger,
            functionName: "sendMessage",
            args: [targetAddress, message],
        });
    }, [targetAddress, message, writeContract]);

    // Memoized handlers for input changes
    const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetAddress(e.target.value);
    }, []);

    const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }, []);

    // Special handler to send message to yourself (for testing)
    const handleSendToSelf = useCallback(() => {
        if (!address) {
            alert("Please connect your wallet first.");
            return;
        }
        
        if (!message) {
            alert("Please enter a message.");
            return;
        }
        
        console.log('[SendMessage] Sending message to self:', address);
        
        writeContract({
            ...messenger,
            functionName: "sendMessage",
            args: [address, message],
        });
    }, [address, message, writeContract]);

    return (
        <div className="send-message-container">
            <h3>Send New Message</h3>
            <div>
                <label>Target Address: </label>
                <input
                    type="text"
                    value={targetAddress}
                    onChange={handleAddressChange}
                    placeholder="0x..."
                    style={{ width: "300px", marginBottom: "10px" }}
                />
            </div>

            <div>
                <label>Message: </label>
                <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Enter your message"
                    style={{ width: "300px", marginBottom: "10px" }}
                />
            </div>

            <div className="button-group">
                <button
                    onClick={handleSendMessage}
                    disabled={isPending || isConfirming}
                    className="send-btn"
                >
                    {isPending ? "Confirming..." : isConfirming ? "Sending..." : "Send Message"}
                </button>
                
                {address && (
                    <button
                        onClick={handleSendToSelf}
                        disabled={isPending || isConfirming || !message}
                        className="send-to-self-btn"
                    >
                        Send to Yourself (Test)
                    </button>
                )}
            </div>

            {hash && <div className="tx-hash">Transaction Hash: {hash}</div>}
            {isConfirming && <div className="confirming">Waiting for confirmation...</div>}
            {isSuccess && <div className="success">Message sent successfully!</div>}
            {error && <div className="error">Error: {error.message}</div>}
        </div>
    );
});