import React from 'react';
import {getAllByTestId, render, screen} from '@testing-library/react';
import MainLayout from '../MainLayout';
import {UserProvider} from "../../contexts/UserContext";
import enTranslations from "../../translations/en/common.json";
import frTranslations from "../../translations/fr/common.json";
import i18next from "i18next";
import {I18nextProvider, initReactI18next} from "react-i18next";

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
describe('MainLayout Component', () => {

    // Render MainLayout with Children Components
    it('renders the main content', () => {
        render(
            <I18nextProvider i18n={i18next}>
                <UserProvider>
                    <MainLayout>
                        <div>Main Content</div>
                    </MainLayout>
                </UserProvider>
            </I18nextProvider>
    );

        // Assert that the main content is rendered
        expect(screen.getByText('Main Content')).toBeInTheDocument();
    });
});
