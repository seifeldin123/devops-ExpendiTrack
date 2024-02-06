import React from 'react';
import {act, render, screen, waitFor} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { BudgetContext } from '../../contexts/BudgetContext';
import { ExpenseProvider } from '../../contexts/ExpenseContext';
import Dashboard from '../Dashboard';
import {createExpense, getUserExpenses} from "../../services/ExpenseService";

// Mock the service functions if they're not directly using axios within the component
jest.mock('../../services/ExpenseService', () => ({
    getUserExpenses: jest.fn(),
    createExpense: jest.fn()
}));

describe('Dashboard', () => {

    beforeEach(() => {
        // Reset mocks before each test
        getUserExpenses.mockClear();
        createExpense.mockClear();

        // Setup mock implementations or resolved values
        getUserExpenses.mockResolvedValue({ data: mockExpenses });
        createExpense.mockResolvedValue({ /* Mocked response for creating an expense */ });
    });


    const mockUser = { id: 1, name: 'John Doe' };
    const mockBudgets = [
        { id: 1, title: 'Groceries', amount: 300 },
        { id: 2, title: 'Utilities', amount: 100 },
    ];
    const mockExpenses = [
        { id: 1, description: 'Milk', amount: 5, date: '2024-01-01', budgetId: 1 },
        { id: 2, description: 'Internet', amount: 50, date: '2024-01-02', budgetId: 2 },
    ];

    it('displays a welcome message and fetches budgets and expenses on user login', async () => {
        const fetchBudgetsMock = jest.fn();
        const fetchExpensesMock = jest.fn();

        await act(async () => {
            render(
                <Router>
                    <UserContext.Provider value={{user: mockUser}}>
                        <BudgetContext.Provider value={{budgets: mockBudgets, fetchBudgets: fetchBudgetsMock}}>
                            <ExpenseProvider value={{expenses: mockExpenses, fetchExpenses: fetchExpensesMock}}>
                                <Dashboard/>
                            </ExpenseProvider>
                        </BudgetContext.Provider>
                    </UserContext.Provider>
                </Router>
            );
        });

        await waitFor(() => {
            // Assertions
            expect(screen.getByText(`Welcome, ${mockUser.name}!`)).toBeInTheDocument();
        });
    });
});
