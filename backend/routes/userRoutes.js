// backend\routes\userRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get User Preferences
router.get('/preferences', authMiddleware, async (req, res) => {
    try {
        res.status(200).json({ preferences: req.user.preferences });
    } catch (error) {
        console.error('Failed to fetch preferences:', error);
        res.status(500).json({ error: 'Failed to fetch preferences' });
    }
});

// Update User Preferences
router.put('/preferences', authMiddleware, async (req, res) => {
    try {
        const { preferences } = req.body;
        console.log("Preferences in the backend: ",preferences)

        // Validate preferences
        if (!Array.isArray(preferences)) {
            return res.status(400).json({ error: 'Preferences should be an array' });
        }

        req.user.preferences = preferences;
        await req.user.save();

        res.status(200).json({ preferences: req.user.preferences });
    } catch (error) {
        console.error('Failed to update preferences:', error);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

export default router;
