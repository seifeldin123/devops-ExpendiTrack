import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const LogoutComponent = () => {
    // Access setUser function from UserContext and navigation from React Router
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    // Function to handle user logout
    const handleLogout = () => {
        setUser(null); // Set the user to null, effectively logging them out
        navigate('/login'); // Navigate back to the login page
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutComponent;
