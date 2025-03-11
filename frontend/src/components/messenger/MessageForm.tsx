"use client";

import { useState } from "react";
import styles from "./styles/messenger.module.css";

type MessageFormProps = {
    receiverAddress: string;
    onReceiverAddressChange: (address: string) => void;
    onSendMessage: (content: string) => Promise<void>;
};

export function MessageForm({
    receiverAddress,
    onReceiverAddressChange,
    onSendMessage,
}: MessageFormProps) {
    const [messageContent, setMessageContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!receiverAddress || !messageContent) return;

        try {
            await onSendMessage(messageContent);
            setMessageContent("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <section className={styles.sendMessageSection}>
            <h2 className={styles.sectionTitle}>Send a New Message</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="receiver" className={styles.label}>
                        Recipient Address:
                    </label>
                    <input
                        type="text"
                        id="receiver"
                        value={receiverAddress}
                        onChange={(e) => onReceiverAddressChange(e.target.value)}
                        placeholder="0x..."
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>
                        Message:
                    </label>
                    <textarea
                        id="message"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Type your message here..."
                        className={styles.textarea}
                        required
                    />
                </div>
                <button type="submit" className={styles.sendButton}>
                    Send Message
                </button>
            </form>
        </section>
    );
}
