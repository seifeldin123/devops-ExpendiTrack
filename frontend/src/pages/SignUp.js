import React, {useState} from 'react';
import {createUser} from '../services/UserService';
import {useUserContext} from '../contexts/UserContext';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {t} = useTranslation("global");

    const {setUser} = useUserContext();

    // Define local variable error;
    // if (error ===

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = await createUser({name, email});
            setUser(user); // Set the user in context
            navigate('/dashboard'); // Navigate to the Dashboard upon successful creation
        } catch (error) {
            console.log(error.message)
            // Extract and set only the error message to display it correctly
            // const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
            // setError(errorMessage);
            // console.log(errorMessage, localStorage.getItem("i18nextLng"))
            // if (errorMessage) {
            //     setError(errorMessage);
            //
            // }
        // else
            if (error.message === "Invalid input: Invalid email format") {
                setError(t("app.creationFailed"));
            } else if (error.message === "A user with the provided name or email already exists.") {
                setError(t("app.userExist"))
            }
            else if (error.message === "An error occurred during the signup process. Please try again later.") {
                setError(t("app.signupError"));
            } else {
                setError(t("app.unexpectedError"))
            }



        }

    };

    return (
        <div className="container">
            <form className="form-horizontal" onSubmit={handleSubmit}>
                <h1>{t("app.Sign-up-create")}</h1>
                {error && <div style={{color: 'red'}}>{error}</div>}

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
