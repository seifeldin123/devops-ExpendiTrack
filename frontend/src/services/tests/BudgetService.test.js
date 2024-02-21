
jest.mock('axios');
import axios from 'axios';
import {createBudget, deleteBudget, getBudgetsByUserId, updateBudget} from '../BudgetService';

describe('BudgetService', () => {
    // TC_UI_001: Verify Successful Budget Creation
    it('TC_UI_001: should create a budget successfully', async () => {
        const budgetData = {
            budgetDescription: "MonthlySavings",
            budgetAmount: 500,
            user: {id: 1}
        };

        const mockResponse = {
            budgetId: 1,
            budgetDescription: "MonthlySavings",
            budgetAmount: 500,
            user: {
                id: 1,
                name: null,
                email: null
            }
        };

        axios.post.mockResolvedValue({response: {status: 201, mockResponse}});

        await expect(createBudget(budgetData)).resolves.toEqual(mockResponse.data);
    });



    // TC_UI_002: Verify Budget Creation Failure due to Duplicate Budget Name
    it('TC_UI_002: should handle duplicate budget name error', async () => {
        const errorMessage = 'A budget with the name "ExistingBudget" already exists for this user.';

        axios.post.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(createBudget({
            userId: 1,
            budgetDescription: "ExistingBudget",
            budgetAmount: 300
        })).rejects.toThrow(errorMessage);

    });

    // TC_UI_003: Verify Budget Creation Failure due to Non-Existent User
    it('TC_UI_003: should handle non-existent user error', async () => {
        const errorMessage = 'Invalid input: User with ID 999 not found.';
        axios.post.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(createBudget({
            userId: 999,
            budgetDescription: "NewBudget",
            budgetAmount: 200
        })).rejects.toThrow(errorMessage);
    });

    // TC_UI_004: Verify Budget Creation Failure due to Invalid Budget Amount
    it('TC_UI_004: should handle invalid budget amount error', async () => {
        const errorMessage = 'Invalid input: Budget amount cannot be negative.';
        axios.post.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(createBudget({
            userId: 1,
            budgetDescription: "InvalidBudget",
            budgetAmount: -100
        })).rejects.toThrow(errorMessage);
    });

    // TC_UI_005: Verify Successful Budget Retrieval
    it('TC_UI_005: should fetch user-specific budgets successfully', async () => {
        const mockResponse = [
            {
                budgetId: 1,
                budgetDescription: "MonthlySavings",
                budgetAmount: 500,
                user: {
                    id: 1,
                    name: "Jane",
                    email: "jane@example.com"
                }
            }];
        axios.get.mockResolvedValue({response: {status: 200, mockResponse}});

        await expect(getBudgetsByUserId(1)).resolves.toEqual(mockResponse.data);
    });

    // TC_UI_006: Verify Budget Retrieval Failure due to Server Error
    it('TC_UI_006: should handle server error during budget retrieval', async () => {
        axios.get.mockRejectedValue(new Error('Failed to load budgets. Please refresh the page to try again.'));

        await expect(getBudgetsByUserId(1)).rejects.toThrow('Failed to load budgets. Please refresh the page to try again.');
    });

    // TC_UI_007: Verify Budget Retrieval Failure due to Nonexistent User
    it('TC_UI_007: should handle user not existing during budget retrieval', async () => {
        // Assuming similar error handling for getBudgetsByUserId as createBudget for consistency
        const errorMessage = '[]';
        axios.get.mockRejectedValue({response: {data: errorMessage}});

        await expect(getBudgetsByUserId(999)).rejects.toThrow(errorMessage);
    });

    // TC_UI_008: Verify Budget Creation Failure due to Invalid Budget Name
    it('TC_UI_008: should reject budget creation due to invalid budget name', async () => {
        const errorMessage = 'Invalid input: BudgetDescription must be alphanumeric';
        axios.post.mockRejectedValue({response: {status: 400, data: errorMessage}});

        await expect(createBudget({
            userId: 1,
            budgetDescription: "!@#$%",
            budgetAmount: 200
        })).rejects.toThrow(errorMessage);
    });

    // Verify successful budget update
    it('TC_UI_009: should update a budget successfully', async () => {
        const budgetId = 1;
        const budgetUpdateData = {
            budgetDescription: "Updated MonthlySavings",
            budgetAmount: 600,
        };
        const mockResponse = {
            budgetId: 1,
            ...budgetUpdateData,
        };

        axios.put.mockResolvedValue({ data: mockResponse });

        await expect(updateBudget(budgetId, budgetUpdateData)).resolves.toEqual(mockResponse);
    });

    // Verify failure on updating a non-existent budget
    it('TC_UI_010: should handle error when updating a non-existent budget', async () => {
        const budgetId = 999; // Assuming this ID does not exist
        const budgetUpdateData = { budgetDescription: "NonExistent", budgetAmount: 300 };
        const errorMessage = 'Budget not found';

        axios.put.mockRejectedValue({ response: { data: errorMessage } });

        await expect(updateBudget(budgetId, budgetUpdateData)).rejects.toThrow(errorMessage);
    });

    // Verify failure on server error during budget update
    it('TC_UI_011: should handle server error during budget update', async () => {
        const budgetId = 2;
        const budgetUpdateData = { budgetDescription: "Update Fail", budgetAmount: 400 };
        const errorMessage = 'An error occurred while updating the budget. Please try again later.';

        axios.put.mockRejectedValue(new Error(errorMessage));

        await expect(updateBudget(budgetId, budgetUpdateData)).rejects.toThrow(errorMessage);
    });

    // Verify successful budget deletion
    it('TC_UI_012: should delete a budget successfully', async () => {
        const budgetId = 1;
        const mockResponse = { message: "Budget deleted successfully" };

        axios.delete.mockResolvedValue({ data: mockResponse });

        await expect(deleteBudget(budgetId)).resolves.toEqual(mockResponse);
    });

    // Verify failure on deleting a non-existent budget
    it('TC_UI_013: should handle error when deleting a non-existent budget', async () => {
        const budgetId = 999; // Assuming this ID does not exist
        const errorMessage = 'Budget not found';

        axios.delete.mockRejectedValue({ response: { data: errorMessage } });

        await expect(deleteBudget(budgetId)).rejects.toThrow(errorMessage);
    });

    // Verify failure on server error during budget deletion
    it('TC_UI_014: should handle server error during budget deletion', async () => {
        const budgetId = 2;
        const errorMessage = 'An error occurred while deleting the budget. Please try again later.';

        axios.delete.mockRejectedValue(new Error(errorMessage));

        await expect(deleteBudget(budgetId)).rejects.toThrow(errorMessage);
    });

    it('TC_UI_015: should handle duplicate budget name error on update', async () => {
        const budgetId = 2; // Assuming this ID exists
        const budgetUpdateData = {
            budgetDescription: "ExistingBudgetName",
            budgetAmount: 300
        };
        const errorMessage = 'A budget with the name "ExistingBudgetName" already exists for this user.';

        axios.put.mockRejectedValue({ response: { data: errorMessage } });

        await expect(updateBudget(budgetId, budgetUpdateData)).rejects.toThrow(errorMessage);
    });

    it('TC_UI_016: should handle non-existent user error on budget update', async () => {
        const budgetId = 3; // Assuming this ID exists
        const errorMessage = 'User with ID 999 not found.';
        const budgetUpdateData = {
            budgetDescription: "SomeBudget",
            budgetAmount: 500,
            user: { id: 999 } // Non-existent user ID
        };

        axios.put.mockRejectedValue({ response: { data: errorMessage } });

        await expect(updateBudget(budgetId, budgetUpdateData)).rejects.toThrow(errorMessage);
    });

    it('TC_UI_017: should prevent budget deletion when linked expenses exist', async () => {
        const budgetId = 4; // Assuming this ID exists and has linked expenses
        const errorMessage = 'Budget cannot be deleted as it has linked expenses.';

        axios.delete.mockRejectedValue({ response: { data: errorMessage } });

        await expect(deleteBudget(budgetId)).rejects.toThrow(errorMessage);
    });

});



