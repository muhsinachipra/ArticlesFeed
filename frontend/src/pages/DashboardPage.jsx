// frontend\src\pages\DashboardPage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardPage = () => {
    const [preferences, setPreferences] = useState([]);
    const [availableCategories] = useState(["Sports", "Politics", "Space"]);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch current preferences from the backend
        const fetchPreferences = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/preferences`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPreferences(response.data.preferences);
            } catch (err) {
                console.error('Failed to fetch preferences:', err);
                setError('Failed to load preferences');
            }
        };
        fetchPreferences();
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
                <h2 className="text-2xl font-bold text-center text-blue-600">Dashboard</h2>
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
            </div>
        </div>
    );
};

export default DashboardPage;

