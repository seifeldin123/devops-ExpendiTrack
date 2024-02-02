import React, {useState} from 'react';
import {createUser, findUser} from '../services/userService';
import {useUserContext} from '../contexts/UserContext';
import {useNavigate} from 'react-router-dom';

const SignUp = () => {
    // Define state variables for name, email, and error messages
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(''); // Using state for error messages
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Access setUser function from UserContext
    const {setUser} = useUserContext();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            const response = await findUser(name, email);

            if (response === "User not found. Proceed with creation.") {
                const createResponse = await createUser({name, email});
                if (createResponse.data) {
                    setUser(createResponse.data); // Set the user in context
                    navigate('/dashboard'); // Navigate to the Dashboard upon successful creation
                }
            } else {
                setError('User with this name and email already exists');
            }
        } catch (error) {
            setError('An error occurred during signup');
        }
    };

    return (
        <div>
            <form className="form-horizontal" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                {error && <div style={{color: 'red'}}>{error}</div>}

                <div className="form-group">
                    <div>
                        <label htmlFor="username" className="col-sm-3 control-label">Username</label>
                    </div>

                    <div className="col-sm-9">
                        <input className="form-control"
                               type="text"
                               value={name}
                               onChange={(e) => setName(e.target.value)}
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
                    <button type="submit" className="btn btn-primary">Signup</button>
                </div>

            </form>
            <div>
                <p>Already have an account?
                    <button className="btn btn-call-to-action" type="button" onClick={() => navigate('/login')}>
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
