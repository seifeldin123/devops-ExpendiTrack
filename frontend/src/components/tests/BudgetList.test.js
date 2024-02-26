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

    // Display Budget List
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

    // Display No Budgets Message
    it('displays a message when no budgets are available', () => {
        render(<BudgetList budgets={[]} />);

        expect(screen.getByText('No budgets available')).toBeInTheDocument();
    });

    // Ensure BudgetList does not re-render unnecessarily
    it('renders consistently with the same props', () => {
        const { container: firstRender } = render(<BudgetList budgets={mockBudgets} />);
        const firstRenderOutput = firstRender.innerHTML;

        const { container: secondRender } = render(<BudgetList budgets={mockBudgets} />);
        const secondRenderOutput = secondRender.innerHTML;

        expect(firstRenderOutput).toEqual(secondRenderOutput);
    });
});
