const express = require('express');
const { default: Web3 } = require('web3');
const router = express.Router();

const url = "https://mainnet.infura.io/v3/375bba65af974140b99d3ac8ebd1c97e";

const web3 = new Web3(url);

const senderAddress = "0x1Be31A94361a391bBaFB2a4CCd704F57dc04d4bb";
const recipientAddress = "0x1234567890abcdef1234567890abcdef12345678";
const privateKey = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

if (!web3.utils.isAddress(senderAddress)) {
    throw new Error(`Invalid sender address format: ${senderAddress}`);
}
if (!web3.utils.isAddress(recipientAddress)) {
     throw new Error(`Invalid recipient address format: ${recipientAddress}`);
}

router.post('/', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Connected to Ethereum network");
        const nonce = await web3.eth.getTransactionCount(senderAddress, 'latest');

        const transaction = {
            to: recipientAddress,
            value: web3.utils.toWei('0.01', 'ether'),
            gas: 21000,  // Gas limit
            gasPrice: web3.utils.toWei('10', 'gwei'),
            nonce: nonce,
        };

        const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transaction sent. Transaction hash:", receipt.transactionHash);

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

router.post('/getBalance', async (req, res) => {
    try {
        const address = req.body.address || senderAddress;

        if (!web3.utils.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid address format' });
        }

        const balance = await web3.eth.getBalance(address);

        const balanceInEther = web3.utils.fromWei(balance, 'ether');

        res.status(200).json({ balance: balanceInEther });
    } catch (error) {
        console.error("Failed to get balance:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

router.post('/test', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log("Connected to Ethereum network");
        const nonce = await web3.eth.getTransactionCount(senderAddress, 'latest');

        const transaction = {
            to: recipientAddress,
            value: web3.utils.toWei('0.01', 'ether'), 
            gas: 21000,  // Gas limit
            gasPrice: web3.utils.toWei('100', 'gwei'),  
            nonce: nonce,
        };

        const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);

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
