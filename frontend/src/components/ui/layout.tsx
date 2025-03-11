import { ReactNode } from "react";
import styles from "@/components/messenger/styles/messenger.module.css";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return <div className={styles.container}>{children}</div>;
}
