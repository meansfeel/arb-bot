import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Arbitrage Booster Bot DApp</h1>
      <nav>
        <ul>
          <li><Link to="/auto-bot">自动交易机器人</Link></li>
          <li><Link to="/simulation-bot">模拟交易机器人</Link></li>
          <li><Link to="/wallet">连接钱包</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
