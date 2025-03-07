'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MessengerABI from '../../contracts/Messenger.json';
import ContractAddress from '../../contracts/contract-address.json';
import styles from './messenger.module.css';

type Message = {
    sender: string;
    receiver: string;
    content: string;
    timestamp: bigint;
};

export default function Messenger() {
    const [receiverAddress, setReceiverAddress] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const { data: sentMessages, refetch: refetchSent } = useReadContract({
        address: ContractAddress.Messenger as `0x${string}`,
        abi: MessengerABI.abi,
        functionName: 'getSentMessages',
        enabled: isConnected,
    });

    const { data: receivedMessages, refetch: refetchReceived } =
        useReadContract({
            address: ContractAddress.Messenger as `0x${string}`,
            abi: MessengerABI.abi,
            functionName: 'getReceivedMessages',
            enabled: isConnected,
        });

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected || !receiverAddress || !messageContent) return;

        try {
            await writeContractAsync({
                address: ContractAddress.Messenger as `0x${string}`,
                abi: MessengerABI.abi,
                functionName: 'sendMessage',
                args: [receiverAddress, messageContent],
            });

            setMessageContent('');

            refetchSent();
            refetchReceived();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const formatTimestamp = (timestamp: bigint) => {
        return new Date(Number(timestamp) * 1000).toLocaleString();
    };

    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const allMessages = [...(sentMessages || []), ...(receivedMessages || [])]
        .filter(
            (message, index, self) =>
                index ===
                self.findIndex(
                    (m) =>
                        m.sender === messa,ge.sender &&
   ,                     m.receiver === message.receiver &&
                        m.content === message.content &&
                        m.timestamp === message.timestamp
                )
        )
        .sort((a, b) => Number(b.timestamp - a.timestamp));

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Decentralized Messenger</h1>
                <div className={styles.connectButton}>
                    <ConnectButton />
                </div>
            </header>

            <main className={styles.main}>
                {isConnected ? (
                    <>
                        <section className={styles.sendMessageSection}>
                            <h2 className={styles.sectionTitle}>
                                Send a Message
                            </h2>
                            <form
                                onSubmit={handleSendMessage}
                                className={styles.form}
                            >
                                <div className={styles.formGroup}>
                                    <label
                                        htmlFor="receiver"
                                        className={styles.label}
                                    >
                                        Receiver Address:
                                    </label>
                                    <input
                                        type="text"
                                        id="receiver"
                                        value={receiverAddress}
                                        onChange={(e) =>
                                            setReceiverAddress(e.target.value)
                                        }
                                        placeholder="0x..."
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label
                                        htmlFor="message"
                                        className={styles.label}
                                    >
                                        Message:
                                    </label>
                                    <textarea
                                        id="message"
                                        value={messageContent}
                                        onChange={(e) =>
                                            setMessageContent(e.target.value)
                                        }
                                        placeholder="Type your message here..."
                                        className={styles.textarea}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.sendButton}
                                >
                                    Send Message
                                </button>
                            </form>
                        </section>

                        <section className={styles.messagesSection}>
                            <h2 className={styles.sectionTitle}>Messages</h2>
                            <div className={styles.messageList}>
                                {allMessages.length > 0 ? (
                                    allMessages.map((message, index) => (
                         ,               <div
                                            key={`${message.sender}-${message.receiver}-${message.timestamp}-${index}`}
                                            className={`${styles.messageCard} ${
                                                message.sender.toLowerCase() ===
                                                address?.t,oLowerCase()
                                                    ? styles.sentMessage
                                                    : styles.receivedMessage
                                            }`}
                                        >
                                            <div
                                                className={styles.messageHeader}
                                  ,          >
                                                {message.sender.toLowerCase() ===
                                                address?.toLowerCase() ? (
                                                    <span>
                                                        To:{' '}
                                                        {formatAddress(
                                                            message.receiver
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        From:{' '}
                                                        {formatAddress(
                                                            message.sender
                                                        )}
                                                    </span>
                                                )}
                                                <span
                                                    className={styles.timestamp}
                                                >
                                                    {formatTimestamp(
                                                        message.timestamp
                                                    )}
                                                </span>
                                            </div>
                                            <p
                                                className={
                                                    styles.messageContent
                                                }
                                            >
                                                {message.content}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.noMessages}>
                                        No messages found.
                                    </p>
                                )}
                            </div>
                        </section>
                    </>
                ) : (
                    <div className={styles.connectPrompt}>
                        <p>Connect your wallet to send and receive messages.</p>
                        <ConnectButton />
                    </div>
                )}
            </main>
        </div>
    );
}
