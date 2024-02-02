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


    const handleLogin = async () => {
        setError(''); // Clear previous errors
        if (!username.trim() || !email.trim()) {
            setError('Please enter both username and email'); // Set error
            return;
        }

        try {
            const user = await findUser(username, email);
            // Assuming `findUser` returns null or a specific message when the user is not found
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
        <div>
            <form className="form-horizontal" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <div style={{color: 'red'}}>{error}</div>}


                <div className="form-group">
                    <div>
                        <label htmlFor="username" className="col-sm-3 control-label">Username</label>
                    </div>

                    <div className="col-sm-9">
                        <input
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
            <div>
                <p>Don't have an account yet?
                    <button className="btn btn-call-to-action" type="button"
                            onClick={() => navigate('/signup')}>Sign up here</button>
                </p>
            </div>
        </div>
    );
};

export default LoginComponent;
