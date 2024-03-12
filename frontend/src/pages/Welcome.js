import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";

const Welcome = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    useEffect(() => {
    }, [i18n.language]);


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
            <h1 id="welcome-heading">{t("app.welcome-heading")}</h1>
            <p>{t("app.information")}</p>
            <nav aria-label="Main navigation">
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    <li>
                        <button onClick={handleLoginClick} className="btn btn-call-to-action" type="button">
                            <span className="glyphicon glyphicon-log-in"></span>&nbsp; &nbsp; {t("app.login-button")}
                        </button>
                    </li>
                    <li>
                        <button onClick={handleSignupClick} data-testid="createAccountButton" className="btn btn-call-to-action" type="button">
                            <span className="glyphicon glyphicon-user"></span>&nbsp; &nbsp; {t("app.create-new-account")}
                        </button>
                    </li>
                </ul>
            </nav>
        </main>
    );
};

export default Welcome;
