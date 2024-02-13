import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createBudget, getBudgetsByUserId } from '../BudgetService'; // Adjust the import path accordingly

describe('BudgetService', () => {
    let mock = new MockAdapter(axios);
    const API_URL = 'http://localhost:8080/budgets';

    afterEach(() => {
        mock.reset();
    });

    it('TC_UI_001: should successfully create a budget', async () => {
        const budgetData = { userId: 1, budgetDescription: "MonthlySavings", budgetAmount: 500 };
        const response = { message: "New budget is created successfully." };

        mock.onPost(API_URL, budgetData).reply(200, response);

        await expect(createBudget(budgetData)).resolves.toEqual(response);
    });

    it('TC_UI_002: should handle failure due to duplicate budget name', async () => {
        const budgetData = { userId: 1, budgetDescription: "ExistingBudget", budgetAmount: 300 };
        const errorMessage = "Error message indicates a duplicate budget name.";

        mock.onPost(API_URL, budgetData).reply(400, errorMessage);

        await expect(createBudget(budgetData)).rejects.toMatch(errorMessage);
    });

    it('TC_UI_003: should handle failure due to nonexistent user', async () => {
        const budgetData = { userId: 999, budgetDescription: "NewBudget", budgetAmount: 200 };
        const errorMessage = "Error message indicates user does not exist.";

        mock.onPost(API_URL, budgetData).reply(400, errorMessage);

        await expect(createBudget(budgetData)).rejects.toMatch(errorMessage);
    });

    it('TC_UI_004: should handle failure due to invalid budget amount', async () => {
        const budgetData = { userId: 1, budgetDescription: "InvalidBudget", budgetAmount: -100 };
        const errorMessage = "Error message indicates budget amount cannot be negative.";

        mock.onPost(API_URL, budgetData).reply(400, errorMessage);

        await expect(createBudget(budgetData)).rejects.toMatch(errorMessage);
    });

    it('TC_UI_005: should successfully retrieve budgets by user ID', async () => {
        const userId = 1;
        const response = [{ budgetDescription: "MonthlySavings", budgetAmount: 500 }];

        mock.onGet(`${API_URL}/user/${userId}`).reply(200, response);

        await expect(getBudgetsByUserId(userId)).resolves.toEqual(response);
    });

    it('TC_UI_006: should handle failure to retrieve budgets due to server error', async () => {
        const userId = 1;
        const errorMessage = "Error message indicates server error occurred.";

        mock.onGet(`${API_URL}/user/${userId}`).reply(500, errorMessage);

        await expect(getBudgetsByUserId(userId)).rejects.toMatch('Failed to load budgets. Please refresh the page to try again.');
    });

    it('TC_UI_007: should handle failure to retrieve budgets due to nonexistent user', async () => {
        const userId = 999;
        const errorMessage = "Error message indicates user does not exist.";

        mock.onGet(`${API_URL}/user/${userId}`).reply(400, errorMessage);

        await expect(getBudgetsByUserId(userId)).rejects.toMatch('Failed to load budgets. Please refresh the page to try again.');
    });

    it('TC_UI_008: should handle failure due to invalid budget name', async () => {
        const budgetData = { userId: 1, budgetDescription: "!@#$%", budgetAmount: 200 };
        const errorMessage = "Error message indicates BudgetDescription must be alphanumeric.";

        mock.onPost(API_URL, budgetData).reply(400, errorMessage);

        await expect(createBudget(budgetData)).rejects.toMatch(errorMessage);
    });
});
