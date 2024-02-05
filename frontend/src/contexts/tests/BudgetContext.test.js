import React from 'react';
import {render, act, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetProvider, useBudgetContext } from '../BudgetContext';
import { useUserContext } from '../UserContext';
import {createBudget, getBudgetsByUserId} from '../../services/budgetService';


// Mock the UserContext
jest.mock('../UserContext');

// Mock the budgetService functions
jest.mock('../../services/budgetService');

describe('BudgetProvider', () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockBudgets = [
        { id: 1, budgetDescription: 'Budget 1', budgetAmount: 100 },
        { id: 2, budgetDescription: 'Budget 2', budgetAmount: 200 },
    ];

    beforeEach(() => {
        // Mock the useUserContext hook to return the mockUser
        useUserContext.mockReturnValue({ user: mockUser });
    });

    it('fetches and displays user-specific budgets', async () => {
        // Mock getUserBudgets to return the mockBudgets
        getBudgetsByUserId.mockResolvedValue({ data: mockBudgets });

        await act(async () => {
            render(
                <BudgetProvider>
                    <BudgetDisplay />
                </BudgetProvider>
            );
        });

        // Ensure that the budget budgetDescriptions are displayed on the screen
        expect(screen.getByText('Budget 1')).toBeInTheDocument();
        expect(screen.getByText('Budget 2')).toBeInTheDocument();
    });

    it('adds a new budget and updates the display', async () => {
        // Mock getUserBudgets to return an empty array initially
        getBudgetsByUserId.mockResolvedValue({ data: [] });

        // Mock createBudget to return a new budget
        const newBudget = { id: 3, budgetDescription: 'New Budget', budgetAmount: 300 };
        createBudget.mockResolvedValue({ data: newBudget });

        await act(async () => {
            render(
                <BudgetProvider>
                    <BudgetDisplay />
                </BudgetProvider>
            );
        });

        // Find the input field for adding a new budget
        const inputField = screen.getByPlaceholderText('Budget Title');

        // Type a new budget budgetDescription and budgetAmount
        userEvent.type(inputField, 'New Budget');
        userEvent.type(screen.getByPlaceholderText('Budget Amount'), '300');

        // Find and click the "Add Budget" button
        userEvent.click(screen.getByText('Add Budget'));

        // Wait for the "New Budget" element to be available
        await waitFor(() => {
            expect(screen.getByText('New Budget')).toBeInTheDocument();
        });
    });
});

function BudgetDisplay() {
    const { budgets, addNewBudget } = useBudgetContext();

    return (
        <div>
            {budgets.map((budget) => (
                <div key={budget.id}>{budget.budgetDescription}</div>
            ))}
            <input placeholder="Budget Title" />
            <input placeholder="Budget Amount" />
            <button onClick={() => addNewBudget({ budgetDescription: 'New Budget', budgetAmount: 300 })}>
                Add Budget
            </button>
        </div>
    );
}