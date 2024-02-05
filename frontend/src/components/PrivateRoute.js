import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const PrivateRoute = ({ children }) => {
    const { user } = useUserContext();

    // If the user is authenticated, render the child components, otherwise, redirect to the login page
    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
