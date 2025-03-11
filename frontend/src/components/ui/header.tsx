import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "@/components/messenger/styles/messenger.module.css";

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.connectButton}>
                <ConnectButton />
            </div>
        </header>
    );
}
