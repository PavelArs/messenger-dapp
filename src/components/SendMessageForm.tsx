import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
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
  
  // Form validation
  const [errors, setErrors] = useState({
    address: '',
    message: ''
  });

  // Console log for debugging - avoid double logging in StrictMode
  const mountLoggedRef = useRef(false);
  useEffect(() => {
    if (!mountLoggedRef.current) {
      console.log('[SendMessage] Component mounted, connected address:', address);
      mountLoggedRef.current = true;
      
      return () => {
        // Reset on unmount with a small delay
        setTimeout(() => {
          mountLoggedRef.current = false;
        }, 100);
      };
    }
  }, [address]);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  
  // Handle transaction hash effect
  const hashLoggedRef = useRef<string | null>(null);
  useEffect(() => {
    if (hash && onSendSuccess && hashLoggedRef.current !== hash) {
      console.log('[SendMessage] Transaction hash created:', hash);
      hashLoggedRef.current = hash;
      onSendSuccess(hash);
    }
  }, [hash, onSendSuccess]);
  
  // Reset form on success
  const successLoggedRef = useRef(false);
  useEffect(() => {
    if (isSuccess && !successLoggedRef.current) {
      console.log('[SendMessage] Transaction successful, clearing form');
      successLoggedRef.current = true;
      
      // Reset form
      setTargetAddress("");
      setMessage("");
      setErrors({ address: '', message: '' });
      
      // Reset after a delay for future successes
      setTimeout(() => {
        successLoggedRef.current = false;
      }, 1000);
    }
  }, [isSuccess]);

  // Prevent multiple clicks
  const sendingRef = useRef(false);
  
  // Validate form
  const validateForm = useCallback(() => {
    let valid = true;
    const newErrors = { address: '', message: '' };
    
    // Validate address
    if (!targetAddress) {
      newErrors.address = 'Target address is required';
      valid = false;
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(targetAddress)) {
      newErrors.address = 'Invalid Ethereum address format';
      valid = false;
    }
    
    // Validate message
    if (!message) {
      newErrors.message = 'Message content is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  }, [targetAddress, message]);
  
  // Memoized handler for sending messages
  const handleSendMessage = useCallback(() => {
    if (sendingRef.current) return;
    
    if (!validateForm()) {
      return;
    }

    console.log('[SendMessage] Sending message to:', targetAddress);
    sendingRef.current = true;
    
    writeContract({
      ...messenger,
      functionName: "sendMessage",
      args: [targetAddress, message],
    });
    
    // Reset sending ref after a delay
    setTimeout(() => {
      sendingRef.current = false;
    }, 1000);
    
  }, [targetAddress, message, writeContract, validateForm]);

  // Memoized handlers for input changes
  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetAddress(e.target.value);
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: '' }));
    }
  }, [errors.address]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (errors.message) {
      setErrors(prev => ({ ...prev, message: '' }));
    }
  }, [errors.message]);

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
        <div className="flex gap-2 w-full">
          <Button
            onClick={handleSendMessage}
            disabled={isPending || isConfirming}
            className="flex-1"
          >
            {isPending ? "Confirming..." : isConfirming ? "Sending..." : "Send Message"}
          </Button>
        </div>
        
        {hash && <div className="text-sm text-text-light">Transaction Hash: {hash}</div>}
        {isConfirming && <div className="text-sm text-primary">Waiting for confirmation...</div>}
        {isSuccess && <div className="text-sm text-green-600">Message sent successfully!</div>}
        {error && <div className="text-sm text-red-500">Error: {error.message}</div>}
      </CardFooter>
    </Card>
  );
}