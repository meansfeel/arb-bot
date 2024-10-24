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