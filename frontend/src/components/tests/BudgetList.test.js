import React from 'react';
import { render, screen } from '@testing-library/react';
import BudgetList from '../BudgetList';

// Mock the BudgetItem component
jest.mock('../BudgetItem', () => (props) => <div data-testid="mock-budget-item">{props.budget.budgetDescription}</div>);

describe('BudgetList', () => {
    const mockBudgets = [
        { budgetId: 1, budgetDescription: 'Groceries', budgetAmount: 300 },
        { budgetId: 2, budgetDescription: 'Utilities', budgetAmount: 150 }
    ];

    it('renders a list of budget items', () => {
        render(<BudgetList budgets={mockBudgets} />);

        // Check for the "Budgets" heading
        expect(screen.getByText('Budgets')).toBeInTheDocument();

        // Check that each mocked BudgetItem is rendered
        mockBudgets.forEach((budget) => {
            expect(screen.getByText(budget.budgetDescription)).toBeInTheDocument();
        });

        // Alternatively, check for the presence of mocked BudgetItem components
        const budgetItems = screen.queryAllByTestId('mock-budget-item');
        expect(budgetItems.length).toBe(mockBudgets.length);
    });

    it('displays a message when no budgets are available', () => {
        render(<BudgetList budgets={[]} />);

        expect(screen.getByText('No budgets available')).toBeInTheDocument();
    });

    it('displays a message when the budgets prop is not an array', () => {
        // @ts-ignore to simulate incorrect prop types
        render(<BudgetList budgets={null} />);

        expect(screen.getByText('No budgets available')).toBeInTheDocument();
    });
});
