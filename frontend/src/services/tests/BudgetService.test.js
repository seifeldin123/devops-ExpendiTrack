import axios from 'axios';
import { getUserBudgets, createBudget } from '../BudgetService';

// Mock the axios module
jest.mock('axios');

describe('BudgetService', () => {
    const userId = 1;
    const budgetsMock = [{ id: 1, name: 'Test Budget', amount: 1000 }];
    const newBudget = { name: 'New Budget', amount: 500 };

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        axios.get.mockClear();
        axios.post.mockClear();
    });

    it('fetches budgets for a user', async () => {
        // Setup mock to resolve with mock data
        axios.get.mockResolvedValue({ data: budgetsMock });

        const result = await getUserBudgets(userId);

        // Assert that axios.get was called with the correct URL
        expect(axios.get).toHaveBeenCalledWith(`http://localhost:8080/budgets/user/${userId}`);

        // Assert that the result is as expected
        expect(result.data).toEqual(budgetsMock);
    });

    it('creates a new budget', async () => {
        // Setup mock to resolve with mock data including a new budget
        axios.post.mockResolvedValue({ data: newBudget });

        const result = await createBudget(newBudget);

        // Assert that axios.post was called with the correct URL and budget data
        expect(axios.post).toHaveBeenCalledWith(`http://localhost:8080/budgets`, newBudget);

        // Assert that the result is as expected
        expect(result.data).toEqual(newBudget);
    });

});
