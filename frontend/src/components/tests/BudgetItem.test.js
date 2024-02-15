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

const renderWithProviders = (ui, { user = mockUser, expenses = mockExpenses, budget = mockBudget } = {}) => {
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
        renderWithProviders(<BudgetItem budget={mockBudget} />);

        // Assertions
        expect(screen.getByText(mockBudget.budgetDescription)).toBeInTheDocument();
        expect(screen.getByText(`Budgeted: $${mockBudget.budgetAmount}.00`)).toBeInTheDocument();
        expect(screen.getByText(`Spent: $5.00`)).toBeInTheDocument();
        expect(screen.getByText(/Remaining:/)).toBeInTheDocument();
        expect(screen.getByText('1.00%')).toBeInTheDocument(); // Assuming the percentSpent calculation is correct
        expect(screen.getByRole('link')).toHaveAttribute('href', `/budgets/user/${mockUser.id}`);
    });

    // Display Overspent Status
    it('displays overspent status when expenses exceed the budget amount', () => {
        const overspentExpenses = [{ ...mockExpenses[0], expensesAmount: 600 }];
        renderWithProviders(<BudgetItem budget={mockBudget} />, { expenses: overspentExpenses });

        expect(screen.getByText('Overspent: $100.00')).toBeInTheDocument();
        expect(screen.getByText('100.00%')).toBeInTheDocument(); // Corrected to 100.00%
        expect(screen.getByText('Overspent: $100.00').className).toContain('text-danger');
    });


    // Display Remaining Status
    it('displays remaining status when expenses are less than the budget amount', () => {
        renderWithProviders(<BudgetItem budget={mockBudget} />); // Using mockExpenses which are less than budget

        expect(screen.getByText(/Remaining: \$495.00/)).toBeInTheDocument();
        expect(screen.getByText('1.00%')).toBeInTheDocument(); // Assuming correct percentage calculation
        expect(screen.getByText(/Remaining: \$495.00/).className).toContain('text-success');
    });

    // Display Progress Bar
    it('displays progress bar with correct percentage based on expenses', () => {
        renderWithProviders(<BudgetItem budget={mockBudget} />);

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveStyle('width: 1%');
        expect(progressBar.textContent).toEqual('1.00%');
    });

    // Navigate to Budget Details
    it('navigates to budget details on clicking "View Details"', () => {
        renderWithProviders(<BudgetItem budget={mockBudget} />);

        expect(screen.getByRole('link', { name: 'View Details' })).toHaveAttribute('href', `/budgets/user/${mockUser.id}`);
    });

});
