import React from 'react';
import { render } from '@testing-library/react';
import Header from '../Header';
import {UserProvider} from "../../contexts/UserContext";

describe('Header Component', () => {
    it('renders Header component without errors', () => {
        render(
            // Provide the UserProvider context for the Header component
            <UserProvider>
                {/* Render the Header component within the UserProvider context*/}
                <Header />
            </UserProvider>
        );
    });
});
