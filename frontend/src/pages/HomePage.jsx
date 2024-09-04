// frontend\src\pages\HomePage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function HomePage() {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]); // For storing filtered results
    const [searchTerm, setSearchTerm] = useState(''); // For tracking search input
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const { logout } = useAuth();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const preferencesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/preferences`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const preferences = preferencesResponse.data.preferences;

                const articlesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/homeArticles`, {
                    params: {
                        categories: preferences.join(',')
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setArticles(articlesResponse.data.articles);
                setFilteredArticles(articlesResponse.data.articles); // Set initial filtered articles
            } catch (err) {
                console.error('Failed to fetch articles:', err);
                setError('Failed to load articles');
            }
        };

        fetchArticles();
    }, [token]);

    useEffect(() => {
        const results = articles.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredArticles(results);
    }, [searchTerm, articles]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="w-full bg-white shadow p-4 flex justify-between items-center">
                <h1 className="pl-4 text-3xl font-bold text-blue-600">Article Feeds</h1>
                <div className="space-x-4">
                    <Link to="/dashboard" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-200 text-center inline-block">
                        Dashboard
                    </Link>
                    <button onClick={logout} className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 transition duration-200 text-center">
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 container mx-auto p-6">
                <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full mb-6 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {filteredArticles.length === 0 ? (
                    <p className="text-gray-500 text-center">No articles found.</p>
                ) : (

                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                            <li key={article._id} className="flex flex-col p-4 bg-blue-50 hover:bg-blue-100 transition duration-200 ease-in-out rounded-lg shadow-md h-60">
                                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                                    <Link to={`/articles/${article._id}`}>{article.title}</Link>
                                </h2>
                                <p className="text-gray-700 flex-1 leading-relaxed line-clamp-3 mb-3">{article.content}</p>
                                <div className="text-sm text-gray-500">
                                    <span>Categories: {article.categories.join(', ')}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                )}
            </div>
        </div>
    );
}
