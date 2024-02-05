import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from "../contexts/UserContext";

// BudgetItem component for rendering a single budget item.
// It receives a 'budget' prop containing budget details and uses user information from the UserContext.
const BudgetItem = ({ budget }) => {
    // Access the current user object from the UserContext using useUserContext hook.
    const { user } = useUserContext();

    // Calculate spent and remaining amounts (will be using expenses in the future).
    const spent = 400; // Placeholder for spent amount
    const remaining = budget.budgetAmount - spent; // Placeholder for remaining amount

    return (
        <div className="budget-item">
            <h3>{budget.budgetDescription}</h3>
            <p>Budgeted: {budget.budgetAmount}</p>
            <p>Spent: {spent}</p>
            <p>Remaining: {remaining}</p>
            {/* Render a progress bar based on spent and budgeted amounts. */}
            <progress value={spent} max={budget.budgetAmount} />
            <div>
                {/* Create a link to view budget details with the user's ID as a parameter. */}
                <Link to={`/budgets/user/${user.id}`}>View Details</Link>
            </div>
        </div>
    );
};

export default BudgetItem;
