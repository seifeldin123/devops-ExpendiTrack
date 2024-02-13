import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createExpense, getUserExpenses } from '../ExpenseService'; // Adjust the import path accordingly

describe('ExpenseService', () => {
    let mock = new MockAdapter(axios);
    const API_URL = 'http://localhost:8080/expenses';

    afterEach(() => {
        mock.reset();
    });

    it('TC_UI_001: should successfully create an expense', async () => {
        const expenseData = {
            description: "Office Supplies",
            amount: 100,
            date: "2024-02-14T10:00:00Z",
            budgetId: 1
        };
        const response = { message: "New expense is created successfully." };

        mock.onPost(API_URL, {
            expensesDescription: expenseData.description,
            expensesAmount: expenseData.amount,
            expensesDate: expenseData.date,
            budget: { budgetId: expenseData.budgetId }
        }).reply(200, response);

        await expect(createExpense(expenseData)).resolves.toEqual(response);
    });

    it('TC_UI_002: should handle failure due to non-existent budget', async () => {
        const expenseData = {
            description: "Travel Expenses",
            amount: 300,
            date: "2024-03-10T10:00:00Z",
            budgetId: 9999
        };
        const errorMessage = "Error message indicates budget not found.";

        mock.onPost(API_URL, {
            expensesDescription: expenseData.description,
            expensesAmount: expenseData.amount,
            expensesDate: expenseData.date,
            budget: { budgetId: expenseData.budgetId }
        }).reply(400, errorMessage);

        await expect(createExpense(expenseData)).rejects.toMatch(errorMessage);
    });

    it('TC_UI_003: should handle failure due to negative expense amount', async () => {
        const expenseData = {
            description: "Negative Test",
            amount: -100,
            date: "2024-04-01T10:00:00Z",
            budgetId: 2
        };
        const errorMessage = "Error message indicates expenses amount cannot be negative.";

        mock.onPost(API_URL, {
            expensesDescription: expenseData.description,
            expensesAmount: expenseData.amount,
            expensesDate: expenseData.date,
            budget: { budgetId: expenseData.budgetId }
        }).reply(400, errorMessage);

        await expect(createExpense(expenseData)).rejects.toMatch(errorMessage);
    });

    it('TC_UI_004: should handle failure due to exceeding budget amount', async () => {
        const expenseData = {
            description: "Over Budget",
            amount: 2000,
            date: "2024-05-20T10:00:00Z",
            budgetId: 1
        };
        const errorMessage = "Error message indicates expenses amount exceeds budget.";

        mock.onPost(API_URL, {
            expensesDescription: expenseData.description,
            expensesAmount: expenseData.amount,
            expensesDate: expenseData.date,
            budget: { budgetId: expenseData.budgetId }
        }).reply(400, errorMessage);

        await expect(createExpense(expenseData)).rejects.toMatch(errorMessage);
    });

    it('TC_UI_005: should successfully retrieve expenses by user ID', async () => {
        const userId = 1;
        const response = [{ description: "Office Supplies", amount: 100, date: "2024-02-14T10:00:00Z", budgetId: 1 }];

        mock.onGet(`${API_URL}/user/${userId}`).reply(200, response);

        await expect(getUserExpenses(userId)).resolves.toEqual(response);
    });

    it('TC_UI_006: should handle failure due to nonexistent user', async () => {
        const userId = 9999;
        const errorMessage = "Error message indicates user does not exist.";

        mock.onGet(`${API_URL}/user/${userId}`).reply(404, errorMessage);

        await expect(getUserExpenses(userId)).rejects.toMatch('Failed to load budgets. Please refresh the page to try again.');
    });

    it('TC_UI_007: should handle failure due to invalid expense description', async () => {
        const expenseData = {
            description: "!!!***",
            amount: 50,
            date: "2024-06-15T10:00:00Z",
            budgetId: 2
        };
        const errorMessage = "Error message indicates ExpensesDescription must be alphanumeric.";

        mock.onPost(API_URL, {
            expensesDescription: expenseData.description,
            expensesAmount: expenseData.amount,
            expensesDate: expenseData.date,
            budget: { budgetId: expenseData.budgetId }
        }).reply(400, errorMessage);

        await expect(createExpense(expenseData)).rejects.toMatch(errorMessage);
    });

    it('TC_UI_008: should handle failure due to duplicate expense name', async () => {
        const expenseData = {
            description: "Office Supplies",
            amount: 150,
            date: "2024-07-22T10:00:00Z",
            budgetId: 1
        };
        const errorMessage = "Error message indicates duplicate expense name.";

        mock.onPost(API_URL, {
            expensesDescription: expenseData.description,
            expensesAmount: expenseData.amount,
            expensesDate: expenseData.date,
            budget: { budgetId: expenseData.budgetId }
        }).reply(400, errorMessage);

        await expect(createExpense(expenseData)).rejects.toMatch(errorMessage);
    });

});
