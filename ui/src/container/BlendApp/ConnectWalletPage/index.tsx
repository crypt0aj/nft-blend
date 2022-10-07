import ConnectWalletButton from '../../ConnectWalletButton';
import styles from './index.module.css';

export default function ConnectWalletPage() {
  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.Title}>Friends with Blends</div>
        <div className={styles.Description}>Connect Your Wallet to Blend</div>
        <div className={styles.Caption}>Minted support Metamask and Crypto.com DeFi Wallet.</div>
        <ConnectWalletButton className={styles.ConnectWalletButton}>Connect Wallet</ConnectWalletButton>
      </div>
    </div>
  )
}