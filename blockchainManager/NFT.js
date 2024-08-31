const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Alireza1995!',
    database: 'battle-of-eternals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
// Assuming you have a provider set up to interact with the blockchain
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

// ABI of the NFT contract (simplified example)
const NFT_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)"
];

// Address of your NFT contract
const NFT_CONTRACT_ADDRESS = '0xYourNFTContractAddressHere';

router.post('/get-nfts', async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
        return res.status(400).json({ success: false, message: 'Wallet address is required' });
    }

    try {
        // Create a contract instance
        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);

        // Get the number of NFTs owned by the wallet address
        const balance = await nftContract.balanceOf(walletAddress);

        const nfts = [];

        // Loop through all NFTs owned by the address and get their token IDs and URIs
        for (let i = 0; i < balance; i++) {
            const tokenId = await nftContract.tokenOfOwnerByIndex(walletAddress, i);
            const tokenURI = await nftContract.tokenURI(tokenId);

            nfts.push({
                tokenId: tokenId.toString(),
                tokenURI: tokenURI
            });
        }

        res.json({ success: true, nfts });
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        res.status(500).json({ success: false, message: 'Error fetching NFTs', error: error.message });
    }
});

router.post('/getResource', async(req,res)=>{
    try {
        const { playerToken } = req.body;
        const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);
        if (existingUser.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        const user = {
            resourceNFT: existingUser[0].resourceNFT
        }
        res.status(200).json(user);
        
    } catch (error) {
        console.error('Error getResource', error);
        res.status(500).json({ success: false, message: 'Error getResource', error: error.message });        
    }

});

router.post('/updateResource', async (req,res)=>{
    try {
        const { playerToken, data } = req.body;
        const [existingUser] = await pool.query('SELECT * FROM users WHERE playerToken = ?', [playerToken]);
    
        if (existingUser.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        await pool.query('UPDATE users SET resourceNFT = ? WHERE playerToken = ?', [[JSON.stringify(data)], playerToken]);
        res.status(200).json({ message: 'resourceNFT updated successfully' });
        
    } catch (error) {
        console.error('Error updateResource', error);
        res.status(500).json({ success: false, message: 'Error updateResource', error: error.message });        
    }
});

module.exports = router;
