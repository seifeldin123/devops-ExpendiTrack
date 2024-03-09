import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// import {I18nextProvider} from "react-i18next";
import './i18n';// import {I18nextProvider} from "react-i18next";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/*<I18nextProvider i18n={i18next}>*/}
            <App />
        {/*</I18nextProvider>*/}
    </React.StrictMode>
);