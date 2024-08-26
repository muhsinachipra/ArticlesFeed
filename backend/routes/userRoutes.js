// backend\routes\userRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import Article from '../models/Article.js';

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
        console.log("Preferences in the backend: ", preferences)

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

// Fetch all articles based on categories to display in the home page
router.get('/homeArticles', authMiddleware, async (req, res) => {
    try {
        const { categories } = req.query; // Get categories from query parameters
        const categoriesArray = categories ? categories.split(',') : []; // Convert comma-separated string to array

        // Find articles that match the categories
        const articles = await Article.find({
            categories: { $in: categoriesArray }
        });

        res.status(200).json({ articles });
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});


// Get User's Articles
router.get('/articles', authMiddleware, async (req, res) => {
    try {
        const articles = await Article.find({ author: req.user._id });
        res.status(200).json({ articles });
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// Delete an Article
router.delete('/articles/:id', authMiddleware, async (req, res) => {
    try {
        const articleId = req.params.id;

        // Check if the article exists
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        // Check if the user is authorized to delete the article
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        // Delete the article
        await Article.deleteOne({ _id: articleId });

        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Failed to delete article:', error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
});

// Create a New Article
router.post('/articles', authMiddleware, async (req, res) => {
    try {
        console.log("Inside POST /articles")
        const { title, content, categories } = req.body;
        console.log("Inside POST /articles { title, content, categories }: ",{ title, content, categories })

        // Validation
        if (!title || !content || !categories) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newArticle = new Article({
            title,
            content,
            categories,
            author: req.user._id
        });

        await newArticle.save();
        res.status(201).json({ message: 'Article created successfully', article: newArticle });
    } catch (error) {
        console.error('Failed to create article:', error);
        res.status(500).json({ error: 'Failed to create article' });
    }
});

// Update an Existing Article
router.put('/articles/:id', authMiddleware, async (req, res) => {
    try {
        const articleId = req.params.id;
        const { title, content, categories } = req.body;
        console.log("Inside PUT /articles { title, content, categories, articleId }: ",{ title, content, categories, articleId })

        // Find the article by ID
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        // Check if the logged-in user is the author of the article
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        // Update the article fields
        if (title) article.title = title;
        if (content) article.content = content;
        if (categories) article.categories = categories;

        await article.save();
        res.status(200).json({ message: 'Article updated successfully', article });
    } catch (error) {
        console.error('Failed to update article:', error);
        res.status(500).json({ error: 'Failed to update article' });
    }
});

export default router;
