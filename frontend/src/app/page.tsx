'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const navigateToMessenger = () => {
        router.push('/messenger');
    };

    return (
        <div className="home-container">
            <div className="home-header">
                <h1 className="text-2xl font-bold">Messenger DApp</h1>
            </div>

            <div className="home-content">
                <p className="text-lg">
                    A decentralized messaging application built on Ethereum
                </p>

                <div className="features-list">
                    <h2 className="text-xl font-semibold mb-4">Features:</h2>
                    <ul className="list-disc">
                        <li>Send messages to any Ethereum address</li>
                        <li>View received messages from other users</li>
                        <li>Track your sent messages</li>
                        <li>Secure and decentralized communication</li>
                    </ul>
                </div>

                {isClient && (
                    <button
                        className="messenger-button text-lg"
                        onClick={navigateToMessenger}
                    >
                        Open Messenger App
                    </button>
                )}
            </div>
        </div>
    );
}
