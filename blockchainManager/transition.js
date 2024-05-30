const express = require('express');
const Web3 = require('web3');
const router = express.Router();

// Infura URL
const url = 'https://mainnet.infura.io/v3/a3db6f10d9eb4400b5b9cd9df548c5d4';

// Connect to the Ethereum network
const web3 = new Web3(url);

// Sender and recipient addresses
const senderAddress = "0x7a49d58C0BE89241Ce56d079f6ca177E0b93A81f";
const recipientAddress = "0x7a49d58C0BE89241Ce56d079f6ca177E0b93A81f";

// Private key of the sender account
const privateKey = "5109b64e0b091dbc58c03a8c43996f825db660d967b8d8a9ad49a386ea6ab43f";

router.post('/sendTransaction', async (req, res) => {
    try {
        // Ensure connection to Ethereum network
        const accounts = await web3.eth.getAccounts();
        console.log("Connected to Ethereum network");

        // Get the nonce
        const nonce = await web3.eth.getTransactionCount(senderAddress, 'latest');

        // Construct the transaction object
        const transaction = {
            to: recipientAddress,
            value: web3.utils.toWei('0.000000000000000015', 'ether'), // Amount to send in Wei
            gas: 21000,  // Gas limit
            gasPrice: web3.utils.toWei('1', 'gwei'),  // Gas price in Gwei
            nonce: nonce,
        };

        // Sign the transaction
        const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transaction sent. Transaction hash:", receipt.transactionHash);

        // Check the transaction status
        const txReceipt = await web3.eth.getTransactionReceipt(receipt.transactionHash);
        if (txReceipt.status) {
            res.status(200).json({ message: 'Transaction successful', transactionHash: receipt.transactionHash });
        } else {
            res.status(200).json({ message: 'Transaction failed', transactionHash: receipt.transactionHash });
        }
    } catch (error) {
        console.error("Transaction failed:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
