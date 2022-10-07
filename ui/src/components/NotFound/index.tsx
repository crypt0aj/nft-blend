import styles from './index.module.css';

export function NotFound() {
  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.Title}>NOT FOUND</div>
        <div className={styles.Description}>The page you are looking for cannot be found or no longe exist.</div>
      </div>
    </div>
  )
}