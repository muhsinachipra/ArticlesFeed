// frontend\src\pages\HomePage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import useNavigate for redirection
import { useAuth } from '../context/useAuth';

export default function HomePage() {
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const { logout } = useAuth();

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

                console.log("preferences: ", preferences);

                // Fetch articles based on preferences
                const articlesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/homeArticles`, {
                    params: {
                        categories: preferences.join(',') // Assuming the backend can filter articles based on categories
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log("articlesResponse.data.articles: ", articlesResponse.data.articles);

                setArticles(articlesResponse.data.articles);
            } catch (err) {
                console.error('Failed to fetch articles:', err);
                setError('Failed to load articles');
            }
        };

        fetchArticles();
    }, [token]);


    // const handleLogout = () => {
    //     logout();  // Call the logout function to clear the token
    //     navigate('/login'); // Redirect to the login page
    // };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg relative">
                <div className="absolute top-8 right-4 space-x-4">
                    <Link to="/dashboard" className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-200 ease-in-out">
                        Dashboard
                    </Link>
                    <button onClick={logout} className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-red-700 transition duration-200 ease-in-out">
                        Logout
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-blue-600 mb-6">Article Feeds</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="w-full">
                    {articles.length === 0 ? (
                        <p className="text-gray-500 text-center">No articles found based on your interests.</p>
                    ) : (
                        <ul className="space-y-6">
                            {articles.map((article) => (
                                <li key={article._id} className="p-6 bg-blue-50 hover:bg-blue-100 transition duration-200 ease-in-out rounded-lg shadow-md">
                                    <h2 className="text-2xl font-semibold text-blue-700">{article.title}</h2>
                                    <p className="text-gray-700 mt-3 leading-relaxed">{article.content}</p>
                                    <div className="mt-4">
                                        <span className="text-sm text-gray-500">Categories: {article.categories.join(', ')}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>

    );
}
