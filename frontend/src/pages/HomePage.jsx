// frontend\src\pages\HomePage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomePage() {
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // Fetch user preferences
                const preferencesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/preferences`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const preferences = preferencesResponse.data.preferences;

                console.log("preferences: ", preferences)

                // Fetch articles based on preferences
                const articlesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/homeArticles`, {
                    params: {
                        categories: preferences.join(',') // Assuming the backend can filter articles based on categories
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("articlesResponse.data.articles: ", articlesResponse.data.articles)

                setArticles(articlesResponse.data.articles);
            } catch (err) {
                console.error('Failed to fetch articles:', err);
                setError('Failed to load articles');
            }
        };

        fetchArticles();
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Article Feeds</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="w-full max-w-3xl">
                {articles.length === 0 ? (
                    <p className="text-gray-500">No articles found based on your interests.</p>
                ) : (
                    <ul className="space-y-4">
                        {articles.map(article => (
                            <li key={article._id} className="p-4 bg-white rounded shadow-md">
                                <h2 className="text-xl font-semibold text-blue-600">{article.title}</h2>
                                <p className="text-gray-700 mt-2">{article.content}</p>
                                <div className="mt-2">
                                    <span className="text-gray-500 text-sm">Categories: {article.categories.join(', ')}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
