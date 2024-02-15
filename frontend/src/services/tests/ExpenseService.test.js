import {createBudget, getBudgetsByUserId} from "../BudgetService";

jest.mock('axios');
import axios from 'axios';
import {createExpense, getUserExpenses} from '../ExpenseService';

describe('ExpenseService', () => {
    beforeEach(() => {
        axios.post.mockClear();
        axios.get.mockClear();
    });

    // TC_UI_001: Verify Successful Expense Creation
    it('TC_UI_001: should successfully create an expense', async () => {
        const expenseData = {
            expensesDescription: "Office Supplies",
            expensesAmount: 100,
            expensesDate: "2024-02-14T10:00:00Z",
            budget: {
                budgetId: 1
            }
        };

        const mockResponse = {
            expensesId: 1,
            ...expenseData,
            budget: {
                budgetId: 1,
                budgetDescription: null,
                budgetAmount: 0,
                user: null
            }
        };
        axios.post.mockResolvedValue( {response: { status: 201, mockResponse } });

        await expect(createExpense(expenseData)).resolves.toEqual(mockResponse.data);
    });

    // TC_UI_002: Verify Expense Creation Failure due to Non-Existent Budget
    it('TC_UI_002: should handle failure due to non-existent budget', async () => {
        const expenseData = {
            expensesDescription: "Travel Expenses",
            expensesAmount: 300,
            expensesDate: "2024-03-10T10:00:00Z",
            budget: {
                budgetId: 9999
            }
        };
        const errorMessage = 'Invalid input: Budget with ID 9999 not found';
        axios.post.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(createExpense(expenseData)).rejects.toThrow(errorMessage);
    });

    // TC_UI_003: Verify Expense Creation Failure due to Negative Expense Amount
    it('TC_UI_003: should handle failure due to negative expense amount', async () => {
        const expenseData = {
            expensesDescription: "Negative Test",
            expensesAmount: -100,
            expensesDate: "2024-04-01T10:00:00Z",
            budget: {
                budgetId: 1
            }
        };
        const errorMessage = "Invalid input: expenses amount cannot be negative.";
        axios.post.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(createExpense(expenseData)).rejects.toThrow(errorMessage);
    });


    // TC_UI_004: Verify Successful Expense Retrieval by User ID
    it('TC_UI_004: should successfully retrieve expenses by user ID', async () => {
        const userId = 1;
        const mockResponse =
            [
                {
                    expensesId: 1,
                    expensesDescription: "Office Supplies",
                    expensesAmount: 100,
                    expensesDate: "2024-02-06T10:00:00Z",
                    budget: {
                        budgetId: 5,
                        budgetDescription: "School",
                        budgetAmount: 500,
                        user: {
                            id: 1,
                            name: "Jane",
                            email: "jane@example.com"
                        }
                    }
                }
            ]

        axios.get.mockResolvedValue({response: {status: 200, mockResponse}});

        await expect(getUserExpenses(userId)).resolves.toEqual(mockResponse.data);
    });

    // TC_UI_005: Verify Expense Retrieval Failure due to Nonexistent User
    it('TC_UI_005: should handle failure due to nonexistent user', async () => {

        const errorMessage = '[]';
        axios.get.mockRejectedValue({response: {data: errorMessage}});

        await expect(getBudgetsByUserId(999)).rejects.toThrow(errorMessage);
    });

    // TC_UI_006: Verify Expense Creation Failure due to Invalid Description
    it('TC_UI_006: should handle failure due to invalid expense description', async () => {
        const expenseData = {
            expensesDescription: "!!!***",
            expensesAmount: 50,
            expensesDate: "2024-06-15T10:00:00Z",
            budget: {
                budgetId: 1
            }
        };
        const errorMessage = "Invalid input: ExpensesDescription must be alphanumeric";
        axios.post.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(createExpense(expenseData)).rejects.toThrow(errorMessage);
    });

    // TC_UI_007: Verify Expense Creation Failure due to Duplicate Expense Name
    it('TC_UI_007: should handle failure due to duplicate expense name', async () => {

        const expenseData = {
            expensesDescription: "Office Supplies",
            expensesAmount: 100,
            expensesDate: "2024-02-14T10:00:00Z",
            budget: {
                budgetId: 1
            }
        };

        const errorMessage = 'An expense with the name "Office Supplies" already exists for this user.';
        axios.post.mockRejectedValue({ response: { status: 400, data: errorMessage } });

        await expect(createExpense(expenseData)).rejects.toThrow(errorMessage);
    });
});
