import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Nav from '../Nav';
import * as UserContextModule from '../../contexts/UserContext';
import {initReactI18next} from "react-i18next";
import i18next from "i18next";
import enTranslations from "../../translations/en/common.json";
import frTranslations from "../../translations/fr/common.json";

// Mock the useUserContext hook
jest.mock('../../contexts/UserContext', () => ({
    useUserContext: jest.fn(),
}));

// Initialize i18next
const resources = {
    en: {
        translation: enTranslations,
    },
    fr: {
        translation: frTranslations,
    },
};

i18next
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

describe('Nav Component', () => {

    // Verify Navigation for Authenticated Users
    it('ensures Canada.ca and GCWeb links are not present for authenticated users', () => {
        UserContextModule.useUserContext.mockImplementation(() => ({ user: { name: 'John Doe' } }));
        render(
            <Router>
                <Nav />
            </Router>
        );
        expect(screen.queryByText('Canada.ca')).not.toBeInTheDocument();
        expect(screen.queryByText('GCWeb')).not.toBeInTheDocument();
    });

    // Verify Navigation for Unauthenticated Users
    it('ensures Dashboard link is not present for unauthenticated users', () => {
        UserContextModule.useUserContext.mockImplementation(() => ({ user: null }));
        render(
            <Router>
                <Nav />
            </Router>
        );
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

});
