import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import AddExpenseForm from '../AddExpenseForm';
import {ExpenseContext} from '../../contexts/ExpenseContext';
import i18next from "i18next";
import en from "../../translations/en/common.json";
import fr from "../../translations/fr/common.json";
import {I18nextProvider, initReactI18next} from 'react-i18next';
import enTranslations from "../../translations/en/common.json";
import frTranslations from "../../translations/fr/common.json";


jest.mock('../../helpers/HelperFunctions', () => ({
    calculateTotalSpent: jest.fn(),
    formatDate: jest.fn(),
    formatCurrency: jest.fn(),
}));

jest.mock('../../components/ExpenseList', () => ({
    resetError: jest.fn(),
}));

jest.mock('../../contexts/UserContext', () => ({
    useUserContext: () => ({
        user: { id: 'user1', name: 'Test User' },
    }),
}));

const mockSetError = jest.fn();

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

// Mock data and functions
const mockBudgets = [
    { budgetId: 1, budgetDescription: 'Groceries', budgetAmount: 500 },
    { budgetId: 2, budgetDescription: 'Utilities', budgetAmount: 150 },
];

const mockAddNewExpense = jest.fn();
const mockResetError = jest.fn();
const mockFetchExpenses = jest.fn();

// Mock context provider wrapper
const Wrapper = ({ children }) => (
    <ExpenseContext.Provider value={{
        addNewExpense: mockAddNewExpense,
        expenses: [],
        error: null,
        resetError: mockResetError,
        fetchExpenses: mockFetchExpenses,
    }}>
        {children}
    </ExpenseContext.Provider>
);

describe('AddExpenseForm Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });



    it('submits the form with valid data', async () => {
        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        fireEvent.change(screen.getByPlaceholderText('e.g., Walmart'), { target: { value: 'Coffee' } });
        fireEvent.change(screen.getByPlaceholderText('e.g., 150.47'), { target: { value: '5' } });
        fireEvent.change(screen.getByTestId('expense-date'), { target: { value: '2024-02-06' } });

        await act(async () => {
            fireEvent.click(screen.getByTestId('create-expense'));
        });

        expect(mockAddNewExpense).toHaveBeenCalledWith({
            expensesDescription: 'Coffee',
            expensesAmount: 5,
            expensesDate: '2024-02-06T00:00:00.000Z',
            budget: { budgetId: 1 }
        });
    });


    it('blocks submission with incomplete data due to browser validation', async () => {
        const { getByTestId } = render(
            <I18nextProvider i18n={i18next}>
                <AddExpenseForm budgets={mockBudgets} />
            </I18nextProvider>,
            { wrapper: Wrapper }
        );
        fireEvent.change(getByTestId('expense-date'), { target: { value: '2024-03-12' } });
        // Don't fill 'amount' or 'date' to trigger browser validation

        await act(async () => {
            fireEvent.submit(getByTestId('create-expense'));
        });

        expect(mockAddNewExpense).toHaveBeenCalled();

        expect(getByTestId('expense-description').checkValidity()).toBe(false);
        expect(getByTestId('expense-amount-input').checkValidity()).toBe(false);
        expect(getByTestId('expense-date').checkValidity()).toBe(false);
    });



    it('allows submission with all required fields filled', async () => {
        const { getByTestId, getByPlaceholderText } = render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        // Simulate filling out all fields
        fireEvent.change(getByTestId('expense-description'), { target: { value: 'Test Expense' } });
        fireEvent.change(getByPlaceholderText('e.g., 150.47'), { target: { value: '100' } });
        fireEvent.change(getByTestId('expense-date'), { target: { value: '2024-02-06' } });

        // Attempt to submit the form
        await act(async () => {
            fireEvent.submit(getByTestId('create-expense'));
        });

        // Verify `addNewExpense` was called with expected data
        expect(mockAddNewExpense).toHaveBeenCalledWith(expect.objectContaining({
            expensesDescription: 'Test Expense',
            expensesAmount: 100,
            expensesDate: '2024-02-06T00:00:00.000Z',
            budget: { budgetId: mockBudgets[0].budgetId },
        }));
    });


    it('shows a warning modal when the expense amount exceeds the selected budget limit', async () => {
        render(
            <I18nextProvider i18n={i18next}>
                <AddExpenseForm budgets={mockBudgets} />
            </I18nextProvider>,
                { wrapper: Wrapper });

        fireEvent.change(screen.getByPlaceholderText('e.g., Walmart'), { target: { value: 'Big Shopping' } });
        fireEvent.change(screen.getByPlaceholderText('e.g., 150.47'), { target: { value: '600' } });
        fireEvent.change(screen.getByTestId('expense-date'), { target: { value: '2024-02-06' } });

        await act(async () => {
            fireEvent.click(screen.getByTestId('create-expense'));
        });

        expect(screen.getByText(/exceeds your budget/i)).toBeInTheDocument();
    });

    it('displays an error message when there is a server error during submission', async () => {
        const testErrorMessage = 'Invalid input: expenses amount cannot be negative.';

        render(
            <ExpenseContext.Provider value={{
                addNewExpense: mockAddNewExpense.mockRejectedValue(new Error(testErrorMessage)),
                expenses: [],
                error: testErrorMessage,
                resetError: mockResetError,
                fetchExpenses: mockFetchExpenses,
                setError: mockSetError, // Provide the mock setError function
            }}>
                <I18nextProvider i18n={i18next}>
                    <AddExpenseForm budgets={mockBudgets} />
                </I18nextProvider>
            </ExpenseContext.Provider>
        );

        fireEvent.change(screen.getByPlaceholderText('e.g., Walmart'), { target: { value: 'Internet' } });
        fireEvent.change(screen.getByPlaceholderText('e.g., 150.47'), { target: { value: '60' } });
        fireEvent.change(screen.getByTestId('expense-date'), { target: { value: '2024-02-06' } });

        await act(async () => {
            fireEvent.click(screen.getByTestId('create-expense'));
        });

        expect(screen.getByText(testErrorMessage)).toBeInTheDocument();
        expect(mockSetError).toHaveBeenCalledWith(expect.objectContaining({ message: testErrorMessage }));
    });

    it('resets the form fields after a successful expense submission', async () => {
        // Assuming form fields are reset after submission. This logic might need adjustment.
        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        fireEvent.change(screen.getByPlaceholderText('e.g., Walmart'), { target: { value: 'Dinner' } });
        fireEvent.change(screen.getByPlaceholderText('e.g., 150.47'), { target: { value: '80' } });

        fireEvent.change(screen.getByTestId('expense-date'), { target: { value: '2024-02-06' } });

        await act(async () => {
            fireEvent.click(screen.getByTestId('create-expense'));
        });

        expect(screen.getByPlaceholderText('e.g., Walmart').value).toBe('');
        expect(screen.getByPlaceholderText('e.g., 150.47').value).toBe('');
        expect(screen.getByTestId('expense-date').value).toBe('');
    });

    it('resets any context-provided error on form submission', async () => {
        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        await act(async () => {
            fireEvent.click(screen.getByTestId('create-expense'));
        });

        expect(mockResetError).toHaveBeenCalled();
    });

});
