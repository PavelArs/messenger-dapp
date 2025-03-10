"use client";

import { useMemo, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./messenger.module.css";
import { ChatWindow, ContactsList, EmptyState, MessageForm } from "./components";
import MessengerContract from "@/contracts/Messenger.json";

type Message = {
    sender: string;
    receiver: string;
    content: string;
    timestamp: bigint;
};

export default function Home() {
    const [receiverAddress, setReceiverAddress] = useState("");
    const [selectedContact, setSelectedContact] = useState<string | null>(null);

    const { address, isConnected } = useAccount();
    const { writeContractAsync } = useWriteContract();

    // Get all contacts
    const { data: contactAddresses } = useReadContract({
        address: MessengerContract.address as `0x${string}`,
        abi: MessengerContract.abi,
        functionName: "getContacts",
        account: address,
    });

    const { data: sentMessages, refetch: refetchSent } = useReadContract({
        address: MessengerContract.address as `0x${string}`,
        abi: MessengerContract.abi,
        functionName: "getSentMessages",
        account: address,
        args: [selectedContact],
    });

    const { data: receivedMessages, refetch: refetchContacts } = useReadContract({
        address: MessengerContract.address as `0x${string}`,
        abi: MessengerContract.abi,
        functionName: "getReceivedMessages",
        account: address,
        args: [selectedContact],
    });

    // Handle sending a new message (from the form)
    const handleSendMessage = async (content: string) => {
        if (!isConnected || !receiverAddress) return;

        try {
            await writeContractAsync({
                address: MessengerContract.address as `0x${string}`,
                abi: MessengerContract.abi,
                functionName: "sendMessage",
                args: [receiverAddress, content],
            });

            // If we're sending to the selected contact, update the conversation
            if (
                selectedContact &&
                selectedContact.toLowerCase() === receiverAddress.toLowerCase()
            ) {
                refetchSent();
            }

            // Update contacts list
            refetchContacts();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // Handle quick reply (from the chat window)
    const handleQuickReply = async (content: string) => {
        if (!isConnected || !selectedContact) return;

        try {
            await writeContractAsync({
                address: MessengerContract.address as `0x${string}`,
                abi: MessengerContract.abi,
                functionName: "sendMessage",
                args: [selectedContact, content],
            });

            // Refresh the contact's messages
            refetchSent();
            refetchContacts();
        } catch (error) {
            console.error("Failed to send quick reply:", error);
        }
    };

    // Convert raw contact addresses to Contact objects
    const contacts = useMemo(() => {
        if (!contactAddresses) return [];

        // Create Contact objects with just the address
        return (contactAddresses as string[]).map((address) => ({
            address: address,
        }));
    }, [contactAddresses]);

    // Select a contact to view dialog
    const handleSelectContact = (contactAddress: string) => {
        setSelectedContact(contactAddress);
        setReceiverAddress(contactAddress);
    };

    // Combined and sorted messages for the dialog view
    const dialogMessages: Message[] = useMemo(() => {
        if (!sentMessages && !receivedMessages) return [];

        return [...(sentMessages || []), ...(receivedMessages || [])]
            .filter(
                (message, index, self) =>
                    index ===
                    self.findIndex(
                        (m) =>
                            m.sender === message.sender &&
                            m.recipient === message.recipient &&
                            m.content === message.content &&
                            m.timestamp === message.timestamp
                    )
            )
            .sort((a, b) => Number(a.timestamp - b.timestamp));
    }, [sentMessages, receivedMessages]);

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
                        <MessageForm
                            receiverAddress={receiverAddress}
                            onReceiverAddressChange={setReceiverAddress}
                            onSendMessage={handleSendMessage}
                        />

                        <div
                            className={`${styles.layout} ${contacts.length > 0 ? styles.twoColumnLayout : ""}`}
                        >
                            {contacts.length > 0 && (
                                <div className={styles.sidebarColumn}>
                                    <ContactsList
                                        contacts={contacts}
                                        selectedContact={selectedContact}
                                        onSelectContact={handleSelectContact}
                                    />
                                </div>
                            )}

                            <div className={styles.mainColumn}>
                                {selectedContact ? (
                                    <ChatWindow
                                        currentUserAddress={address || ""}
                                        selectedContact={selectedContact}
                                        messages={dialogMessages}
                                        onSendReply={handleQuickReply}
                                    />
                                ) : (
                                    <EmptyState />
                                )}
                            </div>
                        </div>
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
