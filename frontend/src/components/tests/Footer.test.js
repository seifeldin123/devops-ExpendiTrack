import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Footer from '../Footer';
import en from "../../translations/en/common.json";
import fr from "../../translations/fr/common.json";
import i18next from "i18next";
import { I18nextProvider } from 'react-i18next';
import {UserContext} from "../../contexts/UserContext";
import Header from "../Header";
import {BrowserRouter as Router} from "react-router-dom";

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
describe('Footer Component', () => {

    expect.extend(toHaveNoViolations);



    // Render Footer Component
    it('renders Footer component without errors', () => {
        const { getByRole } = render(<Footer />);
        expect(getByRole('contentinfo')).toBeInTheDocument();
    });

    // Display Government of Canada Information
    it('displays Government of Canada information', () => {
        const { getByText } = render(
            <I18nextProvider i18n={i18next}>
                <Router>
                        <Footer />
                </Router>
            </I18nextProvider>
        );
        expect(getByText('Government of Canada')).toBeInTheDocument();
        expect(getByText('All contacts')).toBeInTheDocument();
        expect(getByText('Department and agencies')).toBeInTheDocument();
        expect(getByText('About government')).toBeInTheDocument();
    });

    // Check Accessibility
    it('Footer component should have no accessibility violations', async () => {
        const { container } = render(<Footer />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });


    // Verify Main Footer Links
    it('verifies main footer links', () => {
        const { getByText } = render(
            <I18nextProvider i18n={i18next}>
                <Router>
                    <Footer />
                </Router>
            </I18nextProvider>
        );
        expect(getByText('All contacts').closest('a')).toHaveAttribute('href', 'https://www.canada.ca/en/contact.html');
        // Add checks for other main footer links similarly
    });

    // Verify Sub Footer Links
    it('verifies sub footer links', () => {
        const { getByText } = render(
            <I18nextProvider i18n={i18next}>
                <Router>
                    <Footer />
                </Router>
            </I18nextProvider>
        );
        expect(getByText('Social media').closest('a')).toHaveAttribute('href', 'https://www.canada.ca/en/social.html');
        // Add checks for other sub footer links similarly
    });
});
