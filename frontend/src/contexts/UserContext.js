import React, { createContext, useState, useContext } from 'react';

// Create a new context called UserContext
export const UserContext = createContext();

// Create a custom hook useUserContext to conveniently access the UserContext
export const useUserContext = () => useContext(UserContext);

// Create a UserProvider component that will wrap your application with the user context
export const UserProvider = ({ children }) => {
    // Define a user state using useState and initialize it as null
    const [user, setUser] = useState(null);

    // Render the UserContext.Provider and provide the user and setUser values to the context
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
