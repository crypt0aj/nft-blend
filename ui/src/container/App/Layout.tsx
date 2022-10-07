import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';

export default function Layout() {
  return (
    <React.Fragment>
      <Header />
      <Outlet />
      <div style={{ height: '72px' }} />
      <Footer />
    </React.Fragment>
  );
}
