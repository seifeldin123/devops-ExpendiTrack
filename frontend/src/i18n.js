import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18next.init({
    interpolation: { escapeValue: false },
    lng: localStorage.getItem('i18nextLng') || "en", // Use stored language or default to English
    resources: {
        en: {
            global:en
        },
        fr: {
            global:fr
        },
    }
});


export default i18n;