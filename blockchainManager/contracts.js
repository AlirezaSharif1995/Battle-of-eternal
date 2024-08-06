const express = require('express');
const mysql = require('mysql2/promise');
const { messages } = require('../Message');
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

router.post('/manageContracts', async (req, res) => {
    const { type, contractName, value } = req.body;

    try {
        // Parse value as JSON
        let parsedValue;
        try {
            parsedValue = JSON.stringify(value); // Ensure value is a JSON string
        } catch (error) {
            return res.status(400).json({ error: 'Invalid JSON format for value' });
        }

        // Check if the contract exists
        const [contract] = await pool.query('SELECT * FROM contracts WHERE contractName = ?', [contractName]);

        if (type === "add") {
            if (contract.length === 0) {
                // Add the contract if it does not exist
                await pool.query('INSERT INTO contracts (contractName, value) VALUES (?, ?)', [contractName, parsedValue]);
                res.status(201).json({ message: 'Contract saved successfully' });
            } else {
                // Contract already exists
                res.status(409).json({ error: 'Contract already exists' });
            }
        } else if (type === "edit") {
            if (contract.length > 0) {
                // Edit the contract if it exists
                await pool.query('UPDATE contracts SET value = ? WHERE contractName = ?', [parsedValue, contractName]);
                res.status(200).json({ message: 'Contract updated successfully' });
            } else {
                // Contract does not exist
                res.status(404).json({ error: 'Contract not found' });
            }
        } else if (type === "delete") {
            if (contract.length > 0) {
                // Delete the contract if it exists
                await pool.query('DELETE FROM contracts WHERE contractName = ?', [contractName]);
                res.status(200).json({ message: 'Contract deleted successfully' });
            } else {
                // Contract does not exist
                res.status(404).json({ error: 'Contract not found' });
            }
        } else {
            // Invalid type
            res.status(400).json({ error: 'Invalid type specified' });
        }
    } catch (error) {
        console.error("Manage contracts error:", error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/gems', (req, res) => {

    const { contract, playerToken } = req.body;

    try {


    } catch (error) {
        console.error("Add gems error:", err);
        res.status(500).json({ error: 'Database error' });
    }

});

module.exports = router;