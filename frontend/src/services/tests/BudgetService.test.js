// Import necessary modules and functions
import axios from 'axios';
import { createBudget, getBudgetsByUserId } from '../budgetService';

// Mock the axios module
jest.mock('axios');

// Start describing the budgetService tests
describe('budgetService', () => {
    // Describe the createBudget function
    describe('createBudget', () => {
        // Define sample budget data for testing
        const budgetData = { userId: 1, budgetDescription: 'Test Budget', budgetAmount: 1000 };

        // Test case for successful budget creation
        it('successfully creates a budget', async () => {
            // Define the expected response data
            const responseData = { message: 'Budget created successfully', data: budgetData };

            // Mock axios.post to resolve with responseData
            axios.post.mockResolvedValue({ data: responseData });

            // Ensure that createBudget resolves with the expected response data
            await expect(createBudget(budgetData)).resolves.toEqual(responseData);

            // Verify that axios.post was called with the correct parameters
            expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/budgets', budgetData);
        });

        // Test case for failing budget creation due to duplicate name
        it('fails to create a budget due to duplicate name', async () => {
            // Define the error message for duplicate name
            const errorMessage = 'A budget with this name already exists.';

            // Mock axios.post to reject with an error containing the error message
            axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

            // Ensure that createBudget rejects with the expected error message
            await expect(createBudget(budgetData)).rejects.toMatch(errorMessage);
        });
    });

    // Describe the getBudgetsByUserId function
    describe('getBudgetsByUserId', () => {
        // Define a sample user ID and budget data
        const userId = 1;
        const budgets = [{ id: 1, budgetDescription: 'Test Budget 1', budgetAmount: 1000 }];

        // Test case for successfully retrieving budgets for a user
        it('successfully retrieves budgets for a user', async () => {
            // Mock axios.get to resolve with the sample budgets data
            axios.get.mockResolvedValue({ data: budgets });

            // Ensure that getBudgetsByUserId resolves with the expected budgets data
            await expect(getBudgetsByUserId(userId)).resolves.toEqual(budgets);

            // Verify that axios.get was called with the correct URL parameter
            expect(axios.get).toHaveBeenCalledWith(`http://localhost:8080/budgets/user/${userId}`);
        });

        // Test case for failing to retrieve budgets due to network error
        it('fails to retrieve budgets due to network error', async () => {
            // Mock axios.get to reject with a network error
            axios.get.mockRejectedValue({ message: 'Network Error' });

            // Ensure that getBudgetsByUserId rejects with a specific error message
            await expect(getBudgetsByUserId(userId)).rejects.toBe('Failed to load budgets. Please refresh the page to try again.');
        });
    });
});
