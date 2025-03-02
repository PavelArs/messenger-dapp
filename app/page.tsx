import styles from "@/styles/Home.module.css";
// import { Profile } from "./components/profile";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
    return (
        <div className={styles.main}>
            <h1>Click bellow to connect your wallet with RainbowKit</h1>
            <ConnectButton />
        </div>
    );
}
