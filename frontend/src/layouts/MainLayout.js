import React from 'react';
import Nav from '../components/Nav';

const MainLayout = ({ children }) => {
    return (
        <div>
            <Nav /> {/* Render the navigation bar */}
            <main>{children}</main> {/* Render the main content */}
        </div>
    );
};

export default MainLayout;
