import React, {useEffect, useState} from 'react';
import { findUser } from '../services/UserService';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next"; // Import useNavigate hook

const Login = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const { setUser } = useUserContext();
    const navigate = useNavigate(); // Use navigate for redirection after login
    const [error, setError] = useState(''); // State to hold error messages
    const { t, i18n } = useTranslation();
    const [errorKey, setErrorKey] = useState(''); // New state to keep track of the error message key


    useEffect(() => {
        const updateErrorBasedOnLanguage = () => {
            // Only update the error if there's a previously set error key
            if (errorKey) {
                setError(t(errorKey));
            }
        };

        i18n.on('languageChanged', updateErrorBasedOnLanguage);

        // Cleanup to remove the listener
        return () => {
            i18n.off('languageChanged', updateErrorBasedOnLanguage);
        };
    }, [errorKey, i18n, t]);


    // Modified to accept the event argument
    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        setError(''); // Clear previous errors
        setErrorKey(''); // Clear previous error keys

        if (!username.trim() || !email.trim()) {
            setError('Please enter both username and email'); // Set error
            return;
        }

        try {
            const user = await findUser(username, email);
            if (user && user !== "User not found. Proceed with creation.") {
                setUser(user); // Set the user in context if found
                navigate('/dashboard'); // Navigate to the Dashboard upon successful login
            }
            else {
                // For predefined error messages, set the key and then set the error using the key
                const loginErrorKey = "app.loginFailed";
                setErrorKey(loginErrorKey); // Set the error key
                setError(t(loginErrorKey)); // Set the localized error message
            }

        } catch (error) {
            const serverErrorKey = "app.serverError";
            setErrorKey(serverErrorKey); // Update the error key state
            setError(t(serverErrorKey)); // Set the error message to server error
        }
    };


    return (
        <div className="container">

            <h1>{t("app.login-sign-up")}</h1>

            <div className="login-form-container">

                <div className="login-form">

                    <div className="login-section-container">

                        <form onSubmit={handleLogin}>

                            <p className="p-titles" >{t("app.loginText")}</p>

                            <div className="form-group">
                                <label htmlFor="username">
                                    <span className="field-name">Username</span> <strong
                                    className="required">{t("app.add-budget-required")}</strong>
                                </label>

                                <input
                                    id="username"
                                    className="form-control"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onInvalid={(e) => e.target.setCustomValidity(t("app.usernameRequiredMessage"))}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                    placeholder="Username"
                                    required/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    <span className="field-name">Email</span> <strong
                                    className="required">{t("app.add-budget-required")}</strong>
                                </label>

                                <input
                                    id="email"
                                    className="form-control"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onInvalid={(e) => e.target.setCustomValidity(t("app.emailRequiredMessage"))}
                                    onInput={(e) => e.target.setCustomValidity('')}
                                    placeholder="Email"
                                    required/>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <h4>{t("app.budgetItem-the-form-cannot-be-submitted")}</h4>
                                    <ul>
                                    <li>{error}</li>
                                    </ul>
                                </div>
                            )}

                            <div className="mrgn-bttm-md button-submit-form">
                                <button type="submit" className="btn-lg btn-primary">
                                    {t("app.login-sign-up")} <span className="glyphicon glyphicon-log-in"></span>
                                </button>
                            </div>

                        </form>

                    </div>

                </div>

                <section>
                    <p className="mrgn-tp-lg">

                        <strong> <span>{t("app.no-account")}</span> </strong> &nbsp;
                        <button className="btn btn-default" type="button"
                                onClick={() => navigate('/signup')}>{t("app.sign-up-here")}
                        </button>
                    </p>
                </section>

            </div>

        </div>
);
};

export default Login;
