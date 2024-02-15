import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpenseList from '../ExpenseList';

describe('ExpenseList', () => {
    const mockExpenses = [
        { expensesId: 1, expensesDescription: 'Coffee', expensesAmount: 5, expensesDate: '2024-02-06', budget: { budgetDescription: 'Daily Expenses' }},
        { expensesId: 2, expensesDescription: 'Books', expensesAmount: 15, expensesDate: '2024-02-07', budget: { budgetDescription: 'Education' }}
    ];

    // Display Expense List
    it('renders a list of expenses correctly', () => {
        render(<ExpenseList expenses={mockExpenses} />);

        expect(screen.getByText('Daily Expenses')).toBeInTheDocument();
        expect(screen.getByText('Education')).toBeInTheDocument();
        mockExpenses.forEach(expense => {
            expect(screen.getByText(expense.expensesDescription)).toBeInTheDocument();
        });
    });

    // Display No Expenses Message
    it('displays a message when no expenses are available', () => {
        render(<ExpenseList expenses={[]} />);
        expect(screen.getByText('No expenses available')).toBeInTheDocument();
    });

});
