import React, {createContext, useState, useContext, useEffect} from 'react';
import i18n from "i18next";

// Create a new context called UserContext
export const UserContext = createContext();

// Create a custom hook useUserContext to conveniently access the UserContext
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Define a user state using useState and initialize it as null
    const [user, setUser] = useState(null);

    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    // Render the UserContext.Provider and provide the user and setUser values to the context
    return (
        <UserContext.Provider value={{ user, setUser, language, setLanguage }}>
            {children}
        </UserContext.Provider>
    );
};
