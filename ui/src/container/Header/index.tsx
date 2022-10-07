import AddressPopoverButton from './AddressPopoverButton';
import IconMenuItem from './IconMenuItem';
import styles from './index.module.css';
import ConnectWalletButton from '../ConnectWalletButton';
import { useRecoilValue } from 'recoil';
import connectedWalletAtom from '../../recoil/connectedWallet/atom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const connectedWallet = useRecoilValue(connectedWalletAtom)

  const handleClickBlend = useCallback(() => {
    navigate('/blend');
  }, [navigate]);

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <div className={styles.Content}>
          <button className={styles.LogoContainer}>
            <svg className={styles.Logo} width="1em" height="1em" viewBox="0 0 111 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
              <path d="M21.727 24h4.354V10.91h4.355V24h4.355V10.91h4.356V24H43.5V6.548H21.727V24ZM50.034 6.547H45.68V24h4.354V6.547ZM50.034 0H45.68v4.363h4.354V0ZM52.21 24h4.356V10.91h4.354V24h4.355V6.548H52.21V24ZM76.162 0H71.81v6.546h-4.356v4.364h4.356V24h4.353V10.91h4.357V6.546h-4.357V0ZM82.695 24H95.76v-4.363H87.05v-2.18h8.71V6.546H82.694V24Zm4.355-13.09h4.355v2.181H87.05v-2.18ZM106.647 0v6.546h-8.71V24h13.064V0h-4.354Zm0 19.637h-4.355V10.91h4.355v8.727ZM10.855 6.547H6.5v6.546h4.355V6.547Z" fill="currentColor"></path>
              <path d="M13.013 19.637H0v4.364h17.357v-3.294h.01V6.547h-4.354v13.09ZM4.362 6.547H.008v6.546h4.354V6.547Z" fill="currentColor"></path>
            </svg>
            <svg className={styles.BetaIcon} width="1em" height="1em" viewBox="0 0 91 29" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
              <path d="M.563.592V28.25l89.814-.033V.56L.563.592Z" fill="#FF3F38"></path>
              <path d="M13.6 4.532v20.436h6.92c1.792 0 3.676-.307 5.22-1.655 1.422-1.256 1.762-2.941 1.762-4.136 0-1.072-.247-2.666-1.483-3.83-.525-.49-1.329-1.072-2.688-1.287.556-.306 2.317-1.379 2.317-4.013 0-1.716-.71-3.31-1.915-4.228-1.668-1.287-3.893-1.287-5.036-1.287H13.6Zm4.016 3.247h1.174c1.637 0 3.09.705 3.09 2.574 0 2.604-2.503 2.665-3.12 2.665h-1.144V7.78Zm0 8.303H19.1c.865 0 1.884 0 2.75.399 1.297.582 1.513 1.685 1.513 2.328 0 .797-.278 1.777-1.266 2.36-.896.52-2.009.55-2.75.55h-1.73v-5.637ZM42.648 4.532h-11.43v20.436h11.43v-3.432h-7.414V15.96h7.106v-3.432h-7.106V7.963h7.414V4.532ZM58.329 7.963V4.532H45.045v3.431h4.634v17.005h4.016V7.963h4.634ZM73.692 24.968h4.325L69.398 4.532h-3.15L57.38 24.968h4.356l1.822-4.29h8.31l1.823 4.29Zm-8.866-7.538 2.935-7.353 2.935 7.353h-5.87Z" fill="currentColor"></path>
            </svg>
          </button>

          <div className={styles.SeparatingSpace}></div>

          <div className={styles.Menu}>
            <button className={styles.MenuItem} onClick={() => navigate('/collections')}>Collections</button>
            <button className={styles.MenuItem} onClick={() => navigate('/featured')}>Featured</button>
            <button className={
              location.pathname === '/blend' ?
                [styles.MenuItem, styles.MenuItemActive].join(' ') :
                styles.MenuItem
            } onClick={handleClickBlend}>
              <IconMenuItem icon={
                // <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" className={styles.BlendIcon}>
                //   <g filter="url(#star-rewards_svg__a)"><path fillRule="evenodd" clipRule="evenodd" d="m14.504 1.313 2.985 6.048 4.89.71-.187 1.3L17.3 8.66l-.683-.1-.305-.618-1.808-3.664-1.808 3.664-.306.619-.683.099-4.043.587L10.59 12.1l.494.481-.117.68-.69 4.027 2.914-1.532v1.483l-4.658 2.448 1.14-6.647-4.83-4.709 6.675-.97 2.986-6.048Zm9.187 10.5h-7.875v1.312h7.875v-1.313Zm-7.875 2.624h7.875v1.313h-7.875v-1.313Zm0 2.626h5.25v1.312h-5.25v-1.313Z" fill="currentColor"></path></g>
                //   <defs><filter id="star-rewards_svg__a" x="0" y="0" width="29" height="29" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_5061_55621"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_5061_55621" result="shape"></feBlend></filter></defs>
                // </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={styles.BlendIcon}><g fill="none" fillRule="evenodd" fillOpacity="0"><path stroke="#565964" d="M.5.5h6v6h-6z" /><path stroke="#FF3F38" opacity=".85" d="M8.5.5h6v6h-6zM.5 8.5h6v6h-6z" /><path stroke="#565964" d="M8.5 8.5h6v6h-6z" /></g></svg>
              }>Blend</IconMenuItem>
            </button>
            <button className={styles.MenuItem} onClick={() => navigate('/rewards')}>
              <IconMenuItem icon={
                <svg width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" className={styles.BlendIcon}>
                  <g filter="url(#star-rewards_svg__a)"><path fillRule="evenodd" clipRule="evenodd" d="m14.504 1.313 2.985 6.048 4.89.71-.187 1.3L17.3 8.66l-.683-.1-.305-.618-1.808-3.664-1.808 3.664-.306.619-.683.099-4.043.587L10.59 12.1l.494.481-.117.68-.69 4.027 2.914-1.532v1.483l-4.658 2.448 1.14-6.647-4.83-4.709 6.675-.97 2.986-6.048Zm9.187 10.5h-7.875v1.312h7.875v-1.313Zm-7.875 2.624h7.875v1.313h-7.875v-1.313Zm0 2.626h5.25v1.312h-5.25v-1.313Z" fill="currentColor"></path></g>
                  <defs><filter id="star-rewards_svg__a" x="0" y="0" width="29" height="29" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="4"></feOffset><feGaussianBlur stdDeviation="2"></feGaussianBlur><feComposite in2="hardAlpha" operator="out"></feComposite><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_5061_55621"></feBlend><feBlend in="SourceGraphic" in2="effect1_dropShadow_5061_55621" result="shape"></feBlend></filter></defs>
                </svg>
              }>Rewards</IconMenuItem>
            </button>
          </div>

          <div className={styles.MenuExtension}>
            {
              connectedWallet === null ?
                <ConnectWalletButton className={styles.ConnectWalletButton}>Connect</ConnectWalletButton> :
                <AddressPopoverButton className={styles.AddressButton} address={connectedWallet.address} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
