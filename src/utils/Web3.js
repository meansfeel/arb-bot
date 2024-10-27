import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // 使用 MetaMask 提供的 provider
  web3 = new Web3(window.ethereum);
  
  // 請求用戶連接錢包
  window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((error) => {
      console.error('User denied account access:', error);
    });
} else {
  // 使用 Infura 作為後備 provider
  const provider = new Web3.providers.HttpProvider(
    process.env.REACT_APP_WEB3_PROVIDER
  );
  web3 = new Web3(provider);
}

export default web3;
