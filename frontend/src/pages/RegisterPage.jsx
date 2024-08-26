// frontend\src\pages\RegisterPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        dob: '',
        password: '',
        confirmPassword: '',
        preferences: [],
    });

    const availableCategories = ["Sports", "Politics", "Space"];

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePreferencesChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData({ ...formData, preferences: [...formData.preferences, value] });
        } else {
            setFormData({
                ...formData,
                preferences: formData.preferences.filter((pref) => pref !== value),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.preferences.length === 0) {
            setError('Please select at least one category');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error); // Extract and set the error message from the response
            } else {
                setError('Failed to register. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
                <h2 className="text-2xl font-bold text-center text-blue-600">Register</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Article Preferences:</label>
                        <div className="flex flex-wrap">
                            {availableCategories.map(category => (
                                <label key={category} className="flex items-center mr-4">
                                    <input
                                        type="checkbox"
                                        name="preferences"
                                        value={category}
                                        onChange={handlePreferencesChange}
                                        className="mr-2"
                                    />
                                    {category}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        Register
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-gray-700">Already have an account?</p>
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
