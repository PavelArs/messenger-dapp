import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { messenger } from "@/contracts/messenger";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface SendMessageFormProps {
  onSendSuccess?: (txHash: string) => void;
}

export function SendMessageForm({ onSendSuccess }: SendMessageFormProps) {
  const [targetAddress, setTargetAddress] = useState("");
  const [message, setMessage] = useState("");
  const { address } = useAccount();

  const [errors, setErrors] = useState({
    address: "",
    message: "",
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const hashLoggedRef = useRef<string | null>(null);
  useEffect(() => {
    if (hash && onSendSuccess && hashLoggedRef.current !== hash) {
      hashLoggedRef.current = hash;
      onSendSuccess(hash);
    }
  }, [hash, onSendSuccess]);

  // Reset form on success
  const successLoggedRef = useRef(false);
  useEffect(() => {
    if (isSuccess && !successLoggedRef.current) {
      successLoggedRef.current = true;

      setTargetAddress("");
      setMessage("");
      setErrors({ address: "", message: "" });

      setTimeout(() => {
        successLoggedRef.current = false;
      }, 1000);
    }
  }, [isSuccess]);

  const sendingRef = useRef(false);

  const validateForm = useCallback(() => {
    let valid = true;
    const newErrors = { address: "", message: "" };

    if (!targetAddress) {
      newErrors.address = "Target address is required";
      valid = false;
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(targetAddress)) {
      newErrors.address = "Invalid Ethereum address format";
      valid = false;
    }

    if (!message) {
      newErrors.message = "Message content is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }, [targetAddress, message]);

  const handleSendMessage = useCallback(() => {
    if (sendingRef.current) return;

    if (!validateForm()) {
      return;
    }

    sendingRef.current = true;

    writeContract({
      ...messenger,
      functionName: "sendMessage",
      args: [targetAddress, message],
    });

    setTimeout(() => {
      sendingRef.current = false;
    }, 1000);
  }, [targetAddress, message, writeContract, validateForm]);

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTargetAddress(e.target.value);
      if (errors.address) {
        setErrors((prev) => ({ ...prev, address: "" }));
      }
    },
    [errors.address],
  );

  const handleMessageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
      if (errors.message) {
        setErrors((prev) => ({ ...prev, message: "" }));
      }
    },
    [errors.message],
  );

  return (
    <Card className="bg-white">
      <CardHeader>
        <h3 className="text-xl font-semibold">Send New Message</h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          label="Target Address"
          placeholder="0x..."
          value={targetAddress}
          onChange={handleAddressChange}
          error={errors.address}
        />

        <Input
          label="Message"
          placeholder="Enter your message"
          value={message}
          onChange={handleMessageChange}
          error={errors.message}
        />
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full gap-2">
          <Button
            onClick={handleSendMessage}
            disabled={isPending || isConfirming}
            className="flex-1"
          >
            {isPending
              ? "Confirming..."
              : isConfirming
                ? "Sending..."
                : "Send Message"}
          </Button>
        </div>

        {hash && (
          <div className="text-text-light text-sm">
            Transaction Hash: {hash}
          </div>
        )}
        {isConfirming && (
          <div className="text-primary text-sm">
            Waiting for confirmation...
          </div>
        )}
        {isSuccess && (
          <div className="text-sm text-green-600">
            Message sent successfully!
          </div>
        )}
        {error && (
          <div className="text-sm text-red-500">Error: {error.message}</div>
        )}
      </CardFooter>
    </Card>
  );
}
