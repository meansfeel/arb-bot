import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider(
  `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
));
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/70c0a41eb6214990accaef728b8afaf9'));
const contractABI = [...]; // 你的合約 ABI
const contractAddress = "0x..."; // 你的合約地址
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 讀取方法(view/pure)
contract.methods.yourMethod().call()
  .then(result => console.log(result));

// 寫入方法(需要發送交易)
contract.methods.yourMethod().send({
  from: userAddress,
  gas: gasLimit,
  gasPrice: gasPriceInWei
})

app.get('/api/contract/data', authenticateToken, async (req, res) => {
    try {
      const data = await contract.methods.yourMethod().call();
      res.json({ data });
    } catch (error) {
      logger.error('Error fetching contract data', { error: error.message });
      res.status(500).json({ message: 'Error fetching contract data', error: error.message });
    }
  });
  app.post('/api/contract/execute', authenticateToken, async (req, res) => {
    try {
      const { fromAddress, privateKey, methodParams } = req.body;
  
      // 创建交易对象
      const tx = {
        from: fromAddress,
        to: contractAddress,
        gas: 2000000,
        data: contract.methods.yourMethod(...methodParams).encodeABI()
      };
  
      // 签署交易
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  
      // 发送交易
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      res.json({ receipt });
    } catch (error) {
      logger.error('Error executing contract method', { error: error.message });
      res.status(500).json({ message: 'Error executing contract method', error: error.message });
    }
  });