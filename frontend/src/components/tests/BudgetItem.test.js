import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BudgetItem from '../BudgetItem';
import { useUserContext } from '../../contexts/UserContext';

// Mock the useUserContext hook
jest.mock('../../contexts/UserContext', () => ({
    useUserContext: jest.fn(),
}));

describe('BudgetItem', () => {
    const mockBudget = {
        budgetId: 1,
        budgetDescription: 'Mock Budget',
        budgetAmount: 1000,
    };

    it('renders budget information and link to details correctly', () => {
        // Setup mock user data
        const mockUser = { id: 123 }; // Example user ID
        useUserContext.mockImplementation(() => ({ user: mockUser }));

        render(
            <Router>
                <BudgetItem budget={mockBudget} />
            </Router>
        );

        // Validate if the budget description is rendered
        expect(screen.getByText(mockBudget.budgetDescription)).toBeInTheDocument();

        // Validate if the budget amount is rendered correctly
        expect(screen.getByText(`Budgeted: ${mockBudget.budgetAmount}`)).toBeInTheDocument();

        // Validate if the link to the budget details includes the correct user ID
        expect(screen.getByRole('link')).toHaveAttribute('href', `/budgets/user/${mockUser.id}`);
    });
});
