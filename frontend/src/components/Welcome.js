import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <div>
            <h1>Welcome to Our App!</h1>
            <p>This is the best place to manage your budget efficiently.</p>
            <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
        </div>
    );
};

export default Welcome;
