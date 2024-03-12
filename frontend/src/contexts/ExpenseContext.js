import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getUserExpenses, createExpense, updateExpense, deleteExpense } from '../services/ExpenseService';
import { useUserContext } from "./UserContext";
import {useTranslation} from "react-i18next";

export const ExpenseContext = createContext();

export const useExpenseContext = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const { user } = useUserContext();

    const [error, setError] = useState('');
    const userId = user?.id; // Extract userId for dependency tracking

    const { t, i18n } = useTranslation();

    // Update to hold the error message key instead of the translated message
    const [errorKey, setErrorKey] = useState('');
    const [dynamicErrorContent, setDynamicErrorContent] = useState({});

    const errorMapping = useMemo(() => ({
        "invalid input: expenses amount cannot be negative.": "app.invalidExpenseInput",
        "invalid input: expensesdescription must be alphanumeric": "app.expenseDescriptionError",
        "unexpectederror": "app.unexpectedError",
    }), []);


    useEffect(() => {
        const handleLanguageChange = () => {
            if (errorKey) {
                setError(t(errorKey, dynamicErrorContent));
            }
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n, errorKey, dynamicErrorContent, t]);

    const fetchExpenses = useCallback(async (userId) => {
        try {
            const response = await getUserExpenses(userId);
            if (Array.isArray(response)) {
                setExpenses(response);
            } else {
                setError('Failed to fetch expenses correctly');
            }
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
            if (error.message.startsWith("An expense with the name")) {
                const expenseNameMatch = error.message.match(/"([^"]+)"/);
                const expenseName = expenseNameMatch ? expenseNameMatch[1] : "Unknown";

                setDynamicErrorContent({ name: expenseName });
                setErrorKey("app.expenseExistsError");
                setError(t("app.expenseExistsError", { name: expenseName }));

            } else {
                // const key = errorMapping[error.message] || "app.unexpectedError";
                // setErrorKey(key);
                // setError(t(key));
                const normalizedErrorMessage = error.message.toLowerCase();
                const key = errorMapping[normalizedErrorMessage] || "app.unexpectedError";
                setErrorKey(key);
                setError(t(key));
            }
        }
    }, [userId, errorMapping, t]); // Removed 'expenses' from the dependency array

    const updateExistingExpense = useCallback(async (expenseId, expenseData) => {
        try {
            const updatedExpense = await updateExpense(expenseId, expenseData);
            const updatedExpenses = expenses.map(expense =>
                expense.expensesId === updatedExpense.expensesId ? updatedExpense : expense
            );
            setExpenses(updatedExpenses);
            setError('');
        } catch (error) {

            if (error.message.startsWith("An expense with the name")) {
                const expenseNameMatch = error.message.match(/"([^"]+)"/);
                const expenseName = expenseNameMatch ? expenseNameMatch[1] : "Unknown";

                setDynamicErrorContent({ name: expenseName });
                setErrorKey("app.expenseExistsError");
                setError(t("app.expenseExistsError", { name: expenseName }));

            } else {
                // const key = errorMapping[error.message] || "app.unexpectedError";
                // setErrorKey(key);
                // setError(t(key));
                const normalizedErrorMessage = error.message.toLowerCase();
                const key = errorMapping[normalizedErrorMessage] || "app.unexpectedError";
                setErrorKey(key);
                setError(t(key));
            }
        }
    }, [expenses, errorMapping, t, setExpenses, setError]);

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
        resetError, // Now stable across renders
        setError
    }), [expenses, addNewExpense, updateExistingExpense, removeExpense, fetchExpenses, error, resetError]);

    return (
        <ExpenseContext.Provider value={providerValue}>
            {children}
        </ExpenseContext.Provider>
    );
};