import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import AddExpenseForm from '../AddExpenseForm'; // Adjust the import path as necessary
import { ExpenseContext } from '../../contexts/ExpenseContext';
import { calculateTotalSpent } from '../../helpers/HelperFunctions';

jest.mock('../../helpers/HelperFunctions', () => ({
    calculateTotalSpent: jest.fn(),
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
    beforeEach(() => {
        mockAddNewExpense.mockClear();
        mockResetError.mockClear();
        calculateTotalSpent.mockClear();
    });

    it('renders correctly with initial state', () => {
        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });
        expect(screen.getByPlaceholderText('e.g., Walmart')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g., 150.47')).toBeInTheDocument();
        expect(screen.getByLabelText('Budget Category')).toHaveValue('');
    });

    it('updates input fields on user input', () => {
        render(<AddExpenseForm budgets={mockBudgets} />, { wrapper: Wrapper });
        fireEvent.change(screen.getByPlaceholderText('e.g., Walmart'), { target: { value: 'Coffee' } });
        expect(screen.getByPlaceholderText('e.g., Walmart')).toHaveValue('Coffee');
    });

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


});
