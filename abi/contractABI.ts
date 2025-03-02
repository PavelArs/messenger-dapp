import { AbiItem } from "web3-utils";

export const contractABI: AbiItem[] = [
    {
        "inputs": [
            {"name": "_receiver", "type": "address"},
            {"name": "_content", "type": "string"}
        ],
        "name": "sendMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMessages",
        "outputs": [
            {
                "components": [
                    {"name": "sender", "type": "address"},
                    {"name": "receiver", "type": "address"},
                    {"name": "content", "type": "string"},
                    {"name": "timestamp", "type": "uint256"}
                ],
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];