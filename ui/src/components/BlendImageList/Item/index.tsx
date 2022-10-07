import { useCallback } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import { BlendRecord } from "../../../apptypes.d/blend"
import AddressLabel from "../../AddressLabel";
import styles from './index.module.css';

export function BlendImageListItem(props: Props) {
  const { onClick, record } = props;
  const handleClick = useCallback(() => {
    if (!onClick) {
      return
    }
    onClick(record);
  }, [onClick, record]);

  return (
    <div className={styles.Container}>
      <button
        className={props.isPerfectBlend ? [styles.Container, styles.PerfectBlendContainer].join(' ') : styles.Container}
        style={{ cursor: !!onClick ? 'pointer' : 'default' }}
        onClick={handleClick}
      >
        <div className={props.isPerfectBlend ? [styles.Banner, styles.PerfectBlendBanner].join(' ') : styles.Banner}>
          {props.isPerfectBlend && 'THE PERFECT BLEND'}
        </div>
        <div className={styles.BlendInfo}>
          <div className={styles.ImageContainer}>
            <img className={styles.Image} src={record.imageURI} alt={`Blend of ${record.addressA} and ${record.addressB}`} />
          </div>
          <div className={styles.Description}>
            <div className={[styles.AddressA, styles.Address].join(' ')}>
              <AddressLabel
                className={styles.AddressLabel}
                headingCharacter={6} trailingCharacter={4}
              >
                {record.addressA}
              </AddressLabel>
            </div>
            <div className={styles.MatchScoreContainer}>
              <CircularProgressbarWithChildren
                value={record.score}
                styles={buildStyles({
                  pathColor: props.isPerfectBlend ? '#168ad9' : '#ffffff',
                  trailColor: '#43454E'
                })}
                strokeWidth={5}
              >
                <div className={styles.MatchScoreTextContainer}>
                  <span className={styles.MatchScoreText}>{record.score}</span>
                  <span className={styles.MatchScorePercentageText}>%</span>
                </div>
              </CircularProgressbarWithChildren>
            </div>
            <div className={[styles.AddressB, styles.Address].join(' ')}>
              <AddressLabel
                className={styles.AddressLabel}
                headingCharacter={6} trailingCharacter={4}
              >
                {record.addressB}
              </AddressLabel>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

type Props = {
  record: BlendRecord,
  isPerfectBlend: boolean,
  onClick?: (record: BlendRecord) => void
};
