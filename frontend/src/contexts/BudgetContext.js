import React, { createContext, useContext, useState } from 'react';
import { getUserBudgets, createBudget } from '../services/BudgetService';

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
    const [budgets, setBudgets] = useState([]);

    const loadUserBudgets = async (userId) => {
        try {
            const response = await getUserBudgets(userId);
            // Assuming the response includes expenses to calculate remaining budget
            const budgetsData = response.data.map(budget => ({
                ...budget,
                remainingBudget: budget.budgetAmount - budget.expenses.reduce((total, expense) => total + expense.amount, 0)
            }));
            setBudgets(budgetsData);
        } catch (error) {
            console.error('Error fetching budgets', error);
        }
    };

    const addBudget = async (budgetData) => {
        try {
            const response = await createBudget({
                ...budgetData,
                budgetDescription: budgetData.description,
                budgetAmount: budgetData.amount
            });
            // Directly adding budget without calculating remaining since expenses are not given at creation
            setBudgets(currentBudgets => [...currentBudgets, response.data]);
        } catch (error) {
            console.error('Error adding budget', error);
            throw error;
        }
    };

    return (
        <BudgetContext.Provider value={{ budgets, loadUserBudgets, addBudget }}>
            {children}
        </BudgetContext.Provider>
    );
};
