"use client";

import { messenger } from "@/contracts/messenger";
import {
  BaseError,
  useReadContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
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

export const FetchMessages = memo(function FetchMessages({
  triggerRefresh = false,
  transactionHash,
  messageType = "all",
}: {
  triggerRefresh?: boolean;
  transactionHash?: string;
  messageType?: "all" | "sent" | "received";
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { address } = useAccount();

  const functionName =
    messageType === "sent"
      ? "getSentMessages"
      : messageType === "received"
        ? "getReceivedMessages"
        : "getAllMessages";

  const { data, error, isPending, refetch } = useReadContract({
    ...messenger,
    functionName,
    account: address,
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

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      setMessages(data as Message[]);
    }
  }, [data, messageType]);

  useEffect(() => {
    if (triggerRefresh) {
      refetch();
    }
  }, [triggerRefresh, refetch]);

  if (isPending) {
    return (
      <div className="text-text-light py-4 text-center">
        Loading messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>
          Error fetching messages:{" "}
          {(error as BaseError).shortMessage || error.message}
        </p>
        <Button onClick={handleRefresh} variant="default" className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="bg-secondary my-4 rounded-lg p-6 text-center">
        <p className="text-text-light mb-0">
          No messages found for {messageType} type
        </p>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {isConfirming && (
        <div className="text-primary mb-4 rounded-md bg-blue-50 p-2 text-center">
          Confirming new message...
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {messageType.charAt(0).toUpperCase() + messageType.slice(1)} Messages
          ({messages.length})
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
