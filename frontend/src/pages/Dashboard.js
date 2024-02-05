import React, { useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { useBudgetContext } from "../contexts/BudgetContext";
import BudgetList from "../components/BudgetList";
import AddBudgetForm from "../components/AddBudgetForm";

const Dashboard = () => {
    const { user } = useUserContext();
    const { budgets, fetchBudgets } = useBudgetContext(); // Access fetchBudgets from context

    useEffect(() => {
        // Ensure fetchBudgets is called correctly
        if (user && user.id) {
            fetchBudgets(user.id); // Correctly call fetchBudgets for the logged-in user
        }
    }, [user, fetchBudgets]); // Include fetchBudgets in the dependency array

    return (
        <div className="container" data-testid="dashboard">
            {user && <h1>Welcome, {user.name}!</h1>}
            <AddBudgetForm />
            <BudgetList budgets={budgets} />
        </div>
    );
};

export default Dashboard;
