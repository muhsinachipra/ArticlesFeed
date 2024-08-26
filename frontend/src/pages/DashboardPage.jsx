// frontend/src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [preferences, setPreferences] = useState([]);
    const [articles, setArticles] = useState([]);
    const [availableCategories] = useState(["Sports", "Politics", "Space"]);
    const [error, setError] = useState('');
    const [newArticle, setNewArticle] = useState({ title: '', content: '', categories: [] });
    const [isEditing, setIsEditing] = useState(false);
    const [currentArticleId, setCurrentArticleId] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const preferencesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/preferences`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPreferences(preferencesResponse.data.preferences);

                const articlesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/articles`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setArticles(articlesResponse.data.articles);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load data');
            }
        };
        fetchData();
    }, [token]);

    const handlePreferencesChange = async (e) => {
        const { value, checked } = e.target;
        let updatedPreferences;

        if (checked) {
            updatedPreferences = [...preferences, value];
        } else {
            updatedPreferences = preferences.filter((pref) => pref !== value);
        }

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/user/preferences`, { preferences: updatedPreferences }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPreferences(updatedPreferences);
        } catch (err) {
            console.error('Failed to update preferences:', err);
            setError('Failed to update preferences');
        }
    };

    const handleDeleteArticle = async (articleId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/user/articles/${articleId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setArticles(articles.filter(article => article._id !== articleId));
        } catch (err) {
            console.error('Failed to delete article:', err);
            setError('Failed to delete article');
        }
    };

    const handleEditArticle = (articleId) => {
        const articleToEdit = articles.find(article => article._id === articleId);
        setNewArticle({ title: articleToEdit.title, content: articleToEdit.content, categories: articleToEdit.categories || [] });
        setIsEditing(true);
        setCurrentArticleId(articleId);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'categories') {
            setNewArticle(prevState => {
                const categories = Array.isArray(prevState.categories)
                    ? (checked
                        ? [...prevState.categories, value]
                        : prevState.categories.filter(category => category !== value))
                    : (checked ? [value] : []);

                return { ...prevState, categories };
            });
        } else {
            setNewArticle(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleArticleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/user/articles/${currentArticleId}`, newArticle, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setArticles(articles.map(article =>
                    article._id === currentArticleId ? { ...article, ...newArticle } : article
                ));
            } else {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/articles`, newArticle, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setArticles([...articles, response.data.article]);
            }
            setNewArticle({ title: '', content: '', categories: [] });
            setIsEditing(false);
            setCurrentArticleId(null);
        } catch (err) {
            console.error('Failed to save article:', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to save article');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
                <h2 className="text-2xl font-bold text-center text-blue-600">Dashboard</h2>
                <Link
                to="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Go to Home
            </Link>
                {error && <p className="text-red-500">{error}</p>}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Your Article Preferences:</label>
                    <div className="flex flex-wrap">
                        {availableCategories.map(category => (
                            <label key={category} className="flex items-center mr-4">
                                <input
                                    type="checkbox"
                                    name="preferences"
                                    value={category}
                                    checked={preferences.includes(category)}
                                    onChange={handlePreferencesChange}
                                    className="mr-2"
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-700">Your Articles:</h3>
                    <ul>
                        {articles.map(article => (
                            <li key={article._id} className="flex justify-between items-center mt-4 p-2 border rounded">
                                <span>{article.title}</span>
                                <div>
                                    <button
                                        className="mr-2 text-blue-500 hover:text-blue-700"
                                        onClick={() => handleEditArticle(article._id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteArticle(article._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-700">{isEditing ? 'Edit Article' : 'Add New Article'}</h3>
                    <form onSubmit={handleArticleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={newArticle.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Content</label>
                            <textarea
                                name="content"
                                value={newArticle.content}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <div className="flex flex-wrap">
                                {availableCategories.map(category => (
                                    <label key={category} className="flex items-center mr-4">
                                        <input
                                            type="checkbox"
                                            name="categories"
                                            value={category}
                                            checked={newArticle.categories ? newArticle.categories.includes(category) : false}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        {category}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                            {isEditing ? 'Update Article' : 'Add Article'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
