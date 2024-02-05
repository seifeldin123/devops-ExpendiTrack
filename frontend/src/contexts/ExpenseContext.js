import React, { createContext, useContext, useState, useEffect } from 'react';
import {createExpense, getUserExpenses} from '../services/ExpenseService';
import {useUserContext} from "./UserContext";

const ExpenseContext = createContext();


export const useExpenseContext = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const { user } = useUserContext(); // Use UserContext to get the current user


    useEffect(() => {
        if (user && user.id) {
            getUserExpenses(user.id)
                .then(response => setExpenses(response.data))
                .catch(error => console.error('Error fetching user-specific expenses', error));
        }
    }, [user]);

    const addNewExpense = async (expenseData) => {
        try {
            const response = await createExpense(expenseData);
            setExpenses(prevExpenses => [...prevExpenses, response.data]);
        } catch (error) {
            console.error('Error adding expense', error);
            throw error;
        }
    };

    return (
        <ExpenseContext.Provider value={{ expenses, addNewExpense }}>
            {children}
        </ExpenseContext.Provider>
    );
};
