import React, { useState } from 'react';
import api from '../api/api'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 1. Send credentials to backend
            const res = await api.post('/auth/login', { email, password });
            
            // 2. Save the Token for the api.js interceptor
            localStorage.setItem('token', res.data.token);
            
            // 3. Save user info for the Header display
            localStorage.setItem(
                'user',
                JSON.stringify({
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                })
            );

            alert("Login Successful!");
            
            // 4. Navigate home and refresh to update the Header state
            navigate('/'); 
            window.location.reload(); 
        } catch (err) {
            // Displays specific error from server or default message
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="mt-4 grow flex items-center justify-around min-h-[70vh]">
            <div className="mb-32 w-full max-w-md px-4">
                <h1 className="text-4xl text-center mb-6 font-semibold">Login</h1>
                <form className="space-y-3" onSubmit={handleLogin}>
                    <input 
                        className="w-full border my-2 py-2 px-3 rounded-2xl focus:outline-none focus:border-gray-400"
                        type="email" 
                        placeholder="your@email.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        className="w-full border my-2 py-2 px-3 rounded-2xl focus:outline-none focus:border-gray-400"
                        type="password" 
                        placeholder="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button 
                        type="submit" 
                        className="bg-[#ff385c] w-full text-white py-2 px-3 rounded-2xl mt-4 font-bold shadow-md hover:bg-opacity-90 transition"
                    >
                        Login
                    </button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet? 
                        <Link className="underline text-black font-semibold ml-1" to="/signup">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;