const express = require('express');
const { ethers } = require('ethers');
const axios = require('axios');
const mysql = require('mysql2/promise');
const router = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'battle-of-eternals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Polygon (Matic) Mainnet URL
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

// Your wallet's private key
//const privateKey = 'b79f301e8866616a169e9560bff066a1b2658ef77680b377dbcbd753510a4504';
const privateKey = '1b5cb5b41a466ec646ad7805e4a41119a7cc962dd52f88a6fbe38395de78a4f7';
const wallet = new ethers.Wallet(privateKey, provider);
const ETHERSCAN_API_KEY = '91U41DHI52UNTS6AF683X5T1KA5PEJU9ZQ';

// Addresses
const senderAddress = '0xA63A1e606F193F7F345D468eF53321C00156E246';
// const senderAddress = '0x348B3Bc4D25FbfEdD46647b433920F3f5AE61d9d';

// Middleware to parse JSON requests
router.use(express.json());

router.post('/send-transaction', async (req, res) => {
    const { recipientAddress } = req.body;
    try {
        // Check balance
        const balance = await provider.getBalance(senderAddress);
        console.log(`Balance of sender address: ${ethers.formatEther(balance)} MATIC`);

        if (ethers.formatEther(balance) > 0.1) {  // Ensure balance is sufficient for sending 0.1 MATIC
            // Get the current nonce
            const nonce = await provider.getTransactionCount(senderAddress, 'latest');

            // Build the transaction
            const tx = {
                to: recipientAddress,
                value: ethers.parseEther("0.1"),  // Send 0.1 MATIC
                gasLimit: 21000,  // Standard gas limit for a simple transfer
                gasPrice: ethers.parseUnits('50', 'gwei'),  // Adjust gas price as needed
                nonce: nonce,
                chainId: 137  // Polygon (Matic) Mainnet chain ID
            };

            // Sign and send the transaction
            const txResponse = await wallet.sendTransaction(tx);
            console.log("Transaction sent. Transaction hash:", txResponse.hash);

            // Wait for the transaction to be mined
            const receipt = await txResponse.wait();
            console.log("Transaction mined:", receipt);

            res.json({ success: true, txHash: txResponse.hash, receipt });
        } else {
            console.log("Insufficient funds in sender's address");
            res.json({ success: false, message: "Insufficient funds" });
        }
    } catch (error) {
        console.error("Transaction failed:", error);
        res.json({ success: false, error: error.message });
    }
});

router.post('/getBalance', async (req, res) => {
    const { senderAddress } = req.body;
    try {
        // Check balance
        const balance = await provider.getBalance(senderAddress);
        const formattedBalance = ethers.formatEther(balance);
        console.log(`Balance of sender address: ${formattedBalance} MATIC`);
        res.json({ balance: `${formattedBalance} MATIC` });
    } catch (error) {
        console.error("getBalance failed:", error);
        res.json({ success: false, error: error.message });
    }
});

router.post('/checkTransition', async (req, res) => {
    const { address, targetWallet } = req.body;

    try {
        // Fetch the last 5 transactions using Etherscan API
        const etherscanUrl = `https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

        const response = await axios.get(etherscanUrl);

        if (response.data.status !== '1' || !response.data.result) {
            return res.json({ success: false, message: "Unable to fetch transactions" });
        }

        const transactions = response.data.result;
        const lastFiveTransactions = transactions.slice(0, 5);

        // Check for matching transactions
        for (const tx of lastFiveTransactions) {
            const hash = tx.hash;

            // Check if the hash exists in the database
            const [rows] = await pool.query('SELECT hash FROM transactions WHERE hash = ?', [hash]);

            if (rows.length > 0) {
                // Hash already exists in the database
                continue;
            }

            // Hash does not exist, determine the contract and insert it
            const value = ethers.formatEther(tx.value);
            const contract = determineContract(value);

            await pool.query('INSERT INTO transactions (hash, contract) VALUES (?, ?)', [hash, contract]);

            res.json({ success: true, message: "New transaction recorded", hash, contract });
            return;
        }

        res.json({ success: false, message: "No new matching transactions found" });
    } catch (error) {
        console.error("checkTransition failed:", error);
        res.json({ success: false, error: error.message });
    }
});

function determineContract(value) {
    // Implement your logic to determine the contract based on the value
    // For example:
    if (parseFloat(value) > 1) {
        return 'HighValueContract';
    } else {
        return 'LowValueContract';
    }
}

module.exports = router;
