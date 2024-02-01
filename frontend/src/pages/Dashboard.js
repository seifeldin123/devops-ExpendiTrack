import React from 'react';
import {useUserContext} from '../contexts/UserContext';

const Dashboard = () => {
    const {user} = useUserContext(); // Retrieve the current user from context

    return (
        <div data-testid="dashboard"> {/* Added data-testid here for testing */}
            {user && <h1>Welcome, {user.name}!</h1>} {/* Display the welcome message if a user is logged in */}
        </div>
    );
};

export default Dashboard;
