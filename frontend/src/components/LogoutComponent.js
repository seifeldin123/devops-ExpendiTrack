import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import {useTranslation} from "react-i18next";


const LogoutComponent = () => {
    const {t} = useTranslation("global")
    // Access setUser function from UserContext and navigation from React Router
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    // Function to handle user logout with confirmation
    const handleLogout = () => {
        // Show confirmation dialog with a clear and accessible message
        const confirmLogout = window.confirm(t("app.logoutWindow"));
        if (confirmLogout) {
            setUser(null); // Set the user to null, effectively logging them out
            navigate('/login'); // Navigate back to the login page, ensuring the user understands they will be redirected
        }
    };

    return (
        <div className="col-xs-5 col-xs-offset-7 col-md-offset-0 col-md-4">
            <section id="wb-so">
                <h2 className="wb-inv">Sign out</h2>
                <button className="btn btn-primary" onClick={handleLogout}><span className="glyphicon glyphicon-log-out"></span> &nbsp; {t("app.logoutComponent-logout")}
                </button>
            </section>
        </div>

    );
};

export default LogoutComponent;