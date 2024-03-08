import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en/common.json";
import fr from "./translations/fr/common.json";

i18next.use(initReactI18next).init({
    interpolation: { escapeValue: false },
    lng: localStorage.getItem('i18nextLng') || "en",
    resources: {
        en: {
            global: en
        },
        fr: {
            global: fr
        },
    },
});

export default i18next;
