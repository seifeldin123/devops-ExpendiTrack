import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './translations/en/common.json';
import frTranslations from './translations/fr/common.json';

const resources = {
    en: {
        translation: enTranslations,
    },
    fr: {
        translation: frTranslations,
    },
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
