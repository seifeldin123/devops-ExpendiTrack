import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { BudgetContext } from '../../contexts/BudgetContext'; // Adjust the import path as necessary
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
    const mockUser = { name: 'John Doe' };
    // Define mock budget data
    const mockBudgets = [
        { id: 1, budgetDescription: 'Groceries', budgetAmount: 300 },
        // Add more mock budgets as needed
    ];

    it('displays a welcome message to the logged-in user', () => {
        render(
            <Router>
                <UserContext.Provider value={{ user: mockUser }}>
                    <BudgetContext.Provider value={{
                        budgets: mockBudgets,
                        addNewBudget: jest.fn(),
                        fetchBudgets: jest.fn(),
                        error: '',
                        resetError: jest.fn()
                    }}>
                        <Dashboard />
                    </BudgetContext.Provider>
                </UserContext.Provider>
            </Router>
        );

        // Check if the welcome message is displayed for the mock user
        expect(screen.getByText(`Welcome, ${mockUser.name}!`)).toBeInTheDocument();
    });
});
