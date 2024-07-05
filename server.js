const express = require('express');
const axios = require('axios');
const { Client } = require('pg');
const app = express();
const port = 3000;

app.use(express.static('public'));

require('dotenv').config();

// PostgreSQL client setup
const client = new Client({
    user: process.env.USERNAME,
    host: 'localhost',
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
});

// Connect to PostgreSQL database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

// Function to update database schema if needed
async function updateDatabaseSchema() {
    try {
        await client.query(`
            ALTER TABLE crypto_data 
            ADD COLUMN IF NOT EXISTS difference DECIMAL,
            ADD COLUMN IF NOT EXISTS savings DECIMAL
        `);
        console.log('Database schema updated successfully.');
    } catch (error) {
        console.error('Error updating database schema:', error);
    }
}

// Function to fetch data from API and store it in the database
async function fetchDataAndStore() {
    try {
        // Ensure schema is updated
        await updateDatabaseSchema(); 

        // Fetch data from the API
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const data = response.data;

        // Get the top 10 cryptocurrencies based on volume
        const top10 = Object.values(data)
            .sort((a, b) => b.last - a.last)
            .slice(0, 10);

        // Create the table if it does not exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS crypto_data (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50),
                last DECIMAL,
                buy DECIMAL,
                sell DECIMAL,
                volume DECIMAL,
                base_unit VARCHAR(10),
                difference DECIMAL,
                savings DECIMAL
            )
        `);

        // Clear previous data
        await client.query('DELETE FROM crypto_data');

        // Insert new data
        for (const item of top10) {
            const difference = ((item.sell - item.buy) / item.buy * 100).toFixed(2);
            const savings = (item.sell - item.buy).toFixed(2);
            await client.query(`
                INSERT INTO crypto_data (name, last, buy, sell, volume, base_unit, difference, savings)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [item.name, item.last, item.buy, item.sell, item.volume, item.base_unit, difference, savings]);
        }

        console.log('Data has been fetched and stored in the database');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Initial data fetch
fetchDataAndStore();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to get data from the database
app.get('/data', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM crypto_data');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
