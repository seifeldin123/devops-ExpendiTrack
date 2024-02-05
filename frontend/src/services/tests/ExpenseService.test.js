import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getUserExpenses, createExpense } from '../ExpenseService'; // Adjust the import path

describe('ExpenseService', () => {
    let mock;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    const API_URL = 'http://localhost:8080/expenses';

    it('fetches expenses for a specific user successfully', async () => {
        const userId = 1;
        const expensesData = [
            { id: 1, description: 'Coffee', amount: 5, date: '2024-02-06T10:00:00Z', budgetId: 1 }
        ];
        mock.onGet(`${API_URL}/user/${userId}`).reply(200, expensesData);

        const response = await getUserExpenses(userId);
        expect(response.data).toEqual(expensesData);
    });

    it('creates a new expense successfully', async () => {
        const expenseData = { description: 'Books', amount: 20, date: '2024-02-07T10:00:00Z', budgetId: 2 };
        const formattedData = {
            ...expenseData,
            budget: { id: expenseData.budgetId }
        };
        mock.onPost(API_URL, formattedData).reply(201, {
            ...formattedData,
            id: 3 // Assuming an ID is assigned to the new expense by the server
        });

        const response = await createExpense(expenseData);
        expect(response.data).toEqual({
            ...formattedData,
            id: 3
        });
    });

    it('returns error message when creating an expense with invalid budget ID', async () => {
        const invalidExpenseData = { description: 'Gym Membership', amount: 30, date: '2024-02-08T10:00:00Z', budgetId: 999 };
        const formattedData = {
            ...invalidExpenseData,
            budget: { id: invalidExpenseData.budgetId }
        };
        mock.onPost(API_URL, formattedData).reply(400, 'Budget not found for ID: 999');

        try {
            await createExpense(invalidExpenseData);
            fail('Expected an error but none was thrown'); // This forces the test to fail if no error is thrown
        } catch (error) {
            expect(error.response.data).toEqual('Budget not found for ID: 999');
            expect(error.response.status).toEqual(400);
        }
    });

});
