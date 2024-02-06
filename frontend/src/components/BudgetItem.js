import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from "../contexts/UserContext";
import {calculateTotalSpent, formatCurrency, formatPercentage} from "../helpers/HelperFunctions";
import {useExpenseContext} from "../contexts/ExpenseContext";

// BudgetItem component for rendering a single budget item.
// It receives a 'budget' prop containing budget details and uses user information from the UserContext.
const BudgetItem = ({ budget }) => {
    // Access the current user object from the UserContext using useUserContext hook.
    const { user } = useUserContext();
    const { expenses } = useExpenseContext();

    // Calculate spent and remaining amounts (will be using expenses in the future).
    const totalSpent = calculateTotalSpent(expenses, budget.budgetId);
    let remaining = budget.budgetAmount - totalSpent;
    let overspent = remaining < 0;

    const percentSpent = (totalSpent / budget.budgetAmount) * 100;
    return (
        <div className="budget-item">
            <h3>{budget.budgetDescription}</h3>
            <p>Budgeted: {formatCurrency(budget.budgetAmount)}</p>
            <p>Spent: {formatCurrency(totalSpent)}</p>
            {overspent ? <p>Overspent: {formatCurrency(-remaining)}</p> : <p>Remaining: {formatCurrency(remaining)}</p>}
            {/* Percent bar */}
            <progress value={totalSpent} max={budget.budgetAmount}>
                {formatPercentage(percentSpent / 100)}
            </progress>
            <div>
                {/* Create a link to view budget details with the user's ID as a parameter. */}
                <Link to={`/budgets/user/${user.id}`}>View Details</Link>
            </div>
        </div>
    );
};

export default BudgetItem;
