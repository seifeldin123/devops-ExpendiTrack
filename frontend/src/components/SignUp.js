import React, { useState } from 'react';
import { createUser } from '../services/UserService';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { setUser } = useUserContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = await createUser({ name, email });
            setUser(user); // Set the user in context
            navigate('/dashboard'); // Navigate to the Dashboard upon successful creation
        } catch (error) {
            // Now, error is the message we rejected with in createUser
            setError(error);
        }
    };

    return (
        <div className="container">
            <form className="form-horizontal" onSubmit={handleSubmit}>
                <h1>Create Account</h1>
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
                            placeholder="Email"
                            required
                        />
                    </div>
                </div>

                <div className="col-sm-offset-3 col-sm-9">
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </div>
            </form>
            <section>
                <p className="mrgn-tp-lg">
                    Already have an account?
                    <button className="btn btn-default" type="button" onClick={() => navigate('/login')}>
                        Login here
                    </button>
                </p>
            </section>
        </div>
    );
};

export default SignUp;
