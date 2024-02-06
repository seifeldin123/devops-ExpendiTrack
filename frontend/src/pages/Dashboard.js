import React, { useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { useBudgetContext } from "../contexts/BudgetContext";
import BudgetList from "../components/BudgetList";
import AddBudgetForm from "../components/AddBudgetForm";
import ExpenseList from "../components/ExpenseList";
import AddExpenseForm from "../components/AddExpenseForm";
import {useExpenseContext} from "../contexts/ExpenseContext";

const Dashboard = () => {
    const { user } = useUserContext();
    const { budgets, fetchBudgets } = useBudgetContext(); // Access fetchBudgets from context
    const { expenses, fetchExpenses } = useExpenseContext();

    useEffect(() => {
        // Ensure fetchBudgets is called correctly
        if (user && user.id) {
            fetchBudgets(user.id); // Correctly call fetchBudgets for the logged-in user
            fetchExpenses(user.id);
        }
    }, [user, fetchBudgets, fetchExpenses]); // Include fetchBudgets in the dependency array

    return (
        <div className="container" data-testid="dashboard">
            {user && <h1>Welcome, {user.name}!</h1>}
            <AddBudgetForm />
            <BudgetList budgets={budgets} />
            {Array.isArray(budgets) && budgets.length > 0 && <AddExpenseForm budgets={budgets} />}
            <ExpenseList expenses={expenses} />
        </div>
    );
};

export default Dashboard;
