import axios from 'axios';

const API_URL = 'http://localhost:8080/expenses';

export const getUserExpenses = (userId) => {
    return axios.get(`${API_URL}/user/${userId}`)
        .then(response => response.data)
        .catch(error => {
            // Throw an error directly for consistency with createBudget
            throw new Error(error.response?.data || 'Failed to load expenses. Please refresh the page to try again.');
        });
}; // Method to fetch expenses for a specific user


export const createExpense = (expenseData) => {
    const formattedData = {
        expensesDescription: expenseData.description,
        expensesAmount: expenseData.amount,
        expensesDate: expenseData.date, // Ensure this is in ISO string format, e.g., "2024-02-06T10:00:00Z"
        budget: {
            budgetId: expenseData.budgetId // Ensure this matches the type expected by your backend, likely a number
        }
    };
    return axios.post(API_URL, formattedData)
        .then(response => response.data)
        .catch(error => {
            // Throw an error directly with either the specific error message or a generic one
            throw new Error(error.response?.data || 'An error occurred while creating the expense. Please try again later.');
        });
};

