import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { UserContext, UserProvider } from '../contexts/UserContext';

// A mock component to consume our context
const MockConsumerComponent = () => {
    // Access user and setUser from the UserContext using useContext
    const { user, setUser } = useContext(UserContext);
    return (
        <div>
            {/* Button to set the user to 'Test User' when clicked */}
            <button onClick={() => setUser({ name: 'Test User' })}>Set User</button>
            {/* Display the user's name or 'No User' based on the context */}
            <div>User: {user ? user.name : 'No User'}</div>
        </div>
    );
};

// Describe block for the UserContext test suite
describe('UserContext', () => {
    // Test case: It verifies that UserProvider provides user object and setUser function
    it('provides a user object and setUser function', () => {
        // Render MockConsumerComponent wrapped in UserProvider
        render(
            <UserProvider>
                <MockConsumerComponent />
            </UserProvider>
        );
        // Expectation 1: Initial state should display 'No User'
        expect(screen.getByText(/No User/i)).toBeInTheDocument();

        // Simulate a click on the 'Set User' button using act
        act(() => {
            screen.getByRole('button', { name: /set user/i }).click();
        });

        // Expectation 2: After clicking the button, it should display 'Test User'
        expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    });
});
