import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseItem from '../ExpenseItem';

describe('ExpenseItem', () => {
    const mockExpense = {
        description: 'Coffee',
        amount: '5',
        date: '2024-02-06',
        budgetDescription: 'Daily Expenses'
    };

    it('renders the expense details correctly', () => {
        render(<ExpenseItem expense={mockExpense} />);

        expect(screen.getByText('Coffee')).toBeInTheDocument();
        expect(screen.getByText('Amount: $5')).toBeInTheDocument();
        expect(screen.getByText('Date: $2024-02-06')).toBeInTheDocument();
        expect(screen.getByText('Budget: $Daily Expenses')).toBeInTheDocument();
    });
});
