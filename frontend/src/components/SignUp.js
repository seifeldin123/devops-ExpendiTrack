import React, { useState } from 'react';
import { createUser, findUser } from '../services/userService';
import { useUserContext } from '../contexts/UserContext';

const SignUp = () => {
    // Define state variables for name, email, and error messages
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    // Access setUser function from UserContext and navigation from React Router
    const { setUser } = useUserContext();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            // Check if user with the same name and email exists
            const response = await findUser(name, email);

            if (response === "User not found. Proceed with creation.") {
                // User not found, create a new user
                const createResponse = await createUser({ name, email });

                if (createResponse.data) {
                    setUser(createResponse.data); // Set the user in context
                }
            } else {
                // User with the same name and email exists, show error message
                setError('User with this name and email already exists');
            }
        } catch (error) {
            console.error('Signup error', error);
            setError('An error occurred during signup'); // Show an error message
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message if exists */}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
