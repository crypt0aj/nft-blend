import makeBlockie from 'ethereum-blockies-base64';
import styles from './index.module.css';

export default function AddressIcon(props: Props) {
    return (
        <div className={styles.Container}>
            <div className={styles.Icon} style={{backgroundImage: `url("${makeBlockie(props.address)}")`}} />
        </div>
    );
}

export type Props = {
    address: string;
};
