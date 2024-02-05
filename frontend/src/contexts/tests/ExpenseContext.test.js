import React, { useState } from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseProvider, useExpenseContext } from '../ExpenseContext';
import { useUserContext } from '../UserContext';
import { createExpense, getUserExpenses } from '../../services/expenseService';

// Mock the UserContext
jest.mock('../UserContext');

// Mock the expenseService functions
jest.mock('../../services/expenseService');

describe('ExpenseProvider', () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockExpenses = [
        { id: 1, description: 'Coffee', amount: 5 },
        { id: 2, description: 'Books', amount: 15 },
    ];

    beforeEach(() => {
        // Mock the useUserContext hook to return the mockUser
        useUserContext.mockReturnValue({ user: mockUser });
    });

    it('fetches and displays user-specific expenses', async () => {
        // Mock getUserExpenses to return the mockExpenses
        getUserExpenses.mockResolvedValue({ data: mockExpenses });

        await act(async () => {
            render(
                <ExpenseProvider>
                    <ExpenseDisplay />
                </ExpenseProvider>
            );
        });

        // Ensure that the expense descriptions are displayed on the screen
        expect(screen.getByText((content, node) => {
            const hasText = (node) => node.textContent === "Coffee - $5";
            const nodeHasText = hasText(node);
            // Check if the current node has the text, or some child does
            const childrenDontHaveText = Array.from(node.children).every(
                (child) => !hasText(child)
            );
            return nodeHasText && childrenDontHaveText;
        })).toBeInTheDocument();

    });

    it('adds a new expense and updates the display', async () => {
        getUserExpenses.mockResolvedValue({ data: [] });
        const newExpense = { id: 3, description: 'Gym', amount: 30 };
        createExpense.mockResolvedValue({ data: newExpense });

        render(
            <ExpenseProvider>
                <ExpenseDisplay />
            </ExpenseProvider>
        );

        await act(async () => {
            // Simulate user actions or direct state manipulations here
            await userEvent.type(screen.getByPlaceholderText('Expense Description'), 'Gym');
            await userEvent.type(screen.getByPlaceholderText('Expense Amount'), '30');
            userEvent.click(screen.getByText('Add Expense'));
        });

        // Await any asynchronous operations triggered by the above interactions
        await waitFor(() => expect(screen.getByText((content) => {
            return content.replace(/\s+/g, ' ').trim() === "Gym - $30";
        })).toBeInTheDocument());

    });
});

function ExpenseDisplay() {
    const { expenses, addNewExpense } = useExpenseContext();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleAddExpense = () => {
        addNewExpense({ description, amount: Number(amount) });
    };

    return (
        <div>
            {expenses.map((expense) => (
                <div key={expense.id}>{expense.description} - ${expense.amount}</div>
            ))}
            <input
                placeholder="Expense Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                placeholder="Expense Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleAddExpense}>Add Expense</button>
        </div>
    );
}
