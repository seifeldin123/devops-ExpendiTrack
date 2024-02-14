import React, {useState} from 'react';
import {render, act, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetProvider, useBudgetContext } from '../BudgetContext';
import { useUserContext } from '../UserContext';
import {createBudget, getBudgetsByUserId} from '../../services/BudgetService';


// Mock the UserContext
jest.mock('../UserContext');

// Mock the budgetService functions
jest.mock('../../services/BudgetService');

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
        getBudgetsByUserId.mockResolvedValue({ data: [] });
        const newBudget = { id: 3, budgetDescription: 'New Budget', budgetAmount: 300 };
        createBudget.mockResolvedValue(newBudget);

        render(
            <BudgetProvider>
                <BudgetDisplay />
            </BudgetProvider>
        );

        await act(async () => {
            // Simulate user actions or direct state manipulations here
            await userEvent.type(screen.getByPlaceholderText('Budget Title'), 'New Budget');
            await userEvent.type(screen.getByPlaceholderText('Budget Amount'), '300');
            userEvent.click(screen.getByText('Add Budget'));
        });

        // Await any asynchronous operations triggered by the above interactions
        await waitFor(() => expect(screen.getByText('New Budget')).toBeInTheDocument());
    });


});

function BudgetDisplay() {
    const { budgets, addNewBudget } = useBudgetContext();
    const [budgetDescription, setBudgetDescription] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');

    const handleAddBudget = () => {
        addNewBudget({ budgetDescription, budgetAmount: Number(budgetAmount) });
    };

    return (
        <div>
            {budgets.map((budget) => (
                <div key={budget.id}>{budget.budgetDescription}</div>
            ))}
            <input
                placeholder="Budget Title"
                value={budgetDescription}
                onChange={(e) => setBudgetDescription(e.target.value)}
            />
            <input
                placeholder="Budget Amount"
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
            />
            <button onClick={handleAddBudget}>Add Budget</button>
        </div>
    );
}
