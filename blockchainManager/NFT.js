const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

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

router.post('./createResource', async(req,res)=>{

});

router.post('./useResource', async (req,res)=>{

});

module.exports = router;
