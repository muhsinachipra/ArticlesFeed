// backend\controllers\userController.js

import Article from '../models/Article.js';

// Get user preferences
export const getUserPreferences = async (req, res) => {
    try {
        res.status(200).json({ preferences: req.user.preferences });
    } catch (error) {
        console.error('Failed to fetch preferences:', error);
        res.status(500).json({ error: 'Failed to fetch preferences' });
    }
};

// Update user preferences
export const updateUserPreferences = async (req, res) => {
    try {
        const { preferences } = req.body;

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
};

// Fetch all articles based on categories
export const getHomeArticles = async (req, res) => {
    try {
        const { categories } = req.query;
        const categoriesArray = categories ? categories.split(',') : [];

        const articles = await Article.find({
            categories: { $in: categoriesArray }
        });

        res.status(200).json({ articles });
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};

// Get an article by ID
export const getArticleById = async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.status(200).json({ article });
    } catch (error) {
        console.error('Failed to fetch article:', error);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
};

// Get user's articles
export const getUserArticles = async (req, res) => {
    try {
        const articles = await Article.find({ author: req.user._id });
        res.status(200).json({ articles });
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};

// Delete an article
export const deleteArticle = async (req, res) => {
    try {
        const articleId = req.params.id;

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        await Article.deleteOne({ _id: articleId });
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Failed to delete article:', error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
};

// Create a new article
export const createArticle = async (req, res) => {
    try {
        const { title, content, categories } = req.body;

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
};

// Update an existing article
export const updateArticle = async (req, res) => {
    try {
        const articleId = req.params.id;
        const { title, content, categories } = req.body;

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        if (title) article.title = title;
        if (content) article.content = content;
        if (categories) article.categories = categories;

        await article.save();
        res.status(200).json({ message: 'Article updated successfully', article });
    } catch (error) {
        console.error('Failed to update article:', error);
        res.status(500).json({ error: 'Failed to update article' });
    }
};
