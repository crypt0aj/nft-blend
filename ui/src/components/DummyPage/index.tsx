import styles from './index.module.css';

export function DummyPage() {
  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.Title}>Page Not Available</div>
        <div className={styles.Description}>This page is for illustration purpose. Please choose the Blend feature on the menu to enjoy the best out of this demonstration.</div>
      </div>
    </div>
  )
}