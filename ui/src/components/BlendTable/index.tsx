import { BlendRecord } from '../../apptypes.d/blend';
import styles from './index.module.css';
import BlendTableRow from './Row';

export default function BlendTable(props: Props) {
  return (
    <div className={styles.Container}>
      <table className={styles.Table}>
        <thead>
          <tr>
            <th className={[styles.TableHeader, styles.TableHeaderBlend].join(' ')}>Blend</th>
            <th className={styles.TableHeader}></th>
            <th className={styles.TableHeader}>Wallets</th>
            <th className={[styles.TableHeader, styles.TableHeaderScore].join(' ')}>Score</th>
          </tr>
        </thead>
        <tbody>
          {props.records.map((record, i) => (
            <BlendTableRow
              key={record.tokenID}
              index={i + 1}
              record={record}
              onClick={props.onRecordClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export type Props = {
  records: BlendRecord[],
  onRecordClick?: (record: BlendRecord) => void,
};