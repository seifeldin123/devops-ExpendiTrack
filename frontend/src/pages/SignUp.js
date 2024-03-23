import React, {useEffect, useState} from 'react';
import {createUser} from '../services/UserService';
import {useUserContext} from '../contexts/UserContext';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {setUser} = useUserContext();

    const { t, i18n } = useTranslation();

    // Update to hold the error message key instead of the translated message
    const [errorKey] = useState('');

    const errorMapping = {
        "Invalid input: Invalid email format": "app.creationFailed",
        "An account with these credentials already exists.": "app.userExist",
        "An error occurred during the signup process. Please try again later.": "app.signupError",
    };

    useEffect(() => {
        const handleLanguageChange = () => {
            // When the language changes, update the error message if there's an error key set
            if (errorKey) {
                setError(t(errorKey));
            }
        };

        // Listen for language changes
        i18n.on('languageChanged', handleLanguageChange);

        // Cleanup function to remove the event listener
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n, errorKey, t]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = await createUser({name, email});
            setUser(user); // Set the user in context
            navigate('/dashboard'); // Navigate to the Dashboard upon successful creation
        } catch (error) {
            const key = errorMapping[error.message] || "app.unexpectedError"; // Fallback to a generic error message
            setError(t(key));
        }
    };

    return (
        <div className="container">

            <h1>{t("app.Sign-up-create")}</h1>

            <div className="signup-form-container">

                <div className="signup-form">

                    <div className="signup-section-container">

                        <form onSubmit={handleSubmit}>

                            <p className="p-titles" >{t("app.signupText")}</p>

                            <div className="form-group">

                                <label htmlFor="username">
                                    <span className="field-name">Username</span> <strong
                                    className="required">{t("app.add-budget-required")}</strong>
                                </label>

                                <input
                                    id="username"
                                    className="form-control"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onInvalid={(e) => e.target.setCustomValidity(t("app.usernameRequiredMessage"))}
                                    placeholder="Username"
                                    required
                                />
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
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <h4>{t("app.budgetItem-the-form-cannot-be-submitted")}</h4>
                                    <ul>
                                    <li id="error-message">{error}</li>
                                    </ul>
                                </div>
                            )}

                            <div className="mrgn-bttm-md button-submit-form">
                                <button type="submit" className="btn-lg btn-primary">
                                    {t("app.Sign-up-sign-up")} <span className="glyphicon glyphicon-user"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <section>
                    <p className="mrgn-tp-lg">
                        <strong> <span>  {t("app.Sign-up-have-account")}</span> </strong>  &nbsp;
                            <button className="btn btn-default" type="button" onClick={() => navigate('/login')}>
                            {t("app.Sign-up-login-here")}
                        </button>
                    </p>
                </section>

            </div>

        </div>
    );
};

export default SignUp;
