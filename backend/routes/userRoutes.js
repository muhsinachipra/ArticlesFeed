// backend\routes\userRoutes.js

import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { 
    getUserPreferences, 
    updateUserPreferences, 
    getHomeArticles, 
    getArticleById, 
    getUserArticles, 
    deleteArticle, 
    createArticle, 
    updateArticle 
} from '../controllers/userController.js';

const router = express.Router();

router.get('/preferences', authMiddleware, getUserPreferences);
router.put('/preferences', authMiddleware, updateUserPreferences);
router.get('/homeArticles', authMiddleware, getHomeArticles);
router.get('/articles/:id', authMiddleware, getArticleById);
router.get('/articles', authMiddleware, getUserArticles);
router.delete('/articles/:id', authMiddleware, deleteArticle);
router.post('/articles', authMiddleware, createArticle);
router.put('/articles/:id', authMiddleware, updateArticle);

export default router;
