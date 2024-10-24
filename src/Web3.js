import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function DApp() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => setAccount(accounts[0]))
        .catch(err => console.error('Error connecting to MetaMask', err));
    } else {
      console.error('MetaMask not detected');
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the DApp</h1>
      {account ? <p>Connected account: {account}</p> : <p>Please connect your MetaMask wallet</p>}
    </div>
  );
}

export default DApp;