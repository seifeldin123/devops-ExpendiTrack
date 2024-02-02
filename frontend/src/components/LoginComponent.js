import React, { useState } from 'react';
import { findUser } from '../services/userService';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const { setUser } = useUserContext();
    const navigate = useNavigate(); // Use navigate for redirection after login
    const [error, setError] = useState(''); // State to hold error messages


    const handleLogin = async () => {
        setError(''); // Clear previous errors
        if (!username.trim() || !email.trim()) {
            setError('Please enter both username and email'); // Set error
            return;
        }

        try {
            const user = await findUser(username, email);
            // Assuming `findUser` returns null or a specific message when the user is not found
            if (user && user !== "User not found. Proceed with creation.") {
                setUser(user); // Set the user in context if found
                navigate('/dashboard'); // Navigate to the Dashboard upon successful login
            } else {
                // The user does not exist, so inform them of a failed login attempt
                setError('Login failed. User not found or incorrect credentials.');
            }
        } catch (error) {
            setError('An error occurred during login');
        }
    };


    return (
        <div>
            <h2>Login</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginComponent;
