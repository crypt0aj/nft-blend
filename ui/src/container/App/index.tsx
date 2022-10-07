import Layout from './Layout';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BlendApp from '../BlendApp';
import WalletConnectState from '../WalletConnectState';
import { DummyPage } from '../../components/DummyPage';
import { NotFound } from '../../components/NotFound';

export default function App() {
  return (
    <React.Fragment>
      <WalletConnectState />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<DummyPage />} />
          <Route path="/collections" element={<DummyPage />} />
          <Route path="/featured" element={<DummyPage />} />
          <Route path="/rewards" element={<DummyPage />} />
          <Route path="/blend/*" element={<BlendApp />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
}
