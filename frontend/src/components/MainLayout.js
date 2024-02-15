import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <main>{children}</main> {/* Render the main content */}
            <Footer />
        </div>
    );
};

export default MainLayout;
