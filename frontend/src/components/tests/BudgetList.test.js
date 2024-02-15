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

    // it('does not re-render BudgetItem components unnecessarily due to memoization', () => {
    //     const { rerender } = render(<BudgetList budgets={mockBudgets} />);
    //
    //     // Mock implementation to count renders
    //     const initialRenderCount = jest.mock.calls.length;
    //
    //     // Rerender with the same props
    //     rerender(<BudgetList budgets={mockBudgets} />);
    //
    //     // Check if the BudgetItem mock was called more times than the initial render
    //     // This approach assumes jest.mock.calls.length increases with each render, which is conceptual and not directly applicable
    //     // Adjust according to your mock setup or testing strategy
    //     expect(jest.mock.calls.length).toBe(initialRenderCount); // This line is conceptual and will not work as-is
    //
    //     // A more applicable approach might involve using a spy or a specific mock function behavior that tracks calls
    //     // However, this requires a setup that allows tracking re-renders of mocked components, which is beyond RTL's direct capabilities
    // });

    // it('updates display when props change', () => {
    //     const initialProps = [{ budgetId: 1, budgetDescription: 'Groceries', budgetAmount: 100 }];
    //     const { getByText, rerender } = render(<BudgetList budgets={initialProps} />);
    //     expect(getByText('Groceries')).toBeInTheDocument();
    //
    //     const updatedProps = [{ budgetId: 1, budgetDescription: 'Groceries', budgetAmount: 200 }];
    //     rerender(<BudgetList budgets={updatedProps} />);
    //
    //     expect(getByText('Groceries - 200')).toBeInTheDocument();
    // });

});
