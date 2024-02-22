import React from 'react';
import {
    render,
    act,
    waitFor,
    screen, getByTestId,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetProvider, useBudgetContext } from '../BudgetContext';
import * as BudgetService from '../../services/BudgetService';
import BudgetList from "../../components/BudgetList";
import {BrowserRouter} from "react-router-dom";

jest.mock('../../contexts/UserContext', () => ({
    useUserContext: () => ({ user: { id: 1, name: 'Test User' } }),
}));

jest.mock('../../services/BudgetService');

jest.mock('../../contexts/ExpenseContext', () => ({
    useExpenseContext: () => ({
        expenses: [], // Provide a default value for expenses
        // Add any other functions or properties that are used from the context
    }),
}));


describe('BudgetContext Integration Tests', () => {

    let originalConsoleError;

    const user = { id: 1, name: 'Test User' };
    const initialBudgets = [
        { id: 1, budgetDescription: 'Groceries', budgetAmount: 300 },
        { id: 2, budgetDescription: 'Utilities', budgetAmount: 150 },

    ];
    const newBudget = { id: 3, budgetDescription: 'Entertainment', budgetAmount: 250 };

    beforeEach(() => {
        // Mock the service calls with default implementations
        BudgetService.getBudgetsByUserId.mockResolvedValue(initialBudgets);
        BudgetService.createBudget.mockImplementation((newBudget) =>
            Promise.resolve({ ...newBudget, id: Math.random() }) // Simulate adding an ID to the new budget
        );
        BudgetService.updateBudget.mockImplementation((id, updatedBudget) =>
            Promise.resolve({ ...updatedBudget, id }) // Return the updated budget with its ID
        );
        BudgetService.deleteBudget.mockResolvedValue({}); // Simulate successful deletion
    });

    afterEach(() => {
        // Reset mocks after each test
        jest.resetAllMocks();
    });

    it('fetches and updates budgets when the user changes', async () => {
        BudgetService.getBudgetsByUserId.mockResolvedValueOnce(initialBudgets);

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
            userId: user.id, // Adjusted to expect userId directly instead of a user object
        });

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
    })

    it('updates an existing budget correctly', async () => {
        // Initial mock budgets to be fetched
        const initialBudgets = [
            { budgetId: 1, budgetDescription: 'Groceries', budgetAmount: 300 },
        ];

        // Mock the updated budget
        const updatedBudget = {
            budgetDescription: 'Updated Groceries',
            budgetAmount: 350,
            user: {
                id: 1
            } };

        // Mock the API calls
        BudgetService.getBudgetsByUserId.mockResolvedValue(initialBudgets);
        BudgetService.updateBudget.mockResolvedValue(updatedBudget);

        // Render the BudgetList (and indirectly, BudgetItem components) inside the BudgetProvider
        const { getByText, getByLabelText, queryByText } = render(
            <BrowserRouter>
                <BudgetProvider>
                    <BudgetList budgets={initialBudgets}  />
                </BudgetProvider>
            </BrowserRouter>
        );

        // Wait for the budgets to be fetched and displayed
        await waitFor(() => expect(getByText('Budget Name: ' + 'Groceries')).toBeInTheDocument());

        // Simulate clicking the edit button for the first budget item
        userEvent.click(getByText('Edit Budget'));

        // Wait for the modal to open and the form to be populated
        await waitFor(() => expect(getByText('Budget Name: ' + 'Groceries')));

        // Update the budget amount in the form
        userEvent.type(screen.getByTestId('budget-amount-input'), "350");
        userEvent.type(screen.getByTestId('budget-description-input'), 'Updated Groceries');

        // Submit the updated budget
        userEvent.click(getByText('Update Budget'));

        // Expect the updateBudget API to have been called with the updated budget data
        // Verify API call
        await waitFor(() => {
            expect(BudgetService.updateBudget).toHaveBeenCalledWith(1, expect.objectContaining({
                budgetDescription: 'Updated Groceries',
                budgetAmount: 350
            }));
        });
    });

    it('deletes an existing budget and updates the context', async () => {
        const initialBudgets = [
            { id: 1, budgetDescription: 'Groceries', budgetAmount: 300 },
            { id: 2, budgetDescription: 'Utilities', budgetAmount: 150 },
        ];
        BudgetService.getBudgetsByUserId.mockResolvedValue(initialBudgets);

        const budgetIdToDelete = 2;

        const TestComponent = () => {
            const { removeBudget, budgets } = useBudgetContext();
            return (
                <>
                    {budgets.map((budget) => (
                        <div key={budget.id}>{budget.budgetDescription}</div>
                    ))}
                    <button onClick={() => removeBudget(budgetIdToDelete)}>Delete Budget</button>
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

        // Simulate deleting a budget
        await act(async () => {
            userEvent.click(screen.getByText('Delete Budget'));
        });

        expect(BudgetService.deleteBudget).toHaveBeenCalledWith(budgetIdToDelete);

        await waitFor(() => {
            const deletedBudgetText = screen.queryByText('Utilities: 150');
            expect(deletedBudgetText).not.toBeInTheDocument();
        });
    });
});
