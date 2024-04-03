import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {I18nextProvider, initReactI18next} from 'react-i18next';
import i18n from '../../i18n'; // Import your i18n instance
import Welcome from '../Welcome';
import i18next from "i18next";
import enTranslations from "../../translations/en/common.json";
import frTranslations from "../../translations/fr/common.json";

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

const mockTranslations = {
    "app.welcome-heading": "Welcome to Our Budget Management App!",
    "app.information": "Some information here...",
    "app.login-button": "Login",
    "app.create-new-account": "Create New Account"
};

describe('Welcome', () => {
    it('renders the welcome message', () => {
        // Render the Welcome component within a BrowserRouter
        render(
            <I18nextProvider i18n={i18n}>
                <BrowserRouter>
                    <Welcome />
                </BrowserRouter>
            </I18nextProvider>
        );
        // Ensure that the expected welcome message and navigation links are rendered
        expect(screen.getByRole('heading', { name: /Welcome to Our Budget Management App!/i })).toBeInTheDocument();
        expect(screen.getByText(/This platform is designed to help you track and manage your finances with ease. Join us to start optimizing your budget today!/i)).toBeInTheDocument();
        // Check for presence of buttons instead of links
        expect(screen.getByRole('button', { name: /Login to Your Account/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create a New Account/i })).toBeInTheDocument();
    });
});

