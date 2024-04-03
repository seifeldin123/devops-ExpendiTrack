import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BudgetItem from '../BudgetItem';
import { UserContext } from '../../contexts/UserContext';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import { useBudgetContext } from "../../contexts/BudgetContext";
import userEvent from "@testing-library/user-event";
import i18next from "i18next";
import en from "../../translations/en/common.json";
import fr from "../../translations/fr/common.json";
import {I18nextProvider, initReactI18next} from 'react-i18next';
import enTranslations from "../../translations/en/common.json";
import frTranslations from "../../translations/fr/common.json";

const mockRemoveBudget = jest.fn();
const mockResetError = jest.fn();
const mockEnableFormPopulation = jest.fn();
const mockDisableFormPopulation = jest.fn();



// Mock the useBudgetContext hook
jest.mock("../../contexts/BudgetContext", () => ({
    useBudgetContext: jest.fn(() => ({
        removeBudget: mockRemoveBudget,
        resetError: mockResetError,
        enableFormPopulation: mockEnableFormPopulation,
        // Mimic enabling form population
        shouldPopulateForm: true,
    })),
}));

const mockUser = { id: 1, name: 'Jane Doe' };

const mockBudget = {
    budgetId: 1,
    budgetDescription: 'Groceries',
    budgetAmount: 500
};

const mockAnotherBudget = {
    budgetId: 2,
    budgetDescription: 'Groceries',
    budgetAmount: 500
};

const mockExpenses = [
    {
        expensesId: 2,
        expensesDescription: "Coffee",
        expensesAmount: 5,
        expensesDate: "2024-02-06T10:00:00Z",
        budget: mockBudget
    }
];

const mockAnotherExpense = [
    {
        expensesId: 3,
        expensesDescription: "Coffee",
        expensesAmount: 5,
        expensesDate: "2024-02-06T10:00:00Z",
        budget: mockAnotherBudget
    }
];

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

const renderWithProviders = (ui, { user = mockUser, expenses = mockExpenses, budget = mockBudget } = {}) => {
    useBudgetContext.mockReturnValue({
        removeBudget: mockRemoveBudget,
        resetError: mockResetError,
        enableFormPopulation: mockEnableFormPopulation,
        disableFormPopulation: mockDisableFormPopulation,
        // Include other context values and functions as needed
    });

    return render(
        <MemoryRouter>
            <UserContext.Provider value={{ user }}>
                <ExpenseContext.Provider value={{ expenses }}>
                    {ui}
                </ExpenseContext.Provider>
            </UserContext.Provider>
        </MemoryRouter>
    );
};

describe('BudgetItem', () => {

    // Display Budget Details and Calculate Remaining Budget
    it('renders budget information and calculations correctly', () => {
        renderWithProviders(
            <I18nextProvider i18n={i18next}>
                <BudgetItem budget={mockBudget} />
            </I18nextProvider>
        );

        // Assertions
        expect(screen.getByText(`Budget Name: ${mockBudget.budgetDescription}`)).toBeInTheDocument();
        expect(screen.getByText(`Budget Amount: $${mockBudget.budgetAmount}.00`)).toBeInTheDocument();
        expect(screen.getByText(`Spent: $5.00`)).toBeInTheDocument();
        expect(screen.getByText(/Remaining:/)).toBeInTheDocument();

    });

    // Display Overspent Status
    it('displays overspent status when expenses exceed the budget amount', () => {
        const overspentExpenses = [{ ...mockExpenses[0], expensesAmount: 600 }];
        renderWithProviders(
            <I18nextProvider i18n={i18next}>
            <BudgetItem budget={mockBudget} />
            </I18nextProvider>,
                { expenses: overspentExpenses });

        expect(screen.getByText('Overspent: $100.00')).toBeInTheDocument();
        expect(screen.getByText('Overspent: $100.00').className).toContain('text-danger');
    });


    // Display Remaining Status
    it('displays remaining status when expenses are less than the budget amount', () => {
        renderWithProviders(
            <I18nextProvider i18n={i18next}>
                <BudgetItem budget={mockBudget} />
            </I18nextProvider>
        ); // Using mockExpenses which are less than budget

        expect(screen.getByText(/Remaining: \$495.00/)).toBeInTheDocument();
        expect(screen.getByText(/Remaining: \$495.00/).className).toContain('text-success');
    });

    // Display Progress Bar
    it('displays progress bar with correct percentage based on expenses', () => {
        renderWithProviders(
            <I18nextProvider i18n={i18next}>
                <BudgetItem budget={mockBudget} />
            </I18nextProvider>
        );

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveStyle('width: 1%');
    });

    it('shows the edit modal with the correct data when the edit button is clicked', async () => {
        const { getByText, getByRole } = renderWithProviders(
            <I18nextProvider i18n={i18next}>
                <BudgetItem budget={mockBudget} />
            </I18nextProvider>
        );
        await act(async () => {
            userEvent.click(screen.getByText('Edit Budget'));
        });

        const modalTitle = await screen.findByTestId('modal-title-test-id');
        expect(modalTitle).toBeInTheDocument();
        expect(modalTitle).toHaveTextContent('Edit Budget');

        const budgetInput = await screen.findByDisplayValue(mockBudget.budgetDescription);
        expect(budgetInput).toBeInTheDocument();
    });



    it('shows the delete confirmation modal when the delete button is clicked', async () => {
        const { getByText, queryByRole } = renderWithProviders(
            <I18nextProvider i18n={i18next}>
                <BudgetItem budget={mockAnotherBudget} />
            </I18nextProvider>
        );
        await act(async () => {
            fireEvent.click(screen.getByText('Delete Budget'));
        });

        expect(queryByRole('dialog')).toHaveTextContent('Confirm Deletion');
    });

    it('calls removeBudget with the correct budgetId on delete confirmation', async () => {
        renderWithProviders(
            <I18nextProvider i18n={i18next}>
                <BudgetItem budget={mockAnotherBudget} />
            </I18nextProvider>
        );

        // Open the delete confirmation modal
        await act(async () => {
            fireEvent.click(screen.getByText('Delete Budget'));
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Confirm Delete'));
        });


        // Now check if removeBudget was called with the correct budgetId
        expect(mockRemoveBudget).toHaveBeenCalledWith(mockAnotherBudget.budgetId);
    });

});