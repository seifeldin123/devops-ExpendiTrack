jest.mock('axios');
import axios from 'axios';
import {createBudget, getBudgetsByUserId} from '../BudgetService'; // Adjust the path as needed

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
});
