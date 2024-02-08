import React, { useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { useBudgetContext } from "../contexts/BudgetContext";
import BudgetList from "../components/BudgetList";
import AddBudgetForm from "../components/AddBudgetForm";
import ExpenseList from "../components/ExpenseList";
import AddExpenseForm from "../components/AddExpenseForm";
import {useExpenseContext} from "../contexts/ExpenseContext";
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = useUserContext();
    const { budgets, fetchBudgets } = useBudgetContext();
    const { expenses, fetchExpenses } = useExpenseContext();

    useEffect(() => {
        if (user && user.id) {
            fetchBudgets(user.id);
            fetchExpenses(user.id);
        }
    }, [user, fetchBudgets, fetchExpenses]);


    return (
        <div className="container" data-testid="dashboard">
            {user && <h1>Welcome, {user.name}!</h1>}

            <div className="dashboard-forms-container">
                <AddBudgetForm/>
                {Array.isArray(budgets) && budgets.length > 0 && <AddExpenseForm budgets={budgets}/>}
            </div>

            <div className="container mt-4">
                <BudgetList budgets={budgets}/>
                <ExpenseList expenses={expenses}/>
            </div>
        </div>
    );
};

export default Dashboard;
