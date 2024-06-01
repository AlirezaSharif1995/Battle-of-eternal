const express = require('express');
const { default: Web3 } = require('web3');
const router = express.Router();
require('dotenv').config();

// Infura URL for Sepolia testnet
const url = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;

const web3 = new Web3(url);

const senderAddress = process.env.TESTNET_SENDER_ADDRESS;
const recipientAddress = process.env.TESTNET_RECIPIENT_ADDRESS;

// Private key of the sender account
const privateKey = process.env.TESTNET_PRIVATE_KEY;

// Endpoint to send a transaction
router.post('/', async (req, res) => {
    try {
        // Ensure connection to Ethereum network
        const accounts = await web3.eth.getAccounts();
        console.log("Connected to Ethereum network");

        // Get the nonce
        const nonce = await web3.eth.getTransactionCount(senderAddress, 'latest');

        // Construct the transaction object
        const transaction = {
            to: recipientAddress,
            value: web3.utils.toWei('0.01', 'ether'), // Amount to send in Ether
            gas: 21000,  // Gas limit
            gasPrice: web3.utils.toWei('10', 'gwei'),  // Gas price in Gwei
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

// Endpoint to get the balance of an address
router.post('/getBalance', async (req, res) => {
    try {
        const address = req.body.address || senderAddress;

        // Validate the address format
        if (!web3.utils.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid address format' });
        }

        // Get the balance of the address
        const balance = await web3.eth.getBalance(address);

        // Convert the balance from Wei to Ether
        const balanceInEther = web3.utils.fromWei(balance, 'ether');

        res.status(200).json({ balance: balanceInEther });
    } catch (error) {
        console.error("Failed to get balance:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Endpoint for test transactions
router.post('/test', async (req, res) => {
    try {
        // Ensure connection to Ethereum network
        const accounts = await web3.eth.getAccounts();
        console.log("Connected to Ethereum network");

        // Get the nonce
        const nonce = await web3.eth.getTransactionCount(senderAddress, 'latest');

        // Construct the transaction object
        const transaction = {
            to: recipientAddress,
            value: web3.utils.toWei('0.01', 'ether'), // Send 0.01 ETH
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
