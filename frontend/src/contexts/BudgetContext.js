import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBudget, getBudgetsByUserId, getUserBudgets } from '../services/budgetService';
import { useUserContext } from "./UserContext";

// Create a context for managing budget-related state and functions
const BudgetContext = createContext();

// Custom hook to access the BudgetContext
export const useBudgetContext = () => useContext(BudgetContext);

// BudgetProvider component responsible for managing budgets
export const BudgetProvider = ({ children }) => {
    // State to hold the user-specific budgets
    const [budgets, setBudgets] = useState([]);

    // Access the current user from the UserContext (assuming useUserContext returns the current user object)
    const { user } = useUserContext();

    // useEffect to fetch user-specific budgets when the user changes
    useEffect(() => {
        if (user && user.id) {
            // Fetch budgets for the current user by their ID
            getBudgetsByUserId(user.id)
                .then(response => setBudgets(response.data))
                .catch(error => console.error('Error fetching user-specific budgets', error));
        }
    }, [user]); // Depend on user to refetch when the user changes

    // Function to add a new budget
    const addNewBudget = async (budgetData) => {
        try {
            // Check for duplicate budget titles
            const duplicate = budgets.some(budget => budget.budgetDescription === budgetData.budgetDescription);
            if (duplicate) {
                throw new Error('Budget with this title already exists');
            }

            // Adjust the structure to match backend expectations
            const formattedBudgetData = {
                budgetDescription: budgetData.budgetDescription,
                budgetAmount: budgetData.budgetAmount,
                user: { id: budgetData.userId }
            };

            // Create the budget on the backend and update the local state
            const response = await createBudget(formattedBudgetData);
            setBudgets(prevBudgets => [...prevBudgets, response.data]);
        } catch (error) {
            console.error('Error adding budget', error);
            throw error;
        }
    };

    // Provide the budgets and addNewBudget function to child components via the BudgetContext
    return (
        <BudgetContext.Provider value={{ budgets, addNewBudget }}>
            {children}
        </BudgetContext.Provider>
    );
};
