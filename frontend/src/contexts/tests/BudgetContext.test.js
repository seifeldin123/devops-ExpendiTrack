import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useUserContext } from '../UserContext';
import { BudgetProvider, useBudgetContext } from '../BudgetContext';
import * as BudgetService from '../../services/BudgetService';

// Mock the UserContext and BudgetService for integration testing
jest.mock('../UserContext', () => ({
    useUserContext: jest.fn(),
}));
jest.mock('../../services/BudgetService');

describe('BudgetContext Integration Tests', () => {
    const user = { id: 1, name: 'Test User' };
    const initialBudgets = [
        { id: 1, budgetDescription: 'Groceries', budgetAmount: 300 },
        { id: 2, budgetDescription: 'Utilities', budgetAmount: 150 },

    ];
    const newBudget = { id: 3, budgetDescription: 'Entertainment', budgetAmount: 250 };

    beforeEach(() => {
        // Mock the return value of useUserContext to always return the test user
        useUserContext.mockReturnValue({ user });
        BudgetService.getBudgetsByUserId.mockReset();
        BudgetService.createBudget.mockReset();
    });

    it('fetches and updates budgets when the user changes', async () => {
        BudgetService.getBudgetsByUserId.mockResolvedValueOnce({ data: initialBudgets });

        const TestComponent = () => {
            const { budgets } = useBudgetContext();
            return (
                <>
                    {budgets.map((budget) => (
                        <div key={budget.id}>{budget.budgetDescription}</div>
                    ))}
                </>
            );
        };

        await act(async () => {
            render(
                <BudgetProvider>
                    <TestComponent />
                </BudgetProvider>
            );
        });

        expect(BudgetService.getBudgetsByUserId).toHaveBeenCalledWith(user.id);
        // Assertions for the budget items to be in the document could be added here
    });

    it('adds a new budget and updates the context', async () => {
        BudgetService.getBudgetsByUserId.mockResolvedValueOnce({ data: initialBudgets });
        BudgetService.createBudget.mockResolvedValueOnce(newBudget);

        let renderResult;
        const TestComponent = () => {
            const { addNewBudget, budgets } = useBudgetContext();
            return (
                <div>
                    {budgets.map((budget) => (
                        <div key={budget.id}>{budget.budgetDescription}</div>
                    ))}
                    <button onClick={() => addNewBudget({ budgetDescription: 'Entertainment', budgetAmount: 250 })}>Add Budget</button>
                </div>
            );
        };

        await act(async () => {
            renderResult = render(
                <BudgetProvider>
                    <TestComponent />
                </BudgetProvider>
            );
        });

        // Simulate adding a new budget
        await act(async () => {
            userEvent.click(renderResult.getByText('Add Budget'));
        });

        expect(BudgetService.createBudget).toHaveBeenCalledWith({
            budgetDescription: 'Entertainment',
            budgetAmount: 250,
            user: { id: user.id },
        });
        // Additional assertions...
    });

    it('handles errors when fetching budgets fails', async () => {
        const errorMessage = 'Failed to fetch budgets';
        BudgetService.getBudgetsByUserId.mockRejectedValueOnce(new Error(errorMessage));

        let testError;
        const TestComponent = () => {
            const { error } = useBudgetContext();
            testError = error;
            return null;
        };

        render(
            <BudgetProvider>
                <TestComponent />
            </BudgetProvider>
        );

        // Wait for the error state to be updated after the rejection
        await waitFor(() => {
            expect(testError).toEqual(errorMessage);
        });
    });

});
