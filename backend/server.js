// backend\server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.send('Article Feeds API');
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error(err));
