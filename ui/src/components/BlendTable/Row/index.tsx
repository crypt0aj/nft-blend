import { useCallback } from 'react';
import { BlendRecord } from '../../../apptypes.d/blend';
import AddressLabel from '../../AddressLabel';
import styles from './index.module.css';

export default function BlendTableRow(props: Props) {
  const { onClick, record } = props;
  const handleClick = useCallback(() => {
    if (!onClick) {
      return
    }
    onClick(record);
  }, [onClick, record]);

  return (
    <tr className={styles.Row} onClick={handleClick} style={{ cursor: !!onClick ? 'pointer' : 'default' }}>
      <td className={[styles.Cell, styles.CellBlend].join(' ')}>{props.index}</td>
      <td className={[styles.Cell, styles.CellImage].join(' ')}>
        <img className={styles.Image} src={record.imageURI} alt={`Blend of ${record.addressA} and ${record.addressB}`} />
      </td>
      <td className={styles.Cell}>
        <div className={styles.Wallets}>
          <AddressLabel headingCharacter={8} trailingCharacter={10}>{record.addressA}</AddressLabel>
          <span className={styles.WalletsSlashText}> / </span>
          <AddressLabel headingCharacter={8} trailingCharacter={10}>{record.addressB}</AddressLabel>
        </div>
      </td>
      <td className={[styles.Cell, styles.CellScore].join(' ')}>{record.score}%</td>
    </tr>
  )
}

export type Props = {
  index: number,
  record: BlendRecord,
  onClick?: (record: BlendRecord) => void
};