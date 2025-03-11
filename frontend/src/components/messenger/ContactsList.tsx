"use client";

import styles from "./styles/messenger.module.css";
import { Contact } from "@/types/messenger";

type ContactsListProps = {
    contacts: Contact[];
    selectedContact: string | null;
    onSelectContact: (address: string) => void;
};

export function ContactsList({ contacts, selectedContact, onSelectContact }: ContactsListProps) {
    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const getAvatarLetter = (address: string) => {
        return address.substring(2, 3).toUpperCase();
    };

    return (
        <section className={styles.contactsSection}>
            <h2 className={styles.sectionTitle}>Contacts</h2>
            <div className={styles.contactsList}>
                {contacts.length > 0 ? (
                    contacts.map((contact) => (
                        <div
                            key={contact.address}
                            className={`${styles.contactCard} ${
                                selectedContact === contact.address ? styles.active : ""
                            }`}
                            onClick={() => onSelectContact(contact.address)}
                        >
                            <div className={styles.contactAvatar}>
                                {getAvatarLetter(contact.address)}
                            </div>
                            <div>
                                <div>{formatAddress(contact.address)}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.noContacts}>No contacts yet</p>
                )}
            </div>
        </section>
    );
}
