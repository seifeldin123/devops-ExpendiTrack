import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { BudgetProvider } from './contexts/BudgetContext'; // Import BudgetProvider
import {I18nextProvider, initReactI18next} from "react-i18next";
import i18next from "i18next";
import en from "./translations/en/common.json";
import fr from "./translations/fr/common.json";
import enTranslations from "./translations/en/common.json";
import frTranslations from "./translations/fr/common.json";

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
