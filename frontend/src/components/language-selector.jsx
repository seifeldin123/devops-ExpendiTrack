import React from "react";
import i18n from "i18next";
import {useTranslation} from "react-i18next";

const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" }
];

// Dummy function for changing language


const LanguageSelector = () => {
    const {i18n} = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    return (
        <div className="btn-container">
            {languages.map((lng) => (
                <button
                    className={lng.code===i18n.language?"selected":""}
                    key={lng.code} onClick={() => changeLanguage(lng.code)}>
                    {lng.name}
                </button>
            ))}
        </div>
    );
};

export default LanguageSelector;
