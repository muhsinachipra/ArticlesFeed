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
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="w-full bg-white shadow p-4 flex justify-between items-center">
                <h1 className="pl-4 text-3xl font-bold text-blue-600">Dashboard</h1>
                <Link
                    to="/"
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-200"
                >
                    Go to Home
                </Link>
            </header>

            <main className="flex-1 p-8">
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
                    {/* <!-- Article Preferences Section: Full Width on Top --> */}
                    <section className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Article Preferences</h2>
                        <div className="space-y-2">
                            {availableCategories.map((category) => (
                                <label key={category} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="preferences"
                                        value={category}
                                        checked={preferences.includes(category)}
                                        onChange={handlePreferencesChange}
                                        className="form-checkbox text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">{category}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* <!-- Your Articles and Add/Edit Article Sections Side by Side --> */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* <!-- Your Articles Section --> */}
                        <section className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Your Articles</h2>
                            <ul className="space-y-4">
                                {articles.map((article) => (
                                    <li
                                        key={article._id}
                                        className="p-4 border border-gray-200 rounded-lg flex justify-between items-center"
                                    >
                                        <span className="text-gray-800 font-medium">{article.title}</span>
                                        <div className="flex space-x-4">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
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
                        </section>

                        {/* <!-- Add/Edit Article Section --> */}
                        <section className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-blue-700 mb-4">{isEditing ? 'Edit Article' : 'Add New Article'}</h2>
                            <form onSubmit={handleArticleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newArticle.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-200 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Content</label>
                                    <textarea
                                        name="content"
                                        value={newArticle.content}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-200 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <div className="flex flex-wrap gap-4">
                                        {availableCategories.map((category) => (
                                            <label key={category} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="categories"
                                                    value={category}
                                                    checked={newArticle.categories.includes(category)}
                                                    onChange={handleInputChange}
                                                    className="form-checkbox text-blue-600"
                                                />
                                                <span className="ml-2 text-gray-700">{category}</span>
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
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
