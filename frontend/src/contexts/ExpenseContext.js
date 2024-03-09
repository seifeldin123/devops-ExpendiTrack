import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getUserExpenses, createExpense, updateExpense, deleteExpense } from '../services/ExpenseService';
import { useUserContext } from "./UserContext";

export const ExpenseContext = createContext();

export const useExpenseContext = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    // const { user } = useUserContext();
    const { user, language } = useUserContext();

    const [error, setError] = useState('');
    const userId = user?.id; // Extract userId for dependency tracking

    const fetchExpenses = useCallback(async (userId) => {
        try {
            const response = await getUserExpenses(userId);
            if (!Array.isArray(response)) {
                throw new Error("Fetched data is not an array");
            }
            setExpenses(response);
        } catch (error) {
            const errorMessage = error.message || 'An unexpected error occurred';
            setError(errorMessage);
        }
    }, []); // Empty dependencies array since it's intended to be a generic fetch function

    useEffect(() => {
        if (userId) {
            fetchExpenses(userId);
        }
    }, [userId, fetchExpenses]);

    // Use useCallback to memoize addNewExpense to keep it stable across renders
    const addNewExpense = useCallback(async (expenseData) => {

        if (!userId) return; // Guard clause to ensure userId is available

        try {
            const response = await createExpense({
                ...expenseData,
                userId: userId,
            });
            setExpenses(prevExpenses => Array.isArray(prevExpenses) ? [...prevExpenses, response] : [response]);
            setError('');
        } catch (error) {
            // const errorMessage = error.message || 'An unexpected error occurred';
            // setError(errorMessage);
            console.log(error.message)
            // const language = localStorage.getItem("i18nextLng");
            let message = '';

            if (error.message === "Invalid input: expenses amount cannot be negative.") {
                if (language === "en") {
                    message = error.message;
                } else if (language === "fr") {
                    message = "Saisie invalide : le montant des dépenses ne peut pas être négatif.";
                }

            } else if (error.message === "Invalid input: ExpensesDescription must be alphanumeric") {
                if (language === "en") {
                    message = error.message
                } else if (language === "fr") {
                    message = "Entrée non valide : BudgetDescription doit être alphanumérique"
                }
            } else if (error.message.startsWith("An expense with the name")) {
                if (language === "en") {
                    message = error.message
                } else {
                    message = "Un depense avec ce nom existe déjà."
                }
            } else {
                message = "An unexpected error occurred";
            }
            setError(message);
        }
    }, [userId, language]); // Removed 'expenses' from the dependency array

    const updateExistingExpense = useCallback(async (expenseId, expenseData) => {
        try {
            const updatedExpense = await updateExpense(expenseId, expenseData);
            const updatedExpenses = expenses.map(expense =>
                expense.expensesId === updatedExpense.expensesId ? updatedExpense : expense
            );
            setExpenses(updatedExpenses);
            setError('');
        } catch (error) {
            // const errorMessage = error.message || 'An unexpected error occurred';
            // setError(errorMessage);
            console.log(error.message)
            // const language = localStorage.getItem("i18nextLng");
            let message = '';

            if (error.message === "Invalid input: Expenses amount cannot be negative.") {
                if (language === "en") {
                    message = error.message;
                } else if (language === "fr") {
                    message = "Saisie invalide : le montant des dépenses ne peut pas être négatif.";
                }

            } else if (error.message === "Invalid input: ExpensesDescription must be alphanumeric") {
                if (language === "en") {
                    message = error.message
                } else if (language === "fr") {
                    message = "Entrée non valide : BudgetDescription doit être alphanumérique"
                }
            } else {
                message = "An unexpected error occurred";
            }
            setError(message);
        }
    }, [expenses, language, setExpenses, setError]);

    const removeExpense = useCallback(async (expenseId) => {

        if (!userId) return; // Guard clause to ensure userId is available

        try {
            await deleteExpense(expenseId);
            setExpenses(prevExpenses =>
                prevExpenses.filter(expense => expense.expensesId !== expenseId)
            );
            setError('');
            await fetchExpenses(userId); // Fetch expenses again to update UI
        } catch (error) {
            const errorMessage = error.message || 'An unexpected error occurred';
            setError(errorMessage);
        }
    }, [userId, setExpenses, setError, fetchExpenses]);

    const resetError = useCallback(() => setError(''), []); // Wrap resetError in useCallback

    // Use useMemo to memoize the context value to prevent unnecessary re-renders
    const providerValue = useMemo(() => ({
        expenses,
        addNewExpense,
        updateExistingExpense,
        removeExpense,
        fetchExpenses,
        error,
        resetError // Now stable across renders
    }), [expenses, addNewExpense, updateExistingExpense, removeExpense, fetchExpenses, error, resetError]);

    return (
        <ExpenseContext.Provider value={providerValue}>
            {children}
        </ExpenseContext.Provider>
    );
};