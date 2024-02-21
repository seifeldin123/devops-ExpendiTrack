import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {getBudgetsByUserId, createBudget, deleteBudget, updateBudget} from '../services/BudgetService';
import { useUserContext } from "./UserContext";

export const BudgetContext = createContext();

export const useBudgetContext = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
    const [budgets, setBudgets] = useState([]);
    const { user } = useUserContext();
    const [error, setError] = useState('');
    const userId = user?.id;

    const fetchBudgets = useCallback(async (userId) => {
        try {
            const response = await getBudgetsByUserId(userId);
            if (Array.isArray(response)) {
                setBudgets(response);
            } else {
                setError('Failed to fetch budgets correctly');
            }
        } catch (error) {
            const errorMessage = error.message || 'An unexpected error occurred';
            setError(errorMessage);
        }
    }, []);


    useEffect(() => {
        if (userId) {
            fetchBudgets(userId);
        }
    }, [userId, fetchBudgets]);

    const addNewBudget = useCallback(async (budgetData) => {
        try {
            const response = await createBudget({
                ...budgetData,
                userId: userId,
            });
            setBudgets(prevBudgets => [...prevBudgets, response]);
            setError('');

        } catch (error) {
            const errorMessage = error.message || 'An unexpected error occurred';
            setError(errorMessage);
        }

    }, [userId]); // Corrected dependency

    const updateExistingBudget = useCallback(async (budgetId, budgetData) => {
        if (!budgetId) {
            // console.error('budgetId is undefined');
            setError('Failed to update budget: Missing budget ID');
            return;
        }
        try {
            const updatedBudget = await updateBudget(budgetId, budgetData);
            setBudgets((prevBudgets) =>
                prevBudgets.map((budget) => budget.budgetId === budgetId ? { ...budget, ...updatedBudget } : budget)
            );
            setError('');
        } catch (error) {
            const errorMessage = error.message || 'An unexpected error occurred';
            setError(errorMessage);
        }
    }, [setBudgets, setError]);

    const removeBudget = useCallback(async (budgetId) => {
        try {
            await deleteBudget(budgetId);
            setBudgets(prevBudgets => prevBudgets.filter(budget => budget.budgetId !== budgetId));
            setError('');
        } catch (error) {
            const errorMessage = error.message || 'An unexpected error occurred';
            setError(errorMessage);
        }
    }, [setBudgets, setError]);



    const resetError = useCallback(() => setError(''), []);

    const providerValue = useMemo(() => ({
        budgets,
        addNewBudget,
        updateExistingBudget,
        removeBudget,
        fetchBudgets,
        error,
        resetError,
    }), [budgets, addNewBudget, updateExistingBudget, removeBudget, fetchBudgets, error, resetError]);

    return (
        <BudgetContext.Provider value={providerValue}>
            {children}
        </BudgetContext.Provider>
    );
};
