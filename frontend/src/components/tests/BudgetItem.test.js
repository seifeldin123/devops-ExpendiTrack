import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BudgetItem from '../BudgetItem';
import { UserContext } from '../../contexts/UserContext';
import { ExpenseContext } from '../../contexts/ExpenseContext';
import { useBudgetContext } from "../../contexts/BudgetContext";

const mockRemoveBudget = jest.fn();
const mockResetError = jest.fn();

// Mock the useBudgetContext hook
jest.mock("../../contexts/BudgetContext", () => ({
    useBudgetContext: jest.fn(() => ({
        removeBudget: mockRemoveBudget,
        resetError: mockResetError,
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

const renderWithProviders = (ui, { user = mockUser, expenses = mockExpenses, budget = mockBudget } = {}) => {
    useBudgetContext.mockReturnValue({
        removeBudget: mockRemoveBudget,
        resetError: mockResetError,
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
        renderWithProviders(<BudgetItem budget={mockBudget} />);

        // Assertions
        expect(screen.getByText(`Budget Name: ${mockBudget.budgetDescription}`)).toBeInTheDocument();
        expect(screen.getByText(`Budgeted Amount: $${mockBudget.budgetAmount}.00`)).toBeInTheDocument();
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

    it('shows the edit modal with the correct data when the edit button is clicked', async () => {
        const { getByText, getByRole } = renderWithProviders(<BudgetItem budget={mockBudget} />);
        fireEvent.click(getByText('Edit Budget'));
        expect(getByRole('dialog')).toHaveTextContent('Edit Budget');
        expect(screen.getByDisplayValue(mockBudget.budgetDescription)).toBeInTheDocument();
    });

    it('shows the delete confirmation modal when the delete button is clicked', async () => {
        const { getByText, queryByRole } = renderWithProviders(<BudgetItem budget={mockAnotherBudget} />);
        fireEvent.click(getByText('Delete Budget'));
        expect(queryByRole('dialog')).toHaveTextContent('Confirm Deletion');
    });

    it('calls removeBudget with the correct budgetId on delete confirmation', async () => {
        renderWithProviders(<BudgetItem budget={mockAnotherBudget} />);

        // Open the delete confirmation modal
        fireEvent.click(screen.getByText('Delete Budget'));

        fireEvent.click(screen.getByText('Confirm Delete'));

        // Now check if removeBudget was called with the correct budgetId
        expect(mockRemoveBudget).toHaveBeenCalledWith(mockAnotherBudget.budgetId);
    });

});