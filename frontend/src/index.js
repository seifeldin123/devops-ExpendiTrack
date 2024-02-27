import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

import {I18nextProvider} from "react-i18next";

import i18next from "i18next";
import en from "./translations/en/common.json";
import fr from "./translations/fr/common.json";

i18next.init({
    interpolation: { escapeValue: false },
    lng: localStorage.getItem('i18nextLng') || "en",
    resources: {
        en: {
            global:en
        },
        fr: {
            global:fr
        },
    }
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <App />
        </I18nextProvider>
    </React.StrictMode>
);