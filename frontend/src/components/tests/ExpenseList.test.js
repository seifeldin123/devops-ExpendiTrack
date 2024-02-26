import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {ExpenseProvider} from '../../contexts/ExpenseContext';
import { UserProvider } from '../../contexts/UserContext';
import ExpenseList from "../ExpenseList";

jest.mock('../../contexts/ExpenseContext', () => {
    // Mock removeExpense function
    const removeExpense = jest.fn();
    return {
        // Use actual implementations for other parts of the context
        ...jest.requireActual('../../contexts/ExpenseContext'),
        useExpenseContext: () => ({
            ...jest.requireActual('../../contexts/ExpenseContext').useExpenseContext(),
            removeExpense,
        }),
        // Export the mock so it can be referenced in assertions
        removeExpense,
    };
});

jest.mock('../../contexts/BudgetContext', () => ({
    useBudgetContext: () => ({
        fetchBudgets: jest.fn(),
    }),
}));

describe('ExpenseList Component', () => {
    const mockExpenses = [
        { expensesId: 1, expensesDescription: 'Coffee', expensesAmount: 5, expensesDate: '2024-02-06', budget: { budgetDescription: 'Daily Expenses' }},
        { expensesId: 2, expensesDescription: 'Books', expensesAmount: 15, expensesDate: '2024-02-07', budget: { budgetDescription: 'Education' }}
    ];

    it('renders a list of expenses correctly', () => {

        render(
            <UserProvider value={{ user: { id: 1, name: 'Test User' } }}>
                <ExpenseProvider>
                    <ExpenseList expenses={mockExpenses} />
                </ExpenseProvider>
            </UserProvider>
        );

        expect(screen.getByText('Coffee')).toBeInTheDocument();
        expect(screen.getByText('Books')).toBeInTheDocument();
        expect(screen.getByText('Daily Expenses')).toBeInTheDocument();
        expect(screen.getByText('Education')).toBeInTheDocument();
    });

    it('displays a message when no expenses are available', () => {
        render(
            <UserProvider value={{ user: { id: 1, name: 'Test User' } }}>
                <ExpenseProvider>
                    <ExpenseList expenses={[]} />
                </ExpenseProvider>
            </UserProvider>
        );
        expect(screen.getByText('No expenses available')).toBeInTheDocument();
    });

    it('renders consistently with the same props', () => {
        const { container: firstRender } = render(<ExpenseList expenses={mockExpenses} />);
        const firstRenderOutput = firstRender.innerHTML;

        const { container: secondRender } = render(<ExpenseList expenses={mockExpenses} />);
        const secondRenderOutput = secondRender.innerHTML;

        expect(firstRenderOutput).toEqual(secondRenderOutput);
    });

    it('opens delete confirmation modal on delete button click', async () => {
        render(
            <UserProvider value={{ user: { id: 1, name: 'Test User' } }}>
                <ExpenseProvider>
                    <ExpenseList expenses={mockExpenses} budgets={[]} />
                </ExpenseProvider>
            </UserProvider>
        );

        fireEvent.click(screen.getAllByText('Delete Expense')[0]);
        await waitFor(() => expect(screen.getByText('Confirm Deletion')).toBeInTheDocument());
    });


    it('confirms deletion of an expense on confirm delete button click', async () => {
        render(
            <UserProvider value={{ user: { id: 1, name: 'Test User' } }}>
                <ExpenseProvider>
                    <ExpenseList expenses={mockExpenses} budgets={[]} />
                </ExpenseProvider>
            </UserProvider>
        );

        fireEvent.click(screen.getAllByText('Delete Expense')[0]);
        await waitFor(() => screen.getByText('Confirm Deletion'));
        fireEvent.click(screen.getByText('Confirm Delete'));

        await waitFor(() => expect(removeExpense).toHaveBeenCalledWith(mockExpenses[0].expensesId));
    });

    it('shows the edit modal with correct data and closes on cancel', async () => {
        render(
            <UserProvider value={{ user: { id: 1, name: 'Test User' } }}>
                <ExpenseProvider>
                    <ExpenseList expenses={mockExpenses} budgets={[]} />
                </ExpenseProvider>
            </UserProvider>
        );

        // Trigger modal open
        fireEvent.click(screen.getAllByText('Edit Expense')[0]);

        // Wait for modal to open and check if it's displayed
        expect(screen.getByTestId('modal-title-test-id')).toBeInTheDocument();
        expect(screen.getByText('Coffee')).toBeInTheDocument();

        // Simulate closing the modal
        fireEvent.click(screen.getByText('Close'));

        // Ensure the modal is no longer displayed
        await waitFor(() => {
            // Use queryByTestId here to avoid throwing an error when the element is not found
            expect(screen.queryByTestId('modal-title-test-id')).not.toBeInTheDocument();
        });
    });

});
