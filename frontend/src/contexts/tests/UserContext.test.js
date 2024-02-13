// import React, { useContext } from 'react';
// import {render, screen, act, fireEvent} from '@testing-library/react';
// import { UserContext, UserProvider } from '../UserContext';
//
// // A mock component to consume our context
// const MockConsumerComponent = () => {
//     // Access user and setUser from the UserContext using useContext
//     const { user, setUser } = useContext(UserContext);
//     return (
//         <div>
//             {/* Button to set the user to 'Test User' when clicked */}
//             <button onClick={() => setUser({ name: 'Test User' })}>Set User</button>
//             {/* Display the user's name or 'No User' based on the context */}
//             <div>User: {user ? user.name : 'No User'}</div>
//         </div>
//     );
// };
//
// // Describe block for the UserContext test suite
// describe('UserContext', () => {
//
//     // Verify UserProvider Component Creation
//     it('provides a user object and setUser function', () => {
//         // Render MockConsumerComponent wrapped in UserProvider
//         render(
//             <UserProvider>
//                 <MockConsumerComponent />
//             </UserProvider>
//         );
//         // Expectation 1: Initial state should display 'No User'
//         expect(screen.getByText(/No User/i)).toBeInTheDocument();
//
//         // Simulate a click on the 'Set User' button using act
//         act(() => {
//             screen.getByRole('button', { name: /set user/i }).click();
//         });
//
//         // Expectation 2: After clicking the button, it should display 'Test User'
//         expect(screen.getByText(/Test User/i)).toBeInTheDocument();
//     });
//
//     // Verify UserContext Availability
//     it('UserContext is available within UserProvider', () => {
//         render(
//             <UserProvider>
//                 <MockConsumerComponent />
//             </UserProvider>
//         );
//         // If 'No User' is displayed, it means the context is available and providing a default value.
//         expect(screen.getByText('User: No User')).toBeInTheDocument();
//     });
//
//     // Verify User State Initialization
//     it('Initial user state is null', () => {
//         render(
//             <UserProvider>
//                 <MockConsumerComponent />
//             </UserProvider>
//         );
//         expect(screen.getByText('User: No User')).toBeInTheDocument();
//     });
//
//     // Verify setUser Functionality
//     it('setUser updates the user state', () => {
//         render(
//             <UserProvider>
//                 <MockConsumerComponent />
//             </UserProvider>
//         );
//         // Simulate a click on the 'Set User' button to update the user state.
//         act(() => {
//             fireEvent.click(screen.getByRole('button', { name: /Set User/i }));
//         });
//         // Verify the user state is updated to 'Test User'.
//         expect(screen.getByText('User: Test User')).toBeInTheDocument();
//     });
//
//
//
//
// });
