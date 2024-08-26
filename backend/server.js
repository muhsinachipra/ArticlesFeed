// backend\server.js

import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import authRoutes from './routes/authRoutes.js';
<<<<<<< HEAD
import userRoutes from './routes/userRoutes.js';
=======
>>>>>>> 7f70ece4e79e89c4cbd316e5ddc5ac15bfa76b62
import cors from 'cors';

config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
<<<<<<< HEAD
app.use('/user', userRoutes);
=======
>>>>>>> 7f70ece4e79e89c4cbd316e5ddc5ac15bfa76b62

// Sample route
app.get('/', (req, res) => {
    res.send('Article Feeds API');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
