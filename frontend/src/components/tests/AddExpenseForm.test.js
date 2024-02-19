import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import AddExpenseForm from '../AddExpenseForm'; // Adjust the import path as necessary
import { ExpenseContext } from '../../contexts/ExpenseContext';
import { calculateTotalSpent } from '../../helpers/HelperFunctions';
import {useUserContext} from "../../contexts/UserContext";

jest.mock('../../helpers/HelperFunctions', () => ({
    calculateTotalSpent: jest.fn(),
}));

jest.mock('../../contexts/UserContext', () => ({
    useUserContext: jest.fn(),
}));

// Mock data
const mockBudgets = [
    { budgetId: 1, budgetDescription: 'Groceries', budgetAmount: 500 },
    { budgetId: 2, budgetDescription: 'Utilities', budgetAmount: 150 },
];

const mockAddNewExpense = jest.fn();
const mockResetError = jest.fn();

// Mock context provider wrapper
const Wrapper = ({ children }) => (
    <ExpenseContext.Provider value={{
        addNewExpense: mockAddNewExpense,
        expenses: [],
        error: null,
        resetError: mockResetError,
    }}>
        {children}
    </ExpenseContext.Provider>
);

describe('AddExpenseForm', () => {

    let originalConsoleError;

    beforeEach(() => {
        mockAddNewExpense.mockClear();
        mockResetError.mockClear();
        calculateTotalSpent.mockClear();
        originalConsoleError = console.error;
        console.error = jest.fn(); // Mock console.error
        useUserContext.mockReturnValue({
            user: { id: 'user1', name: 'Test User' },
        });
        jest.clearAllMocks();
    });

    afterEach(() => {
        console.error = originalConsoleError; // Restore original console.error
    });

    // Create Budget with Valid Inputs
    it('submits the form with valid data', async () => {
        calculateTotalSpent.mockReturnValue(100); // Assuming $100 already spent

        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        // Fill the form
        fireEvent.change(screen.getByPlaceholderText('e.g., Walmart'), { target: { value: 'Coffee' } });
        fireEvent.change(screen.getByPlaceholderText('e.g., 150.47'), { target: { value: '5' } });
        fireEvent.change(screen.getByLabelText('Budget Category'), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-02-06' } });

        // Wrap the click event in act() and use await for any promises to resolve
        await act(async () => {
            fireEvent.click(screen.getByText('Add Expense'));
        });

        // Assertions can be made after the act block if needed
        expect(mockAddNewExpense).toHaveBeenCalledWith({
            description: 'Coffee',
            amount: 5,
            date: '2024-02-06T00:00:00.000Z',
            budgetId: '1',
        });
    });

    // Add Expense without Required Fields
    it('shows an alert when trying to submit the form without all required fields', async () => {
        window.alert = jest.fn(); // Mocking alert

        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        await act(async () => {
            // Attempt to submit without filling in the fields
            fireEvent.click(screen.getByText('Add Expense'));
        });

        expect(window.alert).toHaveBeenCalledWith('Please fill in all fields.');
    });

    // Add Expense with Non-existent Budget
    it('shows an alert when a non-existent budget is selected', async () => {
        window.alert = jest.fn(); // Mocking alert

        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        await act(async () => {
            fireEvent.change(screen.getByLabelText('Budget Category'), { target: { value: '999' } }); // Non-existent budget ID
            fireEvent.click(screen.getByText('Add Expense'));
        });

        expect(window.alert).toHaveBeenCalledWith('Please fill in all fields.');
    });

    // Add Expense with Exceeded Budget
    it('shows a confirm dialog when the expense exceeds the remaining budget', async () => {
        window.confirm = jest.fn(() => true); // Mock confirm to simulate user agreement
        calculateTotalSpent.mockReturnValue(450); // Mock total spent to simulate exceeding budget

        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText('e.g., Walmart'), { target: { value: 'Groceries' } });
            fireEvent.change(screen.getByPlaceholderText('e.g., 150.47'), { target: { value: '100' } }); // Exceeds budget
            fireEvent.change(screen.getByLabelText('Budget Category'), { target: { value: '1' } });
            fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-02-06' } });
            fireEvent.click(screen.getByText('Add Expense'));
        });

        expect(window.confirm).toHaveBeenCalledWith("This expense exceeds your remaining budget. Do you want to proceed?");
        expect(mockAddNewExpense).toHaveBeenCalled(); // Assuming user confirms to proceed
    });

    // Add Expense with Server Error
    it('displays an error message when there is a server error during submission', async () => {
        mockAddNewExpense.mockRejectedValue(new Error('Server error')); // Simulate server error
        window.alert = jest.fn(); // Mocking alert

        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        await act(async () => {
            // Fill in form and submit
            fireEvent.change(screen.getByPlaceholderText('e.g., Walmart'), { target: { value: 'Internet' } });
            fireEvent.change(screen.getByPlaceholderText('e.g., 150.47'), { target: { value: '60' } });
            fireEvent.change(screen.getByLabelText('Budget Category'), { target: { value: '2' } });
            fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-02-06' } });
            fireEvent.click(screen.getByText('Add Expense'));
        });

        expect(window.alert).toHaveBeenCalledWith('Failed to add expense. Please try again.');
    });

    //  Reset Form Fields after Submission
    it('resets the form fields after a successful expense submission', async () => {
        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        await act(async () => {
            // Fill in the form with valid data and submit
            fireEvent.change(screen.getByPlaceholderText('e.g., Walmart'), { target: { value: 'Dinner' } });
            fireEvent.change(screen.getByPlaceholderText('e.g., 150.47'), { target: { value: '80' } });
            fireEvent.change(screen.getByLabelText('Budget Category'), { target: { value: '1' } });
            fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2024-02-06' } });
            fireEvent.click(screen.getByText('Add Expense'));
        });

        // Check if the form fields are reset
        expect(screen.getByPlaceholderText('e.g., Walmart').value).toBe('');
        expect(screen.getByPlaceholderText('e.g., 150.47').value).toBe('');
        expect(screen.getByLabelText('Date').value).toBe('');
    });

    //  Display Context Error
    it('displays a context-provided error message', () => {
        // Override the context to include an error message
        const errorWrapper = ({ children }) => (
            <ExpenseContext.Provider value={{
                addNewExpense: mockAddNewExpense,
                expenses: [],
                error: 'Network Error',
                resetError: mockResetError,
            }}>
                {children}
            </ExpenseContext.Provider>
        );

        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: errorWrapper });

        expect(screen.getByText('Network Error')).toBeInTheDocument();
    });

    // Reset Error on Form Submission
    it('resets any context-provided error on form submission', async () => {
        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });

        await act(async () => {
            // Trigger form submission (assumed valid data is filled)
            fireEvent.click(screen.getByText('Add Expense'));
        });

        expect(mockResetError).toHaveBeenCalled();
    });

});
