import axios from 'axios';

const API_URL = 'http://localhost:8080/budgets';


export const getUserBudgets = (userId) => axios.get(`${API_URL}/user/${userId}`);

export const createBudget = (budgetData) => axios.post(API_URL, budgetData);

