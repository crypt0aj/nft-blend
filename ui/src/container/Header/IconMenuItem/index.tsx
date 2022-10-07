import React, { ReactNode } from 'react';
import styles from './index.module.css';

export default function IconMenuItem(props: Props) {
  return (
    <div className={styles.Container}>
      {props.icon}
      <span className={styles.Text}>{props.children}</span>
    </div>
  );
}

export type Props = {
  icon: ReactNode,
  children: React.ReactNode,
}
