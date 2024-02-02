import React, { useState } from 'react';
import { findUser } from '../services/userService';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const { setUser } = useUserContext();
    const navigate = useNavigate(); // Use navigate for redirection after login
    const [error, setError] = useState(''); // State to hold error messages

    // Modified to accept the event argument
    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log("Logging in");
        setError(''); // Clear previous errors
        if (!username.trim() || !email.trim()) {
            setError('Please enter both username and email'); // Set error
            return;
        }

        try {
            const user = await findUser(username, email);
            if (user && user !== "User not found. Proceed with creation.") {
                setUser(user); // Set the user in context if found
                navigate('/dashboard'); // Navigate to the Dashboard upon successful login
            } else {
                // The user does not exist, so inform them of a failed login attempt
                setError('Login failed. User not found or incorrect credentials.');
            }
        } catch (error) {
            setError('An error occurred during login');
        }
    };


    return (
        <div className="container" >
            <form className="form-horizontal" onSubmit={handleLogin}>
                <h1>Login</h1>
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required/>
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
                            placeholder="Email"
                            required/>
                    </div>
                </div>

                <div className="col-sm-offset-3 col-sm-9">
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form>
            <section>
                <p className="mrgn-tp-lg">
                    Don't have an account yet?
                    <button className="btn btn-default" type="button"
                            onClick={() => navigate('/signup')}>Sign up here
                    </button>
                </p>

            </section>
        </div>
    );
};

export default LoginComponent;
