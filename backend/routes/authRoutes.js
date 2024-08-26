// backend\routes\authRoutes.js

import express from 'express';
import User from '../models/User.js';  // Adjust the path as needed
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';  // 'jwt' is declared but its value is never read.ts(6133)

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    try {
        console.log('req.body:', req.body);
        const { firstName, lastName, phone, email, dob, password, preferences } = req.body;

        // Check if all required fields are present
        if (!firstName || !lastName || !phone || !email || !dob || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            phone,
            email,
            dob,
            password: hashedPassword,
            preferences
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
<<<<<<< HEAD
    console.log("req.body:",req.body)
    console.log("email: ", email, "password: ", password)
=======

>>>>>>> 7f70ece4e79e89c4cbd316e5ddc5ac15bfa76b62
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
});

export default router;
