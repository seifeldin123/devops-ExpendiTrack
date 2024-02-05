import axios from 'axios';

const API_URL = 'http://localhost:8080/expenses';

export const getUserExpenses = (userId) => axios.get(`${API_URL}/user/${userId}`); // Method to fetch expenses for a specific user


export const createExpense = (expenseData) => {
    const formattedData = {
        ...expenseData,
        budget: { id: expenseData.budgetId }
    };
    return axios.post(API_URL, formattedData);
};

