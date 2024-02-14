import axios from 'axios';

const API_URL = 'http://localhost:8080/expenses';

export const getUserExpenses = (userId) => axios.get(`${API_URL}/user/${userId}`); // Method to fetch expenses for a specific user


export const createExpense = (expenseData) => {
    const formattedData = {
        expensesDescription: expenseData.description,
        expensesAmount: expenseData.amount,
        expensesDate: expenseData.date, // Ensure this is in ISO string format, e.g., "2024-02-06T10:00:00Z"
        budget: {
            budgetId: expenseData.budgetId // Ensure this matches the type expected by your backend, likely a number
        }
    };
    return axios.post(API_URL, formattedData);
};

