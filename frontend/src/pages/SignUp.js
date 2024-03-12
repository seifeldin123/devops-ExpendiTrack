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
    const [errorKey, setErrorKey] = useState('');

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
            // setErrorKey(key); // Update the errorKey state
            // setError(t(key)); // Also update the error message immediately
            console.log(error);
            setError(t(key));

        }
    };

    return (
        <div className="container">
            <form className="form-horizontal" onSubmit={handleSubmit}>

                <h1>{t("app.Sign-up-create")}</h1>
                {error && <div id="error-message" style={{color: 'red'}}>{error}</div>}

                <div className="form-group">
                    <div>
                        <label htmlFor="username" className="col-sm-3 control-label">Username</label>
                    </div>
                    <div className="col-sm-9">
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
                </div>

                <div className="form-group">
                    <div>
                        <label htmlFor="email" className="col-sm-3 control-label">Email</label>
                    </div>
                    <div className="col-sm-9">
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
                </div>

                <div className="col-sm-offset-3 col-sm-9">
                    <button type="submit" className="btn-lg btn-primary">
                        {t("app.Sign-up-sign-up")} <span className="glyphicon glyphicon-user"></span>
                    </button>
                </div>
            </form>
            <section>
                <p className="mrgn-tp-lg">
                    {t("app.Sign-up-have-account")} &nbsp;
                    <button className="btn btn-default" type="button" onClick={() => navigate('/login')}>
                        {t("app.Sign-up-login-here")}
                    </button>
                </p>
            </section>
        </div>
    );
};

export default SignUp;
