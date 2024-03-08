import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { BudgetProvider } from './contexts/BudgetContext'; // Import BudgetProvider
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import en from "./translations/en/common.json";
import fr from "./translations/fr/common.json";

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

describe('App Routing', () => {
    it('renders Login for "/login" route', () => {

        window.history.pushState({}, '', '/login');
        render(
            <UserProvider>
                <BudgetProvider> {/* Included BudgetProvider */}
                    <App />
                </BudgetProvider>
            </UserProvider>
        );
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });

    it('renders SignUpForm for "/signup" route', () => {
        window.history.pushState({}, '', '/signup');
        render(
            <I18nextProvider i18n={i18next}>
                <UserProvider>
                    <BudgetProvider> {/* Included BudgetProvider */}
                        <App />
                    </BudgetProvider>
                </UserProvider>
            </I18nextProvider>
        );
        expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    });
});
