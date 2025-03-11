export interface Message {
    sender: string;
    receiver: string;
    content: string;
    timestamp: bigint;
}

export interface Contact {
    address: string;
}
