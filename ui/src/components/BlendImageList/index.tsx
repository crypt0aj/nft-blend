import { BlendRecord } from "../../apptypes.d/blend"
import { BlendImageListItem } from "./Item";
import styles from './index.module.css';

export default function BlendImageList(props: Props) {
  const highestScore = props.records.reduce((current, record) => {
    if (record.score > current) {
      current = record.score;
    }
    return current;
  }, 0);

  return (
    <div className={styles.Container}>
      {
        props.records.map(record => (
          <BlendImageListItem
            key={record.tokenID}
            record={record}
            isPerfectBlend={record.score === highestScore}
            onClick={props.onRecordClick}
          />
        ))
      }
    </div>
  )
}

export type Props = {
  records: BlendRecord[],
  onRecordClick?: (record: BlendRecord) => void,
};
