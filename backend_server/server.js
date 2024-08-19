const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;
const uri = 'mongodb+srv://developer:upcheck.dev.TxwQ@app.zfm1a.mongodb.net/?retryWrites=true&w=majority&appName=App';
MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        db = client.db('affordmed');
        console.log('Connected to Database');
    })
    .catch(err => console.error(err));

app.get('/api/products', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sortBy } = req.query;

        const query = {
            category: category || { $exists: true },
            price: { $gte: parseFloat(minPrice) || 0, $lte: parseFloat(maxPrice) || Infinity },
        };

        const options = {
            sort: { [sortBy || 'price']: 1 },
        };

        const products = await db.collection('products').find(query, options).toArray();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});