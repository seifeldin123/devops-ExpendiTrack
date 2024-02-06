import React, { createContext, useContext, useState, useEffect } from 'react';
import { createExpense, getUserExpenses } from '../services/ExpenseService';
import { useUserContext } from "./UserContext";

const ExpenseContext = createContext();

export const useExpenseContext = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const { user } = useUserContext(); // Use UserContext to get the current user
    const [error, setError] = useState(''); // State to manage any errors

    useEffect(() => {
        if (user && user.id) {
            fetchExpenses(user.id); // Use fetchExpenses to load user-specific expenses
        }
    }, [user]);

    // Function to fetch user-specific expenses
    const fetchExpenses = async (userId) => {
        try {
            const response = await getUserExpenses(userId);
            setExpenses(response.data); // Update the expenses state with fetched data
        } catch (error) {
            console.error('Error fetching user-specific expenses', error);
            setError('Failed to fetch expenses'); // Optionally, update the error state
        }
    };

    const addNewExpense = async (expenseData) => {
        try {
            const response = await createExpense(expenseData);
            setExpenses(prevExpenses => [...prevExpenses, response.data]);
            setError(''); // Reset error on successful addition
        } catch (error) {
            console.error('Error adding expense', error);
            setError('Failed to add expense'); // Update error state on failure
        }
    };

    // Function to reset error state
    const resetError = () => setError('');

    return (
        <ExpenseContext.Provider value={{ expenses, addNewExpense, fetchExpenses, error, resetError }}>
            {children}
        </ExpenseContext.Provider>
    );
};
