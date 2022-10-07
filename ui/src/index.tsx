import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RecoilRoot,
} from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';
import Web3Provider from './provider/Web3Provider';
import NFTBlendAPIProvider from './provider/NFTBlendAPIProvider';
import Web3ModalProvider from './provider/Web3ModalProvider';
import { SnackbarProvider } from 'notistack';

import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './container/App';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RecoilRoot>
        <Router basename={process.env.PUBLIC_URL}>
          <Web3Provider>
            <NFTBlendAPIProvider>
              <Web3ModalProvider>
                <SnackbarProvider
                  maxSnack={3}
                  autoHideDuration={3500}
                  anchorOrigin={{
                    horizontal: 'left',
                    vertical: 'bottom',
                  }}
                >
                  <App />
                </SnackbarProvider>
              </Web3ModalProvider>
            </NFTBlendAPIProvider>
          </Web3Provider>
        </Router>
      </RecoilRoot>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
