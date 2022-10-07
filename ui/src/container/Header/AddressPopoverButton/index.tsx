import React, { useState } from 'react';
import { Popover } from 'react-tiny-popover';
import AddressIcon from '../AddressIcon';
import AddressLabel from '../../../components/AddressLabel';
import styles from './index.module.css';
import DisconnectWalletButton from '../../DisconnectWalletButton';

export default function AddressPopoverButton(props: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={['bottom']} // preferred positions by priority
      align='end'
      containerStyle={{ zIndex: '9998' }}
      content={<AddressPopover address={props.address} />}
    >
      <button {...props} onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
        <AddressIcon address={props.address} />
        <AddressLabel
          className={styles.AddressLabel}
          headingCharacter={2}
          trailingCharacter={4}
        >{props.address}</AddressLabel>
      </button>
    </Popover>
  )
}

type Props = React.HTMLAttributes<HTMLButtonElement> & {
  address: string,
};

function AddressPopover(props: AddressPopoverProps) {
  return (
    <section className={styles.PopoverContainer}>
      <header className={styles.PopoverHeader}>
        <button className={styles.PopoverHeaderButton}>
          <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" className={styles.PopoverHeaderButtonIcon}><path fillRule="evenodd" clipRule="evenodd" d="M5.139 2.725A8.75 8.75 0 0 1 10 1.25 8.76 8.76 0 0 1 18.75 10 8.75 8.75 0 1 1 5.139 2.725Zm1.111 12.9v.86a7.437 7.437 0 0 0 7.5 0v-.86a1.877 1.877 0 0 0-1.875-1.875h-3.75a1.877 1.877 0 0 0-1.875 1.875Zm7.815-2.224c.584.576.918 1.358.93 2.178a7.5 7.5 0 1 0-9.99 0 3.126 3.126 0 0 1 3.12-3.079h3.75c.82.001 1.607.325 2.19.9ZM8.264 5.527a3.125 3.125 0 1 1 3.472 5.196 3.125 3.125 0 0 1-3.472-5.196Zm.694 4.157a1.875 1.875 0 1 0 2.084-3.118 1.875 1.875 0 0 0-2.084 3.118Z" fill="currentColor"></path></svg>
          <span className={styles.PopoverHeaderButtonText}>My Profile</span>
        </button>
      </header>
      <div className={styles.PopoverBody}>
        <div className={styles.PopoverBodyWalletHeader}>
          <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" className={styles.PopoverHeaderButtonIcon}><path fillRule="evenodd" clipRule="evenodd" d="M2 4h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1h11v1H2V4Zm0 1v8h12v-1.5h-4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h4V5H2Zm12 5.5v-3h-4v3h4Zm-3-2h1v1h-1v-1Z" fill="currentColor"></path></svg>
          <span className={styles.PopoverBodyWalletHeaderText}>Wallet</span>
        </div>
        <div className={styles.PopoverBodyAddress}>
          <AddressLabel
            className={styles.AddressLabel}
            headingCharacter={8}
            trailingCharacter={4}
            clickToCopy={true}
          >{props.address}</AddressLabel>
        </div>
      </div>
      <footer className={styles.PopoverFooter}>
        <DisconnectWalletButton className={styles.PopoverFooterDisconnectButton}>
          <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" className={styles.PopoverFooterDisconnectButtonIcon}><path fillRule="evenodd" clipRule="evenodd" d="M9 15H3a1.001 1.001 0 0 1-1-1V2a1.001 1.001 0 0 1 1-1h6a1.001 1.001 0 0 1 1 1v1.5H9V2H3v12h6v-1.5h1V14a1.001 1.001 0 0 1-1 1Zm3.086-6.5-1.793 1.793L11 11l3-3-3-3-.707.707L12.086 7.5H5v1h7.086Z" fill="currentColor"></path></svg>
          <span className={styles.PopoverFooterDisconnectButtonText}>Disconnect</span>
        </DisconnectWalletButton>
      </footer>
    </section>
  )
}

type AddressPopoverProps = {
  address: string,
};
