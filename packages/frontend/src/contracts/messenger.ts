export const messenger = {
    address: '0x5E72bB78b06F5124dD876521a8598FE4AcD94b4c',
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "sender",
                    type: "address"
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "receiver",
                    type: "address"
                },
                {
                    indexed: false,
                    internalType: "string",
                    name: "content",
                    type: "string"
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256"
                }
            ],
            name: "MessageSent",
            type: "event"
        },
        {
            inputs: [],
            name: "getAllMessages",
            outputs: [
                {
                    components: [
                        {
                            internalType: "address",
                            name: "sender",
                            type: "address"
                        },
                        {
                            internalType: "address",
                            name: "receiver",
                            type: "address"
                        },
                        {
                            internalType: "string",
                            name: "content",
                            type: "string"
                        },
                        {
                            internalType: "uint256",
                            name: "timestamp",
                            type: "uint256"
                        }
                    ],
                    internalType: "struct Messenger.Message[]",
                    name: "",
                    type: "tuple[]"
                }
            ],
            stateMutability: "view",
            type: "function"
        },
        {
            inputs: [],
            name: "getReceivedMessages",
            outputs: [
                {
                    components: [
                        {
                            internalType: "address",
                            name: "sender",
                            type: "address"
                        },
                        {
                            internalType: "address",
                            name: "receiver",
                            type: "address"
                        },
                        {
                            internalType: "string",
                            name: "content",
                            type: "string"
                        },
                        {
                            internalType: "uint256",
                            name: "timestamp",
                            type: "uint256"
                        }
                    ],
                    internalType: "struct Messenger.Message[]",
                    name: "",
                    type: "tuple[]"
                }
            ],
            stateMutability: "view",
            type: "function"
        },
        {
            inputs: [],
            name: "getSentMessages",
            outputs: [
                {
                    components: [
                        {
                            internalType: "address",
                            name: "sender",
                            type: "address"
                        },
                        {
                            internalType: "address",
                            name: "receiver",
                            type: "address"
                        },
                        {
                            internalType: "string",
                            name: "content",
                            type: "string"
                        },
                        {
                            internalType: "uint256",
                            name: "timestamp",
                            type: "uint256"
                        }
                    ],
                    internalType: "struct Messenger.Message[]",
                    name: "",
                    type: "tuple[]"
                }
            ],
            stateMutability: "view",
            type: "function"
        },
        {
            inputs: [],
            name: "messageCount",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256"
                }
            ],
            stateMutability: "view",
            type: "function"
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address"
                },
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256"
                }
            ],
            name: "receivedMessages",
            outputs: [
                {
                    internalType: "address",
                    name: "sender",
                    type: "address"
                },
                {
                    internalType: "address",
                    name: "receiver",
                    type: "address"
                },
                {
                    internalType: "string",
                    name: "content",
                    type: "string"
                },
                {
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256"
                }
            ],
            stateMutability: "view",
            type: "function"
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_receiver",
                    type: "address"
                },
                {
                    internalType: "string",
                    name: "_content",
                    type: "string"
                }
            ],
            name: "sendMessage",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address"
                },
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256"
                }
            ],
            name: "sentMessages",
            outputs: [
                {
                    internalType: "address",
                    name: "sender",
                    type: "address"
                },
                {
                    internalType: "address",
                    name: "receiver",
                    type: "address"
                },
                {
                    internalType: "string",
                    name: "content",
                    type: "string"
                },
                {
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256"
                }
            ],
            stateMutability: "view",
            type: "function"
        }
    ],
} as const