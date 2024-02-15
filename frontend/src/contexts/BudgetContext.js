import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBudget, getBudgetsByUserId } from '../services/BudgetService';
import { useUserContext } from "./UserContext";

// Create a context for managing budget-related state and functions
export const BudgetContext = createContext();

// Custom hook to access the BudgetContext
export const useBudgetContext = () => useContext(BudgetContext);

// BudgetProvider component responsible for managing budgets
export const BudgetProvider = ({ children }) => {
    // State to hold the user-specific budgets
    const [budgets, setBudgets] = useState([]);

    // Access the current user from the UserContext
    const { user } = useUserContext();

    const [error, setError] = useState('');


    // useEffect to fetch user-specific budgets when the user changes
    useEffect(() => {
        if (user && user.id) {
            getBudgetsByUserId(user.id)
                .then(response => {
                    setBudgets(response.data);
                    setError(''); // Clear any existing error upon successful fetch
                })
                .catch(error => {
                    console.error('Error fetching user-specific budgets', error);
                    setError('Failed to fetch budgets'); // Set a specific error message upon failure
                });
        } else {
            setBudgets([]); // Reset budgets if no user is present
        }
    }, [user]);

    // Function to add a new budget
    const addNewBudget = async (budgetData) => {
        try {
            const formattedBudgetData = {
                budgetDescription: budgetData.budgetDescription,
                budgetAmount: budgetData.budgetAmount,
                user: { id: user.id },
            };

            const newBudget = await createBudget(formattedBudgetData);
            // Update the budgets state to include the new budget
            setBudgets(prevBudgets => [...(Array.isArray(prevBudgets) ? prevBudgets : []), newBudget]);
            setError(''); // Reset any previous error
        } catch (error) {
            console.error('Error adding budget:', error);
            setError(error.toString()); // Set the caught error message
        }
    };

    const fetchBudgets = async (userId) => {
        try {
            const fetchedBudgets = await getBudgetsByUserId(userId);
            setBudgets(fetchedBudgets); // Update budgets state with fetched data
        } catch (error) {
            console.error('Failed to load budgets:', error);
            // Optionally, set an error state to display an error message
        }
    };


    // Provide the budgets and addNewBudget function to child components via the BudgetContext
    return (
        <BudgetContext.Provider value={{ budgets, addNewBudget, fetchBudgets ,error, resetError: () => setError('') }}>
            {children}
        </BudgetContext.Provider>

    );
};