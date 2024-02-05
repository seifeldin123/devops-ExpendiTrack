import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import BudgetItem from '../BudgetItem';
import { useUserContext } from '../../contexts/UserContext'; // Import useUserContext

// Mock the useUserContext hook
jest.mock('../../contexts/UserContext', () => ({
    useUserContext: jest.fn(),
}));

describe('BudgetItem', () => {
    const mockBudget = {
        id: 1,
        budgetDescription: 'Test Budget',
        budgetAmount: 1000,
        spent: 400,
        remaining: 600,
    };

    // Define mockUser outside of beforeEach for access in both test cases
    const mockUser = { id: 123 }; // Example user ID

    beforeEach(() => {
        // Setup mock user data before each test
        useUserContext.mockImplementation(() => ({ user: mockUser }));
    });

    it('renders budget information', () => {
        render(
            <MemoryRouter>
                <BudgetItem budget={mockBudget} />
            </MemoryRouter>
        );

        expect(screen.getByText(mockBudget.budgetDescription)).toBeInTheDocument();
        expect(screen.getByText(`Budgeted: ${mockBudget.budgetAmount}`)).toBeInTheDocument();
        expect(screen.getByText(`Spent: ${mockBudget.spent}`)).toBeInTheDocument();
        expect(screen.getByText(`Remaining: ${mockBudget.remaining}`)).toBeInTheDocument();
    });

    it('renders a link to view budget details with the correct user ID', () => {
        render(
            <MemoryRouter>
                <BudgetItem budget={mockBudget} />
            </MemoryRouter>
        );

        // Ensure the link to budget details includes the mocked user ID
        expect(screen.getByRole('link')).toHaveAttribute('href', `/budgets/user/${mockUser.id}`);
    });
});
