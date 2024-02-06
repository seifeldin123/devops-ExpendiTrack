import React from 'react';
import BudgetItem from './BudgetItem';

// BudgetList component that displays a list of budgets.
// It receives an array of budgets as a prop and renders each budget using the BudgetItem component.
const BudgetList = React.memo(({ budgets }) => {
    // Check if the 'budgets' prop is not an array, and display a message if empty.
    if (!Array.isArray(budgets)) return <div>No budgets available</div>;

    return (
        <div className="container mt-4">
            <h2>Budgets</h2>
            {/* Map through each budget and render the BudgetItem component for each one. */}
            {budgets.map((budget) => (
                <BudgetItem key={budget.budgetId} budget={budget} />
            ))}
        </div>
    );
});

export default BudgetList;
