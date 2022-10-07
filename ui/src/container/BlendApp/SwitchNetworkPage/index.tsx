import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import styles from './index.module.css';

export default function SwitchNetworkPage() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    enqueueSnackbar('Please switch your wallet network to Cronos Testnet.', {
      variant: 'warning',
      preventDuplicate: true,
    });
  }, []);

  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.Title}>Friends with Blends</div>
        <div className={styles.Description}>Please Switch Your Wallet Network to Cronos Testnet</div>
        <div className={styles.Caption}>Minted currently support Cronos Testnet only.</div>
      </div>
    </div>
  )
}