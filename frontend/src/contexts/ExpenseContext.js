import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getUserExpenses, createExpense } from '../services/ExpenseService';
import { useUserContext } from "./UserContext";

export const ExpenseContext = createContext();

export const useExpenseContext = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const { user } = useUserContext();
    const [error, setError] = useState('');
    const userId = user?.id; // Extract userId for dependency tracking

    const fetchExpenses = useCallback(async (userId) => {
        try {
            const response = await getUserExpenses(userId);
            console.log("Fetched expenses:", response);
            if (!Array.isArray(response)) {
                throw new Error("Fetched data is not an array");
            }
            setExpenses(response);
        } catch (error) {
            console.error('Error fetching user-specific expenses', error);
            setError('Failed to fetch expenses');
        }
    }, []); // Empty dependencies array since it's intended to be a generic fetch function

    useEffect(() => {
        setError('');
        if (userId) {
            fetchExpenses(userId);
        }
        // else {
        //     setExpenses([]);
        // }
    }, [userId, fetchExpenses]);

    // Use useCallback to memoize addNewExpense to keep it stable across renders
    const addNewExpense = useCallback(async (expenseData) => {
        try {
            const response = await createExpense({
                ...expenseData,
                userId: userId,
            });
            setExpenses(prevExpenses => Array.isArray(prevExpenses) ? [...prevExpenses, response] : [response]);
            console.log("added expenses:", response);
            setError('');
        } catch (error) {
            console.error('Error adding expense', error);
            setError('Failed to add expense');
        }
    }, [userId]); // Removed 'expenses' from the dependency array


    const resetError = () => setError('');

    // Use useMemo to memoize the context value to prevent unnecessary re-renders
    const providerValue = useMemo(() => ({
        expenses, addNewExpense, fetchExpenses, error, resetError
    }), [expenses, addNewExpense, fetchExpenses, error]);

    return (
        <ExpenseContext.Provider value={providerValue}>
            {children}
        </ExpenseContext.Provider>
    );
};
