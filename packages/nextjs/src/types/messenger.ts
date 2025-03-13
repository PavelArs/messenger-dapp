export interface Message {
  sender: `0x${string}`;
  receiver: `0x${string}`;
  content: string;
  timestamp: bigint;
}

export interface Contact {
  address: `0x${string}`;
}
