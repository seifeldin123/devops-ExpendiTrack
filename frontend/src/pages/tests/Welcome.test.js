import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Welcome from '../Welcome'; // Import the Welcome component to be tested
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import en from "../../translations/en/common.json";
import fr from "../../translations/fr/common.json";

i18next.init({
    lng: 'en', // Use English for tests or adjust as necessary
    resources: {
        en: {
            global: en
        },
        fr: {
            global: fr
        },
    }
});

describe('Welcome', () => {
    it('renders the welcome message', () => {
        // Render the Welcome component within a BrowserRouter
        render(
            <I18nextProvider i18n={i18next}>
                <BrowserRouter>
                    <Welcome />
                </BrowserRouter>
            </I18nextProvider>
        );
        // Ensure that the expected welcome message and navigation links are rendered
        expect(screen.getByRole('heading', { name: /Welcome to Our Budget Management App!/i })).toBeInTheDocument();
        expect(screen.getByText(/This platform is designed to help you track and manage your finances with ease./i)).toBeInTheDocument();
        // Check for presence of buttons instead of links
        expect(screen.getByRole('button', { name: /Login to Your Account/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create a New Account/i })).toBeInTheDocument();
    });
});
