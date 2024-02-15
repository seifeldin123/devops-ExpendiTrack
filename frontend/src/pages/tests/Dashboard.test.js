import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { BudgetContext } from '../../contexts/BudgetContext';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import Dashboard from '..//Dashboard';
import axios from 'axios';

// Mock axios for all tests in this file
jest.mock('axios');

describe('Dashboard Component', () => {
    const mockUser = {
        id: 1,
        name: 'Harmeet',
        email: 'Harmeet@gmail.com'
    };

    const mockBudget = {
        budgetId: 1,
        budgetDescription: 'Groceries',
        budgetAmount: 500,
    };

    const mockExpense = {
        expensesId: 2,
        expensesDescription: "Coffee",
        expensesAmount: 5,
        expensesDate: "2024-02-06T10:00:00Z",
        budget: mockBudget
    };

    beforeEach(() => {
        // Setup initial context values and mock API responses
        axios.get.mockResolvedValueOnce({ data: [mockExpense] }); // Mock fetching expenses
    });

    it('renders user expenses data correctly', async () => {
        render(
            <Router>
                <UserContext.Provider value={{ user: mockUser }}>
                    <BudgetContext.Provider value={{ budgets: [mockBudget], fetchBudgets: jest.fn() }}>
                        <ExpenseContext.Provider value={{ expenses: [mockExpense], fetchExpenses: jest.fn() }}>
                            <Dashboard />
                        </ExpenseContext.Provider>
                    </BudgetContext.Provider>
                </UserContext.Provider>
            </Router>
        );

        // Wait for the component to receive the mocked response and update the UI
        await waitFor(() => {
            expect(screen.getByText("Coffee")).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /Groceries/i })).toBeInTheDocument();
            expect(screen.getByText("$5.00")).toBeInTheDocument(); // Assuming formatCurrency function formats it this way
        });

        // Validate if the user's name is rendered
        expect(screen.getByText('Welcome, Harmeet!')).toBeInTheDocument();
    });
});
