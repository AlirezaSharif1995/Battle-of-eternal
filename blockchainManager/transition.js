// const { ethers } = require('ethers');
// const express = require('express')
// const router = express.Router();

// const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/');

// // Your wallet's private key
// const privateKey = 'YOUR_PRIVATE_KEY';
// const wallet = new ethers.Wallet(privateKey, provider);

// // Contract ABI and address
// const contractABI = [
//   // Add the contract's ABI here
// ];

// const contractAddress = 'YOUR_CONTRACT_ADDRESS';

// router.post('/', async (req, res) => {
//     try {
//         // Create a contract instance
//         const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
//         // Example: Call a contract function
//         const tx = await contract.yourContractFunctionName(
//           // Add any function arguments here
//         );
    
//         console.log('Transaction sent:', tx.hash);
    
//         // Wait for the transaction to be mined
//         const receipt = await tx.wait();
//         console.log('Transaction mined:', receipt);
//       } catch (error) {
//         console.error('Error:', error);
//       }
// });

// module.exports = router;
