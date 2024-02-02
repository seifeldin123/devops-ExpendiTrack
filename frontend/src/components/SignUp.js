import React, { useState } from 'react';
import { createUser, findUser } from '../services/userService';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const SignUp = () => {
    // Define state variables for name, email, and error messages
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(''); // Using state for error messages
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Access setUser function from UserContext
    const { setUser } = useUserContext();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            const response = await findUser(name, email);

            if (response === "User not found. Proceed with creation.") {
                const createResponse = await createUser({ name, email });
                if (createResponse.data) {
                    setUser(createResponse.data); // Set the user in context
                    navigate('/dashboard'); // Navigate to the Dashboard upon successful creation
                }
            } else {
                setError('User with this name and email already exists');
            }
        } catch (error) {
            setError('An error occurred during signup');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                {error && <div style={{color: 'red'}}>{error}</div>}
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
