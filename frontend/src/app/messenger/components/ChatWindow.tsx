"use client";

import { useState } from "react";
import styles from "../messenger.module.css";

type ChatWindowProps = {
    currentUserAddress: string;
    selectedContact: string;
    messages: Message[];
    onSendReply: (content: string) => Promise<void>;
};

export default function ChatWindow({
    currentUserAddress,
    selectedContact,
    messages,
    onSendReply,
}: ChatWindowProps) {
    const [quickReply, setQuickReply] = useState("");

    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const getAvatarLetter = (address: string) => {
        return address.substring(2, 3).toUpperCase();
    };

    const formatTimestamp = (timestamp: bigint) => {
        return new Date(Number(timestamp) * 1000).toLocaleString();
    };

    const handleQuickReply = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!quickReply) return;

        try {
            await onSendReply(quickReply);
            setQuickReply("");
        } catch (error) {
            console.error("Failed to send quick reply:", error);
        }
    };

    return (
        <section className={styles.messagesSection}>
            <div className={styles.dialogHeader}>
                <div className={styles.dialogAvatar}>{getAvatarLetter(selectedContact)}</div>
                <div className={styles.dialogInfo}>
                    <div className={styles.dialogAddress}>{formatAddress(selectedContact)}</div>
                    <div className={styles.dialogStatus}>{messages.length} messages</div>
                </div>
            </div>

            <div className={styles.messageList}>
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <div
                            key={`${message.sender}-${message.recipient}-${message.timestamp}-${index}`}
                            className={`${styles.messageCard} ${
                                message.sender.toLowerCase() === currentUserAddress?.toLowerCase()
                                    ? styles.sentMessage
                                    : styles.receivedMessage
                            }`}
                        >
                            <div className={styles.messageHeader}>
                                <span className={styles.timestamp}>
                                    {formatTimestamp(message.timestamp)}
                                </span>
                            </div>
                            <p className={styles.messageContent}>{message.content}</p>
                        </div>
                    ))
                ) : (
                    <p className={styles.noMessages}>No messages with this contact yet.</p>
                )}
            </div>

            <form onSubmit={handleQuickReply} className={styles.quickReplyForm}>
                <input
                    type="text"
                    value={quickReply}
                    onChange={(e) => setQuickReply(e.target.value)}
                    placeholder="Type a message..."
                    className={styles.quickReplyInput}
                    required
                />
                <button type="submit" className={styles.quickReplyButton}>
                    Send
                </button>
            </form>
        </section>
    );
}
