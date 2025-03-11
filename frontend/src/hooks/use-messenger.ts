import { useEffect, useMemo, useState } from "react";
import {
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import MessengerContract from "@/contracts/Messenger.json";
import type { Contact, Message } from "@/types/messenger";
import { messengerAbi } from "@/generated";

const contractConfig = {
  address: MessengerContract.address as `0x${string}`,
  abi: messengerAbi,
};

export function useMessenger(userAddress: `0x${string}` | undefined) {
  const [receiverAddress, setReceiverAddress] = useState<`0x${string}`>();
  const [selectedContact, setSelectedContact] = useState<`0x${string}`>();
  const [messages, setMessages] = useState<Message[]>([]);
  const { writeContractAsync } = useWriteContract();

  const { data: contactAddresses, refetch: refetchContacts } = useReadContract({
    ...contractConfig,
    functionName: "getContacts",
    account: userAddress,
  });

  const { data: conversationData, refetch: refetchConversation } =
    useReadContract({
      ...contractConfig,
      functionName: "getConversation",
      account: userAddress,
      args: [selectedContact as `0x${string}`],
      query: {
        enabled: !!selectedContact, // Only fetch when a contact is selected
      },
    });

  const contacts: Contact[] = useMemo(() => {
    if (!contactAddresses) return [];
    return (contactAddresses as `0x${string}`[]).map((address) => ({
      address,
    }));
  }, [contactAddresses]);

  const dialogMessages: Message[] = useMemo(() => {
    if (!conversationData) return [];
    return Array.from(conversationData as unknown as Message[])
      .map((msg) => ({
        sender: msg.sender.toLowerCase() as `0x${string}`,
        receiver: msg.receiver.toLowerCase() as `0x${string}`,
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
      const { sender, receiver } = latestLog.args || {};
      if (
        selectedContact &&
        sender &&
        receiver &&
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
      const user = latestLog.args?.user;
      if (user && user.toLowerCase() === userAddress?.toLowerCase()) {
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
