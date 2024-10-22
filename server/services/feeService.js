const Web3 = require('web3');

const ADMIN_WALLET = '0x9d4c41a4b68d6367f2cc75a9263ad9ecf5e658c2';
const FEE_PERCENTAGE = 0.025; // 2.5%

const collectFee = async (amount, userWallet) => {
  const web3 = new Web3(process.env.ETHEREUM_RPC_URL);
  const feeAmount = amount * FEE_PERCENTAGE;

  try {
    const tx = await web3.eth.sendTransaction({
      from: userWallet,
      to: ADMIN_WALLET,
      value: web3.utils.toWei(feeAmount.toString(), 'ether'),
      gas: 21000,
      gasPrice: await web3.eth.getGasPrice()
    });
    console.log('Fee collected:', tx.transactionHash);
    return true;
  } catch (error) {
    console.error('Fee collection failed:', error);
    return false;
  }
};

module.exports = {
  collectFee
};
