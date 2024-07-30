const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

// Polygon (Matic) Mainnet URL
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

// Your wallet's private key
//const privateKey = 'b79f301e8866616a169e9560bff066a1b2658ef77680b377dbcbd753510a4504';
const privateKey = '1b5cb5b41a466ec646ad7805e4a41119a7cc962dd52f88a6fbe38395de78a4f7';
const wallet = new ethers.Wallet(privateKey, provider);

// Addresses
const senderAddress = '0xA63A1e606F193F7F345D468eF53321C00156E246';

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

module.exports = router;
