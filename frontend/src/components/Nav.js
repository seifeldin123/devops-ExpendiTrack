import React from 'react';
import {Link} from 'react-router-dom';
import {useUserContext} from '../contexts/UserContext';
import LogoutComponent from './LogoutComponent';

const Nav = () => {
    const {user} = useUserContext();

    return (
        <nav id="wb-bc" property="breadcrumb">
            <h2>You are here:</h2>
            <div className="container">
                <ol className="breadcrumb" typeof="BreadcrumbList">

                    {user ? (
                        // Display dashboard and logout for authenticated users
                        <>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><LogoutComponent/></li>
                        </>
                    ) : (
                        // Display login and sign up for unauthenticated users
                        <>
                            <li property="itemListElement" typeof="ListItem">
                                <a property="item" typeof="WebPage" href="https://www.canada.ca/en.html">
                                    <span property="name">Canada.ca</span>
                                </a>
                                <meta property="position" content="1"/>
                            </li>

                            <li property="itemListElement" typeof="ListItem">
                                <a property="item" typeof="WebPage"
                                   href="https://wet-boew.github.io/GCWeb/index-en.html">
                                    <span property="name">GCWeb</span>
                                </a>
                                <meta property="position" content="2"/>
                            </li>
                        </>
                    )}

                </ol>
            </div>
        </nav>
    );
};

export default Nav;
