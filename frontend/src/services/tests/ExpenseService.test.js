import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getUserExpenses, createExpense } from '../ExpenseService';

describe('ExpenseService', () => {
    let mock;
    const API_URL = 'http://localhost:8080/expenses';

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    describe('getUserExpenses', () => {
        const userId = 1;

        it('successfully retrieves expenses', async () => {
            const expenses = [{ id: 1, description: 'Coffee', amount: 5, date: '2024-02-06T10:00:00Z', budgetId: 1 }];
            mock.onGet(`${API_URL}/user/${userId}`).reply(200, expenses);

            const response = await getUserExpenses(userId);
            expect(response.data).toEqual(expenses);
        });

        it('fails to retrieve expenses due to server error', async () => {
            mock.onGet(`${API_URL}/user/${userId}`).networkError();

            await expect(getUserExpenses(userId)).rejects.toThrow('Network Error');
        });

        it('fails to retrieve expenses due to nonexistent user', async () => {
            const invalidUserId = 9999;
            mock.onGet(`${API_URL}/user/${invalidUserId}`).reply(404, 'User does not exist');

            await expect(getUserExpenses(invalidUserId)).rejects.toThrow('Request failed with status code 404');
        });
    });

    describe('createExpense', () => {
        const expenseData = {
            description: 'Lunch',
            amount: 15,
            date: '2024-02-06T12:00:00Z',
            budgetId: 1
        };

        it('successfully creates an expense', async () => {
            mock.onPost(API_URL).reply(200, { message: 'Expense added successfully' });

            const response = await createExpense(expenseData);
            expect(response.data.message).toBe('Expense added successfully');
        });

        it('fails to create an expense due to invalid data', async () => {
            mock.onPost(API_URL).reply(400, 'Invalid expense data');

            await expect(createExpense({ ...expenseData, amount: -10 })).rejects.toThrow('Request failed with status code 400');
        });

        it('fails to create an expense due to server error', async () => {
            mock.onPost(API_URL).networkError();

            await expect(createExpense(expenseData)).rejects.toThrow('Network Error');
        });
    });
});
