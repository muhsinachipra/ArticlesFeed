// backend\models\Article.js

import { Schema, model } from 'mongoose';

const articleSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    categories: [{ type: String }],  // List of categories
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User model
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Article = model('Article', articleSchema);
export default Article;
