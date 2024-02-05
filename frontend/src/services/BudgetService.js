import axios from 'axios';

// Assuming the base URL for budget-related endpoints
const API_URL = 'http://localhost:8080/budgets';

// Function to create a budget by sending a POST request
export const createBudget = (budgetData) => {
    return axios.post(API_URL, budgetData)
        .then(response => response.data)
        .catch(error => {
            if (error.response && error.response.data && error.response.data.message) {
                // Specific error message from server, e.g., for duplicate budget names
                return Promise.reject(error.response.data.message);
            } else {
                // Generic error message for other errors
                return Promise.reject('An error occurred while creating the budget. Please try again later.');
            }
        });
};

// Function to retrieve all budgets for a user by their ID using a GET request
export const getBudgetsByUserId = (userId) => {
    return axios.get(`${API_URL}/user/${userId}`)
        .then(response => response.data)
        .catch(error => {
            return Promise.reject('Failed to load budgets. Please refresh the page to try again.');
        });
};
