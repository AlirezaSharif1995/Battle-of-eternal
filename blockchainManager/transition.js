const express = require('express');
const { ethers } = require('ethers');
const axios = require('axios');
const mysql = require('mysql2/promise');
const router = express.Router();

// MySQL pool configuration
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'battle-of-eternals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Polygon (Matic) Mainnet provider
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

// Your wallet's private key and wallet instance
const privateKey = '1b5cb5b41a466ec646ad7805e4a41119a7cc962dd52f88a6fbe38395de78a4f7';
const wallet = new ethers.Wallet(privateKey, provider);

// Etherscan API key
const ETHERSCAN_API_KEY = '91U41DHI52UNTS6AF683X5T1KA5PEJU9ZQ';

// USDT contract address and ABI
const usdtAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f';
const USDT_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// ABI for ERC-20 transfer function
const transferABI = [
    "function transfer(address to, uint256 amount) returns (bool)"
];

const usdtInterface = new ethers.Interface(transferABI);

// Middleware to parse JSON requests
router.use(express.json());

// Route to send USDT transaction
router.post('/send-transactionUSDT', async (req, res) => {
    const { recipientAddress, amount } = req.body;

    try {
        const usdtContract = new ethers.Contract(usdtAddress, USDT_ABI, wallet);

        // Check sender's USDT balance
        const balance = await usdtContract.balanceOf(wallet.address);
        console.log(`Balance of sender address: ${ethers.formatUnits(balance, 6)} USDT`);

        const amountInWei = ethers.parseUnits(amount.toString(), 6);

        // Send USDT transaction
        const txResponse = await usdtContract.transfer(recipientAddress, amountInWei);
        console.log("Transaction sent. Transaction hash:", txResponse.hash);

        const receipt = await txResponse.wait();
        console.log("Transaction mined:", receipt);

        res.json({ success: true, txHash: txResponse.hash, receipt });
    } catch (error) {
        console.error("Transaction failed:", error);
        res.json({ success: false, error: error.message });
    }
});

// Route to send MATIC transaction
router.post('/send-transactionMATIC', async (req, res) => {
    const { recipientAddress, amount } = req.body;

    try {
        const amountInWei = ethers.parseUnits(amount.toString(), "ether");

        // Send MATIC transaction
        const txResponse = await wallet.sendTransaction({
            to: recipientAddress,
            value: amountInWei,
        });

        console.log("Transaction sent. Transaction hash:", txResponse.hash);

        const receipt = await txResponse.wait();
        console.log("Transaction mined:", receipt);

        res.json({ success: true, txHash: txResponse.hash, receipt });
    } catch (error) {
        console.error("Transaction failed:", error);
        res.json({ success: false, error: error.message });
    }
});

// Route to get USDT and MATIC balance
router.post('/getBalance', async (req, res) => {
    const { address } = req.body;

    try {
        const usdtContract = new ethers.Contract(usdtAddress, USDT_ABI, provider);

        // Check USDT balance
        const usdtBalance = await usdtContract.balanceOf(address);
        const formattedUSDTBalance = ethers.formatUnits(usdtBalance, 6);

        // Check MATIC balance
        const maticBalance = await provider.getBalance(address);
        const formattedMATICBalance = ethers.formatEther(maticBalance);

        console.log(`Balance of address: ${formattedUSDTBalance} USDT, ${formattedMATICBalance} MATIC`);

        res.json({
            success: true,
            usdtBalance: `${formattedUSDTBalance} USDT`,
            maticBalance: `${formattedMATICBalance} MATIC`
        });
    } catch (error) {
        console.error("getBalance failed:", error);
        res.json({ success: false, error: error.message });
    }
});

// Route to check recent transactions
router.post('/checkTransitionUSDT', async (req, res) => {
    const { address, playerToken } = req.body;

    try {
        const etherscanUrl = `https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
        const response = await axios.get(etherscanUrl);

        if (response.data.status !== '1' || !response.data.result) {
            return res.json({ success: false, message: "Unable to fetch transactions" });
        }

        const transactions = response.data.result.slice(0, 5);
        const myWalletAdress = "0xEcedFD0c8750c36520B595EF4A247bbD47FcBDcA";

        for (const tx of transactions) {

            if (tx.input.startsWith('0xa9059cbb')) { // Check for ERC-20 transfer method ID
                try {
                    const decoded = usdtInterface.decodeFunctionData('transfer', tx.input);
                    const recipient = decoded.to;
                    const amount = ethers.formatUnits(decoded.amount, 6); // USDT has 6 decimals
                    const hash = tx.hash;

                    console.log('Decoded Transfer Data:', { hash ,recipient, amount });

                    const [rows] = await pool.query('SELECT hash FROM transactions WHERE hash = ?', [tx.hash]);
                    if (rows.length > 0) {
                        continue; // Skip if already recorded
                    }
                    if (recipient != myWalletAdress) {
                        continue; // Skip if already recorded
                    }
                    const contract = await determineContract(amount, playerToken);

                    await pool.query(
                        'INSERT INTO transactions (hash, gemAmount, price) VALUES (?, ?, ?)',
                        [tx.hash, contract.gemAmount, contract.price]
                    );

                    res.json({ success: true, message: "New transaction recorded", hash: tx.hash });
                    return;
                } catch (error) {
                    console.error('Error decoding input data:', error);
                }
            }
        }

        res.json({ success: false, message: "No new matching transactions found" });
    } catch (error) {
        console.error("checkTransition failed:", error);
        res.json({ success: false, error: error.message });
    }
});

// Route to check recent transactions
router.post('/checkTransitionMATIC', async (req, res) => {
    const { address, playerToken } = req.body;

    try {
        const etherscanUrl = `https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
        const response = await axios.get(etherscanUrl);

        if (response.data.status !== '1' || !response.data.result) {
            return res.json({ success: false, message: "Unable to fetch transactions" });
        }

        const transactions = response.data.result.slice(0, 5);
        const myWalletAddress = "0x332E5d04bfF3d26DF3C8f72e4452dd7d98748b14";

        for (const tx of transactions) {
            // Check if the transaction is an outgoing Matic transfer to your address
            if (tx.to.toLowerCase() === myWalletAddress.toLowerCase() && tx.value > 0) {
                try {
                    const amount = ethers.formatUnits(tx.value, 18); // Matic has 18 decimals
                    const hash = tx.hash;

                    console.log('Detected Matic Transfer:', { hash, amount });

                    const [rows] = await pool.query('SELECT hash FROM transactions WHERE hash = ?', [tx.hash]);
                    if (rows.length > 0) {
                        continue; // Skip if already recorded
                    }

                   // const contract = await determineContract(amount, playerToken);

                    //await pool.query(
                    //     'INSERT INTO transactions (hash, gemAmount, price) VALUES (?, ?, ?)',
                    //     [tx.hash, contract.gemAmount, contract.price]
                    // );

                    res.json({ success: true, message: "New Matic transaction recorded", hash: tx.hash, amount });
                    return;
                } catch (error) {
                    console.error('Error processing Matic transfer:', error);
                }
            }
        }

        res.json({ success: false, message: "No new matching Matic transactions found" });
    } catch (error) {
        console.error("checkTransition failed:", error);
        res.json({ success: false, error: error.message });
    }
});

// Determine contract based on value in USDT
async function determineContract(valueInUSDT, playerToken) {
    const priceTiers = [
        { gem: 100, price: 0.99 },
        { gem: 500, price: 4.99 },
        { gem: 1200, price: 9.99 },
        { gem: 2600, price: 19.99 },
        { gem: 7000, price: 49.99 },
        { gem: 15000, price: 99.99 }
    ];

    for (const tier of priceTiers) {
        if (Math.abs(valueInUSDT - tier.price) < 0.001) {  // Tolerance for floating-point precision

            const [userRows] = await pool.query('SELECT Gem FROM users WHERE playerToken = ?', [playerToken]);
            if (userRows.length === 0) {
                return res.json({ success: false, message: "User not found" });
            }

            const currentGems = userRows[0].Gem;
            const newGems = currentGems + tier.gem; // Adjust this logic if needed

            // Insert transaction details including new columns
            await pool.query(
                'UPDATE users SET Gem = ? WHERE playerToken = ?',
                [newGems, playerToken]
            ); return {
                gemAmount: tier.gem,
                price: tier.price
            };
        }
    }

    return {
        contractType: 'UnknownContract',
        gemAmount: 0,
        price: 0
    };
}

module.exports = router;
