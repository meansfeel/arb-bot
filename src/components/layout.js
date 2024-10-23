import React from 'react';

function Layout({ children }) {
  return (
    <div className="layout">
      <header>
        <h1>Arbitrage Booster Bot</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2023 Arbitrage Booster Bot. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;