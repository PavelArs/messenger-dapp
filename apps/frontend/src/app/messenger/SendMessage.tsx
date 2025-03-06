'use client'

import { memo } from "react";
import { SendMessageForm } from "@/components/SendMessageForm";

interface SendMessageProps {
    onSendSuccess?: (txHash: string) => void;
}

// Memoize the component to prevent unnecessary re-renders
export const SendMessage = memo(function SendMessage({ onSendSuccess }: SendMessageProps) {
    return <SendMessageForm onSendSuccess={onSendSuccess} />;
});