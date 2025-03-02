"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { contractABI } from "@/abi/contractABI";
import styles from "@/styles/Home.module.css";

const contractAddress = "0xdbc75400aeaa2afce700d3ff0c02aba947c3def3";

export default function Messenger() {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [receiver, setReceiver] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        initWeb3();
    }, []);

    const initWeb3 = async () => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const accounts = await web3Instance.eth.getAccounts();
                setWeb3(web3Instance);
                setAccount(accounts[0]);
                const contractInstance = new web3Instance.eth.Contract(
                    contractABI as AbiItem[],
                    contractAddress
                );
                setContract(contractInstance);
                await loadMessages(contractInstance, accounts[0]);
            } catch (error) {
                console.error("Web3 initialization error:", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const loadMessages = async (contractInstance: any, userAccount: string) => {
        try {
            const msgList = await contractInstance.methods.getMessages().call({ from: userAccount });
            setMessages(msgList);
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    };

    const sendMessage = async () => {
        if (!contract || !receiver || !message) return;
        try {
            await contract.methods
                .sendMessage(receiver, message)
                .send({ from: account })
                .on("receipt", () => {
                    setMessage("");
                    loadMessages(contract, account!);
                });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className={styles.messenger}>
            {!account ? (
                <p>Connecting to Web3...</p>
            ) : (
                <>
                    <div className={styles.inputSection}>
                        <input
                            type="text"
                            placeholder="Receiver Address"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Type your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={styles.input}
                        />
                        <button onClick={sendMessage} className={styles.button}>Send</button>
                    </div>
                    <button onClick={() => loadMessages(contract, account!)} className={styles.refresh}>
                        Refresh Messages
                    </button>
                    <div className={styles.messages}>
                        {messages.map((msg, index) => (
                            <div key={index} className={styles.message}>
                                <p><strong>From:</strong> {msg.sender}</p>
                                <p><strong>To:</strong> {msg.receiver}</p>
                                <p>{msg.content}</p>
                                <p className={styles.timestamp}>
                                    {new Date(Number(msg.timestamp) * 1000).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
