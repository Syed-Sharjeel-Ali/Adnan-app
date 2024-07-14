const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/inventory');

// Define Product schema and model
const productSchema = new mongoose.Schema({
    name: String,
    price: Number
});
const Product = mongoose.model('Product', productSchema);

app.use(bodyParser.json());

// Endpoint to get all products
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Endpoint to calculate bill
app.post('/calculate-bill', async (req, res) => {
    const { items } = req.body; // items should be an array of { name, quantity }

    let total = 0;
    for (const item of items) {
        const product = await Product.findOne({ name: item.name });
        if (product) {
            total += product.price * item.quantity;
        }
    }

    res.json({ total });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
