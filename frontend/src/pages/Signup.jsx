import React, { useState } from 'react';
import api from '../api/api'; 
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // MATCHING: This now correctly calls the /register route you set in your backend
            await api.post('/auth/register', { name, email, password });

            alert("Account created! You can now login.");
            navigate('/login');
        } catch (err) {
            // Displays the error from the backend
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#ff385c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Signup;