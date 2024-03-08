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
            console.log(error.message)
            const language = localStorage.getItem("i18nextLng");
            let message = '';
            // if (error.message === "Invalid input: Budget amount cannot be negative or zero."
            //     && localStorage.getItem("i18nextLng") === "en") {
            //     setError("asd")
            // }
            // const errorMessage = error.message || 'An unexpected error occurred';
            if (error.message === "Invalid input: Budget amount cannot be negative or zero.") {
                if (language === "en") {
                    message = error.message;
                } else if (language === "fr") {
                    message = "Saisie non valide: le montant du budget ne peut pas être négatif ou nul.";
                }

            } else if (error.message === "Invalid input: BudgetDescription must be alphanumeric") {
                if (language === "en") {
                    message = error.message
                } else if (language === "fr") {
                    message = "Saisie non valide : la description du budget doit être alphanumérique."
                }
            } else {
                message = "An unexpected error occurred";
            }
             setError(message);
        }

    }, [userId]); // Corrected dependency

    const updateExistingBudget = useCallback(async (budgetId, budgetData) => {
        if (!budgetId) {
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
            // const errorMessage = error.message || 'An unexpected error occurred';
            // setError(errorMessage);
            console.log(error.message)
            const language = localStorage.getItem("i18nextLng");
            let message = '';
            // if (error.message === "Invalid input: Budget amount cannot be negative or zero."
            //     && localStorage.getItem("i18nextLng") === "en") {
            //     setError("asd")
            // }
            // const errorMessage = error.message || 'An unexpected error occurred';
            if (error.message === "Invalid input: Budget amount cannot be negative or zero.") {
                if (language === "en") {
                    message = error.message;
                } else if (language === "fr") {
                    message = "Saisie non valide: le montant du budget ne peut pas être négatif ou nul.";
                }

            } else if (error.message === "Invalid input: BudgetDescription must be alphanumeric") {
                if (language === "en") {
                    message = error.message
                } else if (language === "fr") {
                    message = "Saisie non valide : la description du budget doit être alphanumérique."
                }
            } else {
                message = "An unexpected error occurred";
            }
            setError(message);
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
        setError,
        resetError,
    }), [budgets, addNewBudget, updateExistingBudget, removeBudget, fetchBudgets, error, resetError]);

    return (
        <BudgetContext.Provider value={providerValue}>
            {children}
        </BudgetContext.Provider>
    );
};
