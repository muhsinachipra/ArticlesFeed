// frontend\src\pages\ArticlePage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/articles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setArticle(response.data.article);
            } catch (err) {
                console.error('Failed to fetch article:', err);
                setError('Failed to load article');
            }
        };

        fetchArticle();
    }, [id]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
            {article ? (
                <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-extrabold text-gray-800">{article.title}</h1>
                    <p className="text-gray-600 mt-4 text-lg">{article.content}</p>
                    <div className="mt-6">
                        <span className="text-sm text-gray-500">Categories: {article.categories.join(', ')}</span>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center w-full">
                    <p className="text-gray-500 text-lg">Loading...</p>
                </div>
            )}
        </div>
    );
}
