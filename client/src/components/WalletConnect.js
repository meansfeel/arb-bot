import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const WalletConnect = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    }
  }, []);

  const connectWallet = async () => {
    if (web3) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (error) {
        console.error('连接钱包失败', error);
      }
    }
  };

  return (
    <div>
      {account ? (
        <p>已连接钱包: {account}</p>
      ) : (
        <button onClick={connectWallet}>连接钱包</button>
      )}
    </div>
  );
};

export default WalletConnect;
