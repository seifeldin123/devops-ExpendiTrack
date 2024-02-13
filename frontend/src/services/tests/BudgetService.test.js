import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createBudget, getBudgetsByUserId } from '../BudgetService';

describe('BudgetService', () => {
    let mock;
    const API_URL = 'http://localhost:8080/budgets';

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    describe('createBudget', () => {
        const budgetData = { name: 'Test Budget', amount: 500, userId: 1 };

        // Verify Successful Budget Creation
        it('successfully creates a budget', async () => {
            mock.onPost(API_URL).reply(200, { message: 'Budget created successfully' });

            const response = await createBudget(budgetData);
            expect(response.message).toBe('Budget created successfully');
        });

        // Verify Budget Creation Failure due to Duplicate Budgets
        it('handles duplicate budgets for a user', async () => {
            const budgetData = { budgetDescription: "New Year Party", budgetAmount: 500, userId: 1 };
            // Assume the API returns a specific status code or message for duplicate budgets
            mock.onPost(`${API_URL}`, budgetData).reply(400, 'A budget with the name "New Year Party" already exists for this user.');

            await expect(createBudget(budgetData)).rejects.toEqual('A budget with the name "New Year Party" already exists for this user.');
        });

        // Verify Budget Creation Failure due to Server Error
        it('fails to create a budget due to server error', async () => {
            mock.onPost(API_URL).networkError();

            await expect(createBudget(budgetData)).rejects.toEqual('An error occurred while creating the budget. Please try again later.');
        });
    });

    describe('getBudgetsByUserId', () => {
        const userId = 1;

        // Verify Successful Budget Retrieval
        it('successfully retrieves budgets', async () => {
            const budgets = [{ id: 1, name: 'Test Budget', amount: 500 }];
            mock.onGet(`${API_URL}/user/${userId}`).reply(200, budgets);

            const response = await getBudgetsByUserId(userId);
            expect(response).toEqual(budgets);
        });

        // Verify Budget Retrieval Failure due to Server Error
        it('fails to retrieve budgets due to server error', async () => {
            mock.onGet(`${API_URL}/user/${userId}`).networkError();

            await expect(getBudgetsByUserId(userId)).rejects.toEqual('Failed to load budgets. Please refresh the page to try again.');
        });

        // Verify Budget Retrieval Failure due to Nonexistent User
        it('fails to retrieve budgets due to nonexistent user', async () => {
            const invalidUserId = 9999;
            mock.onGet(`${API_URL}/user/${invalidUserId}`).reply(404, 'User does not exist');

            await expect(getBudgetsByUserId(invalidUserId)).rejects.toEqual('Failed to load budgets. Please refresh the page to try again.'); // Adjusted expected behavior for consistency
        });
    });
});
