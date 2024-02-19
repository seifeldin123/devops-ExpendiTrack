import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getBudgetsByUserId, createBudget } from '../services/BudgetService';
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
            console.log("fetch budgets", response);
            if (Array.isArray(response)) {
                setBudgets(response);
            } else {
                console.error('Expected an array but got:', typeof response);
                setError('Failed to fetch budgets correctly');
            }
        } catch (error) {
            console.error('Failed to load budgets:', error);
            setError('Failed to fetch budgets');
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
            console.log("added budgets" + response);
            setError('');
        } catch (error) {
            console.error('Error adding budget:', error);
            setError('Failed to add budget');
        }
    }, [userId]); // Corrected dependency

    const resetError = useCallback(() => setError(''), []);

    const providerValue = useMemo(() => ({
        budgets,
        addNewBudget,
        fetchBudgets,
        error,
        resetError,
    }), [budgets, addNewBudget, fetchBudgets, error, resetError]); // Corrected dependencies

    return (
        <BudgetContext.Provider value={providerValue}>
            {children}
        </BudgetContext.Provider>
    );
};
