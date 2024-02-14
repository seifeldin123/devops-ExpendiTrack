import axios from 'axios';

const API_URL = 'http://localhost:8080/budgets';

export const createBudget = (budgetData) => {
    return axios.post(API_URL, budgetData)
        .then(response => response.data)
        .catch(error => {
            if (error.response?.status === 400) {
                // If the status is 400, return the error message from the response data
                return Promise.reject(error.response.data);
            } else {
                // For other errors, return a generic error message
                return Promise.reject('An error occurred while creating the budget. Please try again later.');
            }
        });
};


export const getBudgetsByUserId = (userId) => {
    return axios.get(`${API_URL}/user/${userId}`)
        .then(response => response.data)
        .catch(error => {
            return Promise.reject('Failed to load budgets. Please refresh the page to try again.');
        });
};
