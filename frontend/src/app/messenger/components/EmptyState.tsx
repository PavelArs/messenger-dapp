"use client";

import styles from "../messenger.module.css";

type EmptyStateProps = {
    title?: string;
    message?: string;
};

export default function EmptyState({
    title = "Select a Contact",
    message = "Choose a contact from the sidebar to start messaging",
}: EmptyStateProps) {
    return (
        <div className={styles.emptyStateContainer}>
            <div className={styles.emptyState}>
                <h3>{title}</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}
