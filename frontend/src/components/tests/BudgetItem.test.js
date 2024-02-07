import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BudgetItem from '../BudgetItem';
import { UserContext } from '../../contexts/UserContext';
import { ExpenseContext } from '../../contexts/ExpenseContext';

// Mock data
const mockUser = { id: 1, name: 'Jane Doe' };
const mockBudget = {
    budgetId: 1,
    budgetDescription: 'Groceries',
    budgetAmount: 500
};
const mockExpenses = [
    {
        expensesId: 2,
        expensesDescription: "Coffee",
        expensesAmount: 5,
        expensesDate: "2024-02-06T10:00:00Z",
        budget: {
            budgetId: 1,
            budgetDescription: "Groceries",
            budgetAmount: 500,
            user: mockUser
        }
    }
];

describe('BudgetItem', () => {
    it('renders budget information and calculations correctly', () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user: mockUser }}>
                    <ExpenseContext.Provider value={{ expenses: mockExpenses }}>
                        <BudgetItem budget={mockBudget} />
                    </ExpenseContext.Provider>
                </UserContext.Provider>
            </MemoryRouter>
        );

        // Assertions
        expect(screen.getByText(mockBudget.budgetDescription)).toBeInTheDocument();
        expect(screen.getByText(`Budgeted: $${mockBudget.budgetAmount}.00`)).toBeInTheDocument();
        expect(screen.getByText(`Spent: $5.00`)).toBeInTheDocument();
        expect(screen.getByText(/Remaining:/)).toBeInTheDocument();
        expect(screen.getByText('1.00%')).toBeInTheDocument(); // Assuming the percentSpent calculation is correct
        expect(screen.getByRole('link')).toHaveAttribute('href', `/budgets/user/${mockUser.id}`);
    });
});
