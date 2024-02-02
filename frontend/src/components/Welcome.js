import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    // Function to navigate to the login page
    const handleLoginClick = () => {
        navigate('/login');
    };

    // Function to navigate to the signup page
    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <main className="container" aria-labelledby="welcome-heading">
            <h1 id="welcome-heading">Welcome to Our Budget Management App!</h1>
            <p>This platform is designed to help you track and manage your finances with ease. Join us to start optimizing your budget today!</p>
            <nav aria-label="Main navigation">
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li>
                        <button onClick={handleLoginClick} className="btn btn-call-to-action" type="button">Login to Your Account</button>
                    </li>
                    <li>
                        <button onClick={handleSignupClick} className="btn btn-call-to-action" type="button">Create a New Account</button>
                    </li>
                </ul>
            </nav>
        </main>
    );
};

export default Welcome;
