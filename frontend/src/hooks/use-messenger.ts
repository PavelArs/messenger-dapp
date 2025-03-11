import { useMemo, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import MessengerContract from "@/contracts/Messenger.json";
import type { Contact, Message } from "@/types/messenger";

export function useMessenger(userAddress: string | undefined) {
    const [receiverAddress, setReceiverAddress] = useState("");
    const [selectedContact, setSelectedContact] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const { writeContractAsync } = useWriteContract();

    const contractConfig = {
        address: MessengerContract.address as `0x${string}`,
        abi: MessengerContract.abi,
    };

    const { data: contactAddresses, refetch: refetchContacts } = useReadContract({
        ...contractConfig,
        functionName: "getContacts",
        account: userAddress,
    });

    const { data: sentMessages, refetch: refetchSent } = useReadContract({
        ...contractConfig,
        functionName: "getSentMessages",
        account: userAddress,
        args: [selectedContact],
    });

    const { data: receivedMessages } = useReadContract({
        ...contractConfig,
        functionName: "getReceivedMessages",
        account: userAddress,
        args: [selectedContact],
    });

    const contacts: Contact[] = useMemo(() => {
        if (!contactAddresses) return [];
        return (contactAddresses as string[]).map((address) => ({ address }));
    }, [contactAddresses]);

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

    const handleSendMessage = async (content: string) => {
        if (!userAddress || !receiverAddress) return;

        try {
            await writeContractAsync({
                ...contractConfig,
                functionName: "sendMessage",
                args: [receiverAddress, content],
            });

            if (selectedContact?.toLowerCase() === receiverAddress.toLowerCase()) {
                refetchSent();
            }
            refetchContacts();
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
            refetchSent();
            refetchContacts();
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
        dialogMessages,
        handleSendMessage,
        handleQuickReply,
    };
}
