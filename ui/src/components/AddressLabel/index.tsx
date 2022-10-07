import React, { useCallback, useState } from 'react';
import { Popover } from 'react-tiny-popover';
import styles from './index.module.css';

export default function AddressLabel(props: Props) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleClick = useCallback(() => {
        if (!props.clickToCopy) {
            return
        }
        const input = document.createElement("textarea");
        input.value = props.children
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();

        setIsPopoverOpen(true);
        setTimeout(() => {
            setIsPopoverOpen(false);
        }, 2000);
    }, [props.children, props.clickToCopy, setIsPopoverOpen])

    return (
        <Popover
            isOpen={isPopoverOpen}
            positions={['top', 'bottom', 'right', 'left']}
            align='center'
            padding={5}
            containerStyle={{ zIndex: '9999' }}
            content={<div className={styles.CopiedPopoverContainer}>Copied</div>}
        >
            <div
                style={{ cursor: props.clickToCopy ? 'pointer' : 'default' }}
                title={props.children}
                className={props.className ? [styles.Container, props.className].join(' ') : styles.Container}
                onClick={() => handleClick()}
            >
                {
                    props.children.slice(0, props.headingCharacter)
                }{
                    props.headingCharacter + props.trailingCharacter < props.children.length && '...'
                }{
                    props.children.slice(0 - props.trailingCharacter)
                }
            </div>

        </Popover>
    )
}

type Props = {
    children: string;
    className?: string;
    headingCharacter: number;
    trailingCharacter: number;
    clickToCopy?: boolean;
}
