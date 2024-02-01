import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import LogoutComponent from './LogoutComponent';

const Nav = () => {
    const { user } = useUserContext();

    return (
        <nav>
            <ul>
                {user ? (
                    // Display dashboard and logout for authenticated users
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><LogoutComponent /></li>
                    </>
                ) : (
                    // Display login and sign up for unauthenticated users
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Nav;
