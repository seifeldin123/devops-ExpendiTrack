import {createBudget, getBudgetsByUserId} from "../BudgetService";

jest.mock('axios');
import axios from 'axios';
import {createExpense, deleteExpense, getUserExpenses, updateExpense} from '../ExpenseService';

describe('ExpenseService', () => {
    beforeEach(() => {
        axios.post.mockClear();
        axios.get.mockClear();
        axios.put.mockClear();
        axios.delete.mockClear();
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

    // TC_UI_008: Verify Successful Expense Update
    it('TC_UI_007: should successfully update an expense', async () => {
        const expenseId = 1; // Assuming this ID exists
        const updateData = {
            expensesDescription: "Updated Office Supplies",
            expensesAmount: 150,
            expensesDate: "2024-05-20T10:00:00Z",
            budget: { budgetId: 1 }
        };
        const mockResponse = { ...updateData, expensesId: expenseId };

        axios.put.mockResolvedValue({ data: mockResponse });

        await expect(updateExpense(expenseId, updateData)).resolves.toEqual(mockResponse);
    });

// TC_UI_009: Attempt to delete a non-existent expense
    it('TC_UI_008: should handle deletion of a non-existent expense', async () => {
        const expenseId = 9999; // Non-existent ID
        const errorMessage = "Expense with ID 9999 not found";

        axios.delete.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(deleteExpense(expenseId)).rejects.toThrow(errorMessage);
    });

    // TC_UI_010: Update expense with a non-existent budget ID
    it('TC_UI_09: should fail to update due to non-existent budget ID', async () => {
        const expenseId = 2;
        const updateData = {
            expensesDescription: "Updated Description",
            expensesAmount: 200,
            expensesDate: "2024-07-20T10:00:00Z",
            budget: { budgetId: 9999 } // Non-existent budget ID
        };
        const errorMessage = "Budget with ID 9999 not found";

        axios.put.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(updateExpense(expenseId, updateData)).rejects.toThrow(errorMessage);
    });

    // TC_UI_011: Attempt to update an expense with a negative amount
    it('TC_UI_010: should fail to update due to negative expense amount', async () => {
        const expenseId = 3;
        const updateData = {
            expensesDescription: "Negative Amount",
            expensesAmount: -50,
            expensesDate: "2024-08-15T10:00:00Z",
            budget: { budgetId: 1 }
        };
        const errorMessage = "Invalid input: expenses amount cannot be negative.";

        axios.put.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(updateExpense(expenseId, updateData)).rejects.toThrow(errorMessage);
    });

    // TC_UI_012: Update an expense with a non-alphanumeric description
    it('TC_UI_011: should fail to update due to non-alphanumeric description', async () => {
        const expenseId = 4;
        const updateData = {
            expensesDescription: "!!!###",
            expensesAmount: 50,
            expensesDate: "2024-09-10T10:00:00Z",
            budget: { budgetId: 1 }
        };
        const errorMessage = "Invalid input: ExpensesDescription must be alphanumeric";

        axios.put.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(updateExpense(expenseId, updateData)).rejects.toThrow(errorMessage);
    });

    // TC_UI_013: Successfully delete an expense
    it('TC_UI_012: should successfully delete an expense', async () => {
        const expenseId = 1; // Assuming this ID exists and can be deleted
        const successMessage = "Expense with ID 1 deleted successfully";

        axios.delete.mockResolvedValue({ data: successMessage });

        await expect(deleteExpense(expenseId)).resolves.toEqual(successMessage);
    });

    // TC_UI_014: Simulate network error
    it('TC_UI_013: should handle network error gracefully', async () => {
        const networkErrorMessage = "Failed to load expenses. Please refresh the page to try again.";
        axios.get.mockRejectedValue(new Error(networkErrorMessage));

        await expect(getUserExpenses(1)).rejects.toThrow(networkErrorMessage);
    });

});
