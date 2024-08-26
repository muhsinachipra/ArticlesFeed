// backend\middlewares\authMiddleware.js

import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("token in authMiddleware: ", token)
=======

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
>>>>>>> 7f70ece4e79e89c4cbd316e5ddc5ac15bfa76b62

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
<<<<<<< HEAD
        console.log("Decoded: ", decoded)
        const user = await User.findById(decoded.userId);  // Fetch full user object
        console.log("User: ", user)

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user;  // Attach user to req
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
        console.log('Invalid token')
=======
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
>>>>>>> 7f70ece4e79e89c4cbd316e5ddc5ac15bfa76b62
    }
};

export default authMiddleware;
<<<<<<< HEAD

=======
>>>>>>> 7f70ece4e79e89c4cbd316e5ddc5ac15bfa76b62
