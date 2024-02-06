import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import AddExpenseForm from '../AddExpenseForm';
import { useExpenseContext } from '../../contexts/ExpenseContext';

// Mock the ExpenseContext
jest.mock('../../contexts/ExpenseContext', () => ({
    useExpenseContext: jest.fn()
}));

describe('AddExpenseForm', () => {
    // Mock data for budgets
    const budgets = [
        { id: 1, title: 'Daily Expenses' },
        { id: 2, title: 'Savings' }
    ];

    beforeEach(() => {
        // Mock implementation of useExpenseContext
        useExpenseContext.mockImplementation(() => ({
            addNewExpense: jest.fn()
        }));
    });

    it('renders correctly with initial state', () => {
        render(<AddExpenseForm budgets={budgets} />);

        // Check for the presence and correct initial values of description and amount inputs
        expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Date')).toBeInTheDocument();
        expect(screen.getByText('Select Budget')).toBeInTheDocument();
    });


    it('allows input to be entered in the form fields', async () => {
        render(<AddExpenseForm budgets={budgets} />);

        const descriptionInput = screen.getByPlaceholderText('Description');
        const amountInput = screen.getByPlaceholderText('Amount');
        const dateInput = screen.getByPlaceholderText('Date');
        const selectBudget = screen.getByRole('combobox');

        await act(async () => {

            await userEvent.type(descriptionInput, 'Coffee');
            await userEvent.type(amountInput, '5');
            await userEvent.type(dateInput, '2024-02-06');
            fireEvent.change(selectBudget, {target: {value: budgets[0].id.toString()}});

        });

        expect(descriptionInput).toHaveValue('Coffee');
        expect(amountInput).toHaveValue(5);
        expect(dateInput).toHaveValue('2024-02-06');
        expect(selectBudget).toHaveValue(budgets[0].id.toString());
    });

    it('calls addNewExpense with the correct data when the form is submitted', async () => {
        const addNewExpenseMock = jest.fn();
        useExpenseContext.mockImplementation(() => ({
            addNewExpense: addNewExpenseMock,
            expenses: []
        }));

        render(<AddExpenseForm budgets={budgets} />);

        const descriptionInput = screen.getByPlaceholderText('Description');
        const amountInput = screen.getByPlaceholderText('Amount');
        const dateInput = screen.getByPlaceholderText('Date');
        const selectBudget = screen.getByRole('combobox');
        const submitButton = screen.getByText('Add Expense');

        await act(async () => {
            // Simulate filling out and submitting the form
            await userEvent.type(descriptionInput, 'Books');
            await userEvent.type(amountInput, '15');
            await userEvent.type(dateInput, '2024-02-07');
            fireEvent.change(selectBudget, {target: {value: budgets[1].id.toString()}});
            userEvent.click(submitButton);

        });

        // Use waitFor or findBy* queries if the submission is asynchronous
        expect(addNewExpenseMock).toHaveBeenCalledWith({
            description: 'Books',
            amount: 15,
            date: '2024-02-07T00:00:00.000Z',
            budgetId: budgets[1].id.toString()
        });
    });

});
