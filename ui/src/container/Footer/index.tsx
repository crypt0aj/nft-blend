import styles from './index.module.css';

export default function Footer() {
  return (
    <div className={styles.Container}>
      <div className={styles.Footer}>
        This website is designed for hackathon demonstration only. It is not related to the actual Minted Marketplace.
      </div>
    </div>
  )
}
