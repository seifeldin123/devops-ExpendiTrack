import React, { useState } from 'react';
import { findUser } from '../services/userService';
import { useUserContext } from '../contexts/UserContext';

const LoginComponent = () => {
    // State for username and email
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    // Access UserContext to set user data
    const { setUser } = useUserContext();

    // Function to handle the login process
    const handleLogin = async () => {
        if (!username || !email) {
            alert('Please enter both username and email');
            return;
        }

        try {
            const user = await findUser(username, email);
            if (user) {
                setUser(user); // Set the user in context
            } else {
                alert('User not found');
            }
        } catch (error) {
            console.error('Login error', error);
            alert('An error occurred during login');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginComponent;
