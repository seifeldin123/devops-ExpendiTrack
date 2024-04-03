import React from 'react';
import { render, screen } from '@testing-library/react';
import BudgetList from '../BudgetList';
import i18next from "i18next";
import en from "../../translations/en/common.json";
import fr from "../../translations/fr/common.json";
import {I18nextProvider, initReactI18next} from 'react-i18next';
import enTranslations from "../../translations/en/common.json";
import frTranslations from "../../translations/fr/common.json";

// Mock the BudgetItem component
jest.mock('../BudgetItem', () => (props) => <div data-testid="mock-budget-item">{props.budget.budgetDescription}</div>);

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
describe('BudgetList', () => {
    const mockBudgets = [
        { budgetId: 1, budgetDescription: 'Groceries', budgetAmount: 300 },
        { budgetId: 2, budgetDescription: 'Utilities', budgetAmount: 150 }
    ];

    // Display Budget List
    it('renders a list of budget items', () => {
        render(
            <BudgetList budgets={mockBudgets} />
        );

        // Check for the "Budgets" heading
        expect(screen.getByText('Budgets')).toBeInTheDocument();

        // Check that each mocked BudgetItem is rendered
        mockBudgets.forEach((budget) => {
            expect(screen.getByText(budget.budgetDescription)).toBeInTheDocument();
        });

        // Alternatively, check for the presence of mocked BudgetItem components
        const budgetItems = screen.queryAllByTestId('mock-budget-item');
        expect(budgetItems.length).toBe(mockBudgets.length);
    });

    // Display No Budgets Message
    it('displays a message when no budgets are available', () => {
        render(
            <I18nextProvider i18n={i18next}>
            <BudgetList budgets={[]} />
            </I18nextProvider>);


        expect(screen.getByText('No budgets available')).toBeInTheDocument();
    });

    // Ensure BudgetList does not re-render unnecessarily
    it('renders consistently with the same props', () => {
        const { container: firstRender } = render(<BudgetList budgets={mockBudgets} />);
        const firstRenderOutput = firstRender.innerHTML;

        const { container: secondRender } = render(<BudgetList budgets={mockBudgets} />);
        const secondRenderOutput = secondRender.innerHTML;

        expect(firstRenderOutput).toEqual(secondRenderOutput);
    });
});
