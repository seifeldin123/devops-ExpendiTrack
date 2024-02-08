import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseItem from '../ExpenseItem';

describe('ExpenseItem', () => {
    const mockExpense = {
        expensesDescription: 'Coffee', // Ensure property names match those used in the component
        expensesAmount: 5, // This should be a number if `formatCurrency` expects to call `toLocaleString` on it
        expensesDate: '2024-02-06',
        budget: { budgetDescription: 'Daily Expenses' } // Ensure nested structure matches component's expectation
    };

    it('renders the expense details correctly', () => {
        render(<ExpenseItem expense={mockExpense} />);

        expect(screen.getByText('Coffee')).toBeInTheDocument();
        expect(screen.getByText(/Amount:/)).toBeInTheDocument(); // Use regex for partial matching if formatting adds currency symbols, etc.
        expect(screen.getByText(/Date:/)).toBeInTheDocument(); // Similar partial match for dates, since formatting might vary
        expect(screen.getByText('Budget: Daily Expenses')).toBeInTheDocument();
    });
});
