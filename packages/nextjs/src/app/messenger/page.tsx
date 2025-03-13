"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "@/components/messenger/styles/messenger.module.css";
import { Header, Layout } from "@/components/ui";
import {
  ChatWindow,
  ContactsList,
  EmptyState,
  MessageForm,
} from "@/components/messenger";
import { useMessenger } from "@/hooks/use-messenger";

export default function MessengerPage() {
  const { address, isConnected } = useAccount();
  const {
    receiverAddress,
    setReceiverAddress,
    selectedContact,
    setSelectedContact,
    contacts,
    dialogMessages,
    handleSendMessage,
    handleQuickReply,
  } = useMessenger(address);

  const handleContactSelect = (contactAddress: `0x${string}`) => {
    setSelectedContact(contactAddress);
    setReceiverAddress(contactAddress);
  };

  if (!isConnected) {
    return (
      <Layout>
        <Header title="Decentralized Messenger" />
        <div className={styles.connectPrompt}>
          <p>Connect your wallet to send and receive messages.</p>
          <ConnectButton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Decentralized Messenger" />
      <main className={styles.main}>
        <MessageForm
          receiverAddress={receiverAddress as `0x${string}`}
          onReceiverAddressChange={setReceiverAddress}
          onSendMessage={handleSendMessage}
        />

        <div
          className={`${styles.layout} ${contacts.length > 0 ? styles.twoColumnLayout : ""}`}
        >
          {contacts.length > 0 && (
            <div className={styles.sidebarColumn}>
              <ContactsList
                contacts={contacts}
                selectedContact={selectedContact as `0x${string}`}
                onSelectContact={handleContactSelect}
              />
            </div>
          )}

          <div className={styles.mainColumn}>
            {selectedContact ? (
              <ChatWindow
                currentUserAddress={address || ""}
                selectedContact={selectedContact}
                messages={dialogMessages}
                onSendReply={handleQuickReply}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
