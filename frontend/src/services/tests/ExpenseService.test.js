
jest.mock('axios');
import axios from 'axios';
import { createExpense, getUserExpenses } from '../ExpenseService';

describe('ExpenseService', () => {
    beforeEach(() => {
        axios.post.mockClear();
        axios.get.mockClear();
    });

    // TC_UI_001: Verify Successful Expense Creation
    it('TC_UI_001: should successfully create an expense', async () => {
        const expenseData = {
            description: "Office Supplies",
            amount: 100,
            date: "2024-02-14T10:00:00Z",
            budgetId: 1
        };
        const mockResponse = { data: { expensesId: 1, ...expenseData, budget: { budgetId: 1, budgetDescription: null, budgetAmount: 0, user: null } } };
        axios.post.mockResolvedValue(mockResponse);

        await expect(createExpense(expenseData)).resolves.toEqual(mockResponse.data);
    });

    // TC_UI_002: Verify Expense Creation Failure due to Non-Existent Budget
    it('TC_UI_002: should handle failure due to non-existent budget', async () => {
        const expenseData = { description: "Travel Expenses", amount: 300, date: "2024-03-10T10:00:00Z", budgetId: 9999 };
        const errorMessage = 'Invalid input: Budget with ID 9999 not found';
        axios.post.mockRejectedValue({ response: { status: 400, data: errorMessage } });

        await expect(createExpense(expenseData)).rejects.toThrow(errorMessage);
    });

    // TC_UI_003: Verify Expense Creation Failure due to Negative Expense Amount
    it('TC_UI_003: should handle failure due to negative expense amount', async () => {
        const expenseData = { description: "Negative Test", amount: -100, date: "2024-04-01T10:00:00Z", budgetId: 2 };
        const errorMessage = "Error message indicates expenses amount cannot be negative.";
        axios.post.mockRejectedValue({ response: { status: 400, data: errorMessage } });

        await expect(createExpense(expenseData)).rejects.toThrow(errorMessage);
    });

    // TC_UI_004: Verify Expense Creation Failure due to Exceeding Budget Amount
    it('TC_UI_004: should handle failure due to exceeding budget amount', async () => {
        const expenseData = { description: "Over Budget", amount: 2000, date: "2024-05-20T10:00:00Z", budgetId: 1 };
        const errorMessage = 'Invalid input: expenses amount exceeds budget.';
        axios.post.mockRejectedValue({ response: { status: 400, data: errorMessage } });

        await expect(createExpense(expenseData)).rejects.toThrow(errorMessage);
    });

    // TC_UI_005: Verify Successful Expense Retrieval by User ID
    it('TC_UI_005: should successfully retrieve expenses by user ID', async () => {
        const userId = 1;
        const mockResponse = [{ description: "Office Supplies", amount: 100, date: "2024-02-14T10:00:00Z", budgetId: 1 }];
        axios.get.mockResolvedValue({ data: mockResponse });

        await expect(getUserExpenses(userId)).resolves.toEqual(mockResponse);
    });

    // TC_UI_006: Verify Expense Retrieval Failure due to Nonexistent User
    it('TC_UI_006: should handle failure due to nonexistent user', async () => {
        const userId = 9999;
        const errorMessage = "Error message indicates user does not exist.";
        axios.get.mockRejectedValue({ response: { data: errorMessage } });

        await expect(getUserExpenses(userId)).rejects.toThrow(errorMessage);
    });

    // TC_UI_007: Verify Expense Creation Failure due to Invalid Description
    it('TC_UI_007: should handle failure due to invalid expense description', async () => {
        const expenseData = { description: "!!!***", amount: 50, date: "2024-06-15T10:00:00Z", budgetId: 2 };
        const errorMessage = "Error message indicates ExpensesDescription must be alphanumeric.";
        axios.post.mockRejectedValue({ response: { status: 400, data: errorMessage } });

        await expect(createExpense(expenseData)).rejects.toThrow(errorMessage);
    });

    // TC_UI_008: Verify Expense Creation Failure due to Duplicate Expense Name
    it('TC_UI_008: should handle failure due to duplicate expense name', async () => {
        const expenseData = { description: "Office Supplies", amount: 150, date: "2024-07-22T10:00:00Z", budgetId: 1 };
        const errorMessage = 'An expense with the name "Office Supplies" already exists for this user.';
        axios.post.mockRejectedValue({ response: { status: 400, data: errorMessage } });

        await expect(createExpense(expenseData)).rejects.toThrow(errorMessage);
    });
});
