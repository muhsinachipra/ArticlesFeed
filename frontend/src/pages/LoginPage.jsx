// frontend\src\pages\LoginPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for activity indicator
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
            const { token } = response.data;
            login(token);
            navigate('/'); // Redirect to dashboard or another page
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Failed to log in. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
                <h2 className="text-2xl font-bold text-center text-blue-600">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Logging in...' : 'Login'} {/* Show loading text */}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-gray-700">Dont have an account?</p>
                    <Link
                        to="/register"
                        className="text-blue-600 hover:underline"
                    >
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
