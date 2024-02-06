import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from "../contexts/UserContext";
import { calculateTotalSpent, formatCurrency} from "../helpers/HelperFunctions";
import { useExpenseContext } from "../contexts/ExpenseContext";

const BudgetItem = ({ budget }) => {
    const { user } = useUserContext();
    const { expenses } = useExpenseContext();

    const totalSpent = calculateTotalSpent(expenses, budget.budgetId);
    const remaining = budget.budgetAmount - totalSpent;
    const overspent = remaining < 0;
    const percentSpent = Math.min((totalSpent / budget.budgetAmount) * 100, 100); // Ensure it doesn't exceed 100%

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm custom-card-border"> {/* Apply the custom class here */}
                <div className="card-body">
                    <h5 className="card-title">{budget.budgetDescription}</h5>
                    <p className="card-text">Budgeted: {formatCurrency(budget.budgetAmount)}</p>
                    <p className="card-text">Spent: {formatCurrency(totalSpent)}</p>
                    <p className={`card-text ${overspent ? 'text-danger' : 'text-success'}`}>
                        {overspent ? `Overspent: ${formatCurrency(-remaining)}` : `Remaining: ${formatCurrency(remaining)}`}
                    </p>
                    <div className="progress mb-3">
                        <div
                            className={`progress-bar ${overspent ? 'bg-danger' : 'bg-success'}`}
                            role="progressbar"
                            style={{ width: `${percentSpent}%` }}
                            aria-valuenow={percentSpent}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >{percentSpent.toFixed(2)}%</div>
                    </div>
                    <Link to={`/budgets/user/${user.id}`} className="card-link">View Details</Link>
                </div>
            </div>
        </div>
    );
};

export default BudgetItem;
