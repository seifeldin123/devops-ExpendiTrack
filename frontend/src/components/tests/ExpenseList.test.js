import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseList from '..//ExpenseList';

// Mock ExpenseItem component
jest.mock('../ExpenseItem', () => (props) => <div data-testid="expense-item">{props.expense.description}</div>);

describe('ExpenseList', () => {

    it('renders a list of expenses correctly', () => {
        const mockExpenses = [
            { id: 1, description: 'Coffee', amount: 5, date: '2024-02-06', budgetDescription: 'Daily Expenses' },
            { id: 2, description: 'Books', amount: 15, date: '2024-02-07', budgetDescription: 'Education' }
        ];

        render(<ExpenseList expenses={mockExpenses} />);

        expect(screen.getAllByTestId('expense-item')).toHaveLength(mockExpenses.length);
        expect(screen.getByText('Expenses')).toBeInTheDocument();
        expect(screen.getByText('Coffee')).toBeInTheDocument();
        expect(screen.getByText('Books')).toBeInTheDocument();
    });
});
