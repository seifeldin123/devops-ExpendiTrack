import React from 'react';
import { render, act, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseProvider, useExpenseContext } from '../ExpenseContext';
import { useUserContext } from '../UserContext';

import * as ExpenseService from '../../services/ExpenseService';

jest.mock('../UserContext');
jest.mock('../../services/ExpenseService');

describe('ExpenseContext Integration Tests', () => {

    let originalConsoleError;

    const mockUser = { id: 1, name: 'John Doe' };
    const initialExpenses = [
        { id: 1, expensesDescription: 'Groceries', expensesAmount: 150, expensesDate: '2024-02-14', budget: { budgetId: 1 } },
        { id: 2, expensesDescription: 'Utilities', expensesAmount: 100, expensesDate: '2024-02-15', budget: { budgetId: 2 } },
    ];

    beforeEach(() => {
        useUserContext.mockReturnValue({ user: mockUser });
        ExpenseService.getUserExpenses.mockReset();
        ExpenseService.createExpense.mockReset();
        originalConsoleError = console.error;
        console.error = jest.fn(); // Mock console.error
    });

    afterEach(() => {
        console.error = originalConsoleError; // Restore original console.error
    });

    it('fetches and displays user-specific expenses upon user change', async () => {
        ExpenseService.getUserExpenses.mockResolvedValueOnce(initialExpenses);

        const TestComponent = () => {
            const { expenses } = useExpenseContext();
            return (
                <div>
                    {expenses.map(expense => (
                        <div key={expense.id}>{expense.expensesDescription} - ${expense.expensesAmount}</div>
                    ))}
                </div>
            );
        };

        await act(async () => {
            render(
                <ExpenseProvider>
                    <TestComponent />
                </ExpenseProvider>
            );
        });

        await waitFor(() => {
            expect(ExpenseService.getUserExpenses).toHaveBeenCalledWith(mockUser.id);
            expect(screen.getByText('Groceries - $150')).toBeInTheDocument();
            expect(screen.getByText('Utilities - $100')).toBeInTheDocument();
        });
    });

    it('adds a new expense and updates context accordingly', async () => {
        const newExpense = {
            id: 3,
            expensesDescription: 'Entertainment',
            expensesAmount: 250,
            expensesDate: '2024-02-20',
            budget: { budgetId: 3 },
            userId: mockUser.id,
        };

        ExpenseService.createExpense.mockResolvedValueOnce({ data: newExpense });

        const TestComponent = () => {
            const { addNewExpense, expenses } = useExpenseContext();
            return (
                <>
                    <button onClick={() => addNewExpense(newExpense)}>Add Expense</button>
                    {expenses.map(expense => (
                        <div key={expense.id}>{expense.expensesDescription} - ${expense.expensesAmount}</div>
                    ))}
                </>
            );
        };

        await act(async () => {
            render(
                <ExpenseProvider>
                    <TestComponent />
                </ExpenseProvider>
            );
        });

        await act(async () => {
            userEvent.click(screen.getByText('Add Expense'));
        });

        await waitFor(() => {
            expect(ExpenseService.createExpense).toHaveBeenCalledWith(expect.objectContaining(newExpense));
            expect(screen.getByText('Entertainment - $250')).toBeInTheDocument();
        });
    });

    it('handles errors when fetching expenses fails', async () => {
        const errorMessage = 'Failed to fetch expenses';
        ExpenseService.getUserExpenses.mockRejectedValueOnce(new Error(errorMessage));

        const TestComponent = () => {
            const { error } = useExpenseContext();
            return <div>{error}</div>;
        };

        await act(async () => {
            render(
                <ExpenseProvider>
                    <TestComponent />
                </ExpenseProvider>
            );
        });

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
