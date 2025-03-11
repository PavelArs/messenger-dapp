import { useEffect, useMemo, useState } from "react";
import { useReadContract, useWatchContractEvent, useWriteContract } from "wagmi";
import MessengerContract from "@/contracts/Messenger.json";
import type { Contact, Message } from "@/types/messenger";

const contractConfig = {
    address: MessengerContract.address as `0x${string}`,
    abi: MessengerContract.abi,
};

export function useMessenger(userAddress: `0x${string}` | undefined) {
    const [receiverAddress, setReceiverAddress] = useState("");
    const [selectedContact, setSelectedContact] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const { writeContractAsync } = useWriteContract();

    const { data: contactAddresses, refetch: refetchContacts } = useReadContract({
        ...contractConfig,
        functionName: "getContacts",
        account: userAddress,
    });

    const { data: conversationData, refetch: refetchConversation } = useReadContract({
        ...contractConfig,
        functionName: "getConversation",
        account: userAddress,
        args: [selectedContact],
        query: {
            enabled: !!selectedContact, // Only fetch when a contact is selected
        },
    });

    const contacts: Contact[] = useMemo(() => {
        if (!contactAddresses) return [];
        return (contactAddresses as string[]).map((address) => ({ address }));
    }, [contactAddresses]);

    const dialogMessages: Message[] = useMemo(() => {
        if (!conversationData) return [];
        return (conversationData as any[])
            .map((msg) => ({
                sender: msg.sender.toLowerCase(),
                receiver: msg.receiver.toLowerCase(),
                content: msg.content,
                timestamp: BigInt(msg.timestamp),
            }))
            .sort((a, b) => Number(a.timestamp - b.timestamp));
    }, [conversationData]);

    useEffect(() => {
        setMessages(dialogMessages);
    }, [dialogMessages]);

    useWatchContractEvent({
        ...contractConfig,
        eventName: "MessageSent",
        onLogs(logs) {
            const latestLog = logs[logs.length - 1];
            const { sender, receiver } = latestLog.args;
            if (
                selectedContact &&
                (sender.toLowerCase() === selectedContact.toLowerCase() ||
                    receiver.toLowerCase() === selectedContact.toLowerCase())
            ) {
                refetchConversation();
            }
        },
    });

    useWatchContractEvent({
        ...contractConfig,
        eventName: "ContactAdded",
        onLogs(logs) {
            const latestLog = logs[logs.length - 1];
            if (latestLog.args.user.toLowerCase() === userAddress?.toLowerCase()) {
                refetchContacts();
            }
        },
    });

    const handleSendMessage = async (content: string) => {
        if (!userAddress || !receiverAddress) return;

        try {
            await writeContractAsync({
                ...contractConfig,
                functionName: "sendMessage",
                args: [receiverAddress, content],
            });

            if (selectedContact?.toLowerCase() === receiverAddress.toLowerCase()) {
                refetchConversation();
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleQuickReply = async (content: string) => {
        if (!userAddress || !selectedContact) return;

        try {
            await writeContractAsync({
                ...contractConfig,
                functionName: "sendMessage",
                args: [selectedContact, content],
            });

            refetchConversation();
        } catch (error) {
            console.error("Failed to send quick reply:", error);
        }
    };

    return {
        receiverAddress,
        setReceiverAddress,
        selectedContact,
        setSelectedContact,
        contacts,
        dialogMessages: messages,
        handleSendMessage,
        handleQuickReply,
    };
}
