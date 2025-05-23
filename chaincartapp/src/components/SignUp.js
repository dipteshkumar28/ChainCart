import React, { useState } from 'react';
import { Lock, Mail, ShoppingCart, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import axios from "axios";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Enhanced validation
        if (!name.trim()) {
            setError('Please enter your name');
            setIsLoading(false);
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/signup",
                {
                    name: name.trim(),
                    email,
                    password,
                },
                { withCredentials: true }
            );

            console.log("Signup success:", response.data);

            const userId = response.data.userId || Date.now();

            // Store user data with the name properly included
            const userData = {
                name: name.trim(),
                email,
                id: userId
            };

            // Save user data in localStorage
            localStorage.setItem('chainCartUser', JSON.stringify(userData));

            // Save profile data separately
            localStorage.setItem('chaincartProfile', JSON.stringify({
                name: name.trim(),
                email: email,
                profilePic: '',
                phone: '',
                dob: '',
                orders: []
            }));

            localStorage.setItem('justLoggedIn', 'true');
            navigate("/profile");

        } catch (err) {
            console.error("Signup error:", err);
            setError(err?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center mb-4">
                        <ShoppingCart className="h-10 w-10 text-indigo-600" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ml-2">
                            ChainCart
                        </h1>
                    </div>
                    <p className="text-2xl font-semibold text-gray-700">
                        Create your ChainCart account
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white backdrop-blur-sm bg-opacity-90 p-8 rounded-xl shadow-lg border-l-4 border-indigo-600">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 flex items-center text-sm">
                            <Lock className="h-4 w-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                                Name
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                                    placeholder="John Doe"
                                    required
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <User className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                                Create Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                                } text-white font-medium`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Login/Signup */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <a href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                                Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;