import axios from 'axios';

const API_URL = 'http://localhost:8080/budgets';

export const createBudget = (budgetData) => {
    return axios.post(API_URL, budgetData)
        .then(response => response.data)
        .catch(error => {
            // Throw an error directly with either the specific error message or a generic one
            throw new Error(error.response?.data || 'An error occurred while creating the budget. Please try again later.');
        });
};

export const getBudgetsByUserId = (userId) => {
    return axios.get(`${API_URL}/user/${userId}`)
        .then(response => response.data)
        .catch(error => {
            // Throw an error directly for consistency with createBudget
            throw new Error(error.response?.data || 'Failed to load budgets. Please refresh the page to try again.');
        });
};