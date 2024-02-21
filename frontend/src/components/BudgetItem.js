import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from "../contexts/UserContext";
import { calculateTotalSpent, formatCurrency } from "../helpers/HelperFunctions";
import { useExpenseContext } from "../contexts/ExpenseContext";
import BasicModal from './Modal';
import AddBudgetForm from './AddBudgetForm';
import { useBudgetContext } from "../contexts/BudgetContext";

const BudgetItem = ({ budget }) => {
    const { user } = useUserContext();
    const { expenses } = useExpenseContext();
    const { removeBudget, fetchBudgets } = useBudgetContext();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false); // Added state for delete warning modal

    // Check if the budget has associated expenses
    const hasExpenses = expenses.some(expense => expense.budgetId === budget.budgetId);

    // No need to keep track of totalSpent, remaining, and percentSpent in state if they're derived directly from props and context
    const totalSpent = calculateTotalSpent(expenses, budget.budgetId);
    const remaining = budget.budgetAmount - totalSpent;
    const percentSpent = Math.min((totalSpent / budget.budgetAmount) * 100, 100);

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleDeleteClick = () => {
        // Perform the check for associated expenses directly within this handler
        const linkedExpenses = expenses.some(exp => String(exp.budget.budgetId) === String(budget.budgetId));

        if (linkedExpenses) {
            setShowDeleteWarning(true); // Show warning modal if there are linked expenses
        } else {
            setShowDeleteConfirmation(true); // Otherwise, show confirmation modal
        }
    };

    const handleDeleteConfirmation = async () => {
        try {
            await removeBudget(budget.budgetId);
            fetchBudgets(user.id);
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error("Error deleting budget:", error);
            // Optionally handle error (e.g., show an error message)
        }
    }

    return (
        <div className="card-container col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm custom-card-border">
                <div className="card-body">
                    <h5 className="card-title"><strong>Budget Name: {budget.budgetDescription}</strong></h5>
                    <p className="card-text"><strong>Budgeted Amount: {formatCurrency(budget.budgetAmount)}</strong></p>
                    <p className="card-text"><strong>Spent: {formatCurrency(totalSpent)}</strong></p>
                    <p className={`card-text`}>
                        <strong className={`${remaining < 0 ? 'text-danger' : 'text-success'}`}>{remaining < 0 ? `Overspent: ${formatCurrency(-remaining)}` : `Remaining: ${formatCurrency(remaining)}`}</strong>
                    </p>
                    <div className="progress mb-3">
                        <div role="progressbar"  className={`progress-bar ${remaining < 0 ? 'bg-danger' : 'bg-success'}`}
                             style={{width: `${percentSpent}%`}} aria-valuenow={percentSpent} aria-valuemin="0"
                             aria-valuemax="100">
                            {percentSpent.toFixed(2)}%
                        </div>
                    </div>
                    <div>
                        <Link to={`/budgets/user/${user.id}`} className="card-link">View Details</Link>
                    </div>
                    {/* Edit and Delete Buttons */}
                    <div className="action-buttons mrgn-tp-md">
                        <button onClick={handleEditClick} className="btn btn-default">
                            Edit Budget
                        </button>
                        <button onClick={handleDeleteClick} className="btn btn-warning">
                            Delete Budget
                        </button>
                    </div>
                </div>
            </div>
            {/* Edit Modal */}
            {showEditModal && <BasicModal show={showEditModal} handleClose={() => setShowEditModal(false)} title="Edit Budget">
                <AddBudgetForm existingBudget={budget} onClose={() => setShowEditModal(false)} />
            </BasicModal>}

            {/* Delete confirmation Modal */}
            {showDeleteConfirmation && <BasicModal show={showDeleteConfirmation} handleClose={() => setShowDeleteConfirmation(false)} title="Confirm Deletion">
                <div className="text-center">
                    <h5>Are you sure you want to delete this budget?</h5>
                    <div className="action-buttons mrgn-tp-md">
                        <button className="btn btn-danger m-2" onClick={handleDeleteConfirmation}>Confirm Delete
                        </button>
                        <button className="btn btn-default m-2"
                                onClick={() => setShowDeleteConfirmation(false)}>Cancel
                        </button>
                    </div>
                </div>
            </BasicModal>}

            {/* Delete Warning Modal */}
            {showDeleteWarning && <BasicModal show={showDeleteWarning} handleClose={() => setShowDeleteWarning(false)} title="Cannot Delete Budget">
                <div className="text-center">
                    <p><strong>This budget cannot be deleted because it has associated expenses. Please remove or reassign these expenses before attempting to delete the budget.</strong></p>
                </div>
            </BasicModal>}
        </div>
);
};

export default BudgetItem;
