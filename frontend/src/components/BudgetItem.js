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
    const { removeBudget, fetchBudgets, resetError } = useBudgetContext();

    const { enableFormPopulation } = useBudgetContext();

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false); // Added state for delete warning modal

    // No need to keep track of totalSpent, remaining, and percentSpent in state if they're derived directly from props and context
    const totalSpent = calculateTotalSpent(expenses, budget.budgetId);
    const remaining = budget.budgetAmount - totalSpent;
    const percentSpent = Math.min((totalSpent / budget.budgetAmount) * 100, 100);

    const ProgressBar = ({ percentSpent }) => {
        let progressBarClass = "progress-bar progress-bar-striped progress-bar-animated";

        if (percentSpent <= 50) {
            progressBarClass += " bg-success";
        } else if (percentSpent <= 75) {
            progressBarClass += " bg-warning";
        } else {
            progressBarClass += " bg-danger";
        }

        return (
            <div className="progress mb-3">
                <div
                    className={progressBarClass}
                    role="progressbar"
                    style={{width: `${percentSpent}%`}}
                    aria-valuenow={percentSpent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
        );
    };

    const handleCloseModal = () => {
        resetError(); // Assuming resetError is accessible here, either directly or passed down as a prop
        setShowEditModal(false);
        setShowDeleteConfirmation(false);
        setShowDeleteWarning(false);
    };

    const handleEditClick = () => {
        resetError(); // Assuming resetError() is available and resets the global error state
        console.log(typeof enableFormPopulation); // Should log "function"
        enableFormPopulation();
        setShowEditModal(true);
    };

    const handleDeleteClick = () => {
        resetError();
        // Perform the check for associated expenses directly within this handler
        const linkedExpenses = expenses.some(exp => String(exp.budget.budgetId) === String(budget.budgetId));

        if (linkedExpenses) {
            setShowDeleteWarning(true); // Show warning modal if there are linked expenses
        } else {
            setShowDeleteConfirmation(true); // Otherwise, show confirmation modal
        }
    };

    const handleDeleteConfirmation = async () => {
        resetError();
        try {
            await removeBudget(budget.budgetId);
            fetchBudgets(user.id);
            setShowDeleteConfirmation(false);
        } catch (serverError) {
            resetError();
        }
    }

    return (
        <div className="card-container col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm custom-card-border">
                <div className="card-body">
                    <h5 className="card-title" data-testid="budget-title-test-id"><strong >Budget Name: {budget.budgetDescription}</strong></h5>
                    <p className="card-text"><strong>Budgeted
                        Amount: {formatCurrency(budget.budgetAmount)}</strong></p>
                    <p className="card-text"><strong>Spent: {formatCurrency(totalSpent)}</strong></p>
                    <p className={`card-text`}>
                        <strong
                            className={`${remaining < 0 ? 'text-danger' : 'text-success'}`}>{remaining < 0 ? `Overspent: ${formatCurrency(-remaining)}` : `Remaining: ${formatCurrency(remaining)}`}</strong>
                    </p>

                    <ProgressBar percentSpent={percentSpent} />

                    <div>
                        <Link to={`/budgets/user/${user.id}`} className="card-link">View Details</Link>
                    </div>
                    {/* Edit and Delete Buttons */}
                    <div className="action-buttons mrgn-tp-md">
                        <button onClick={handleEditClick} className="btn btn-default" id="edit-budget-btn">
                            <span className="glyphicon glyphicon-edit"></span>
                            &nbsp; Edit Budget
                        </button>
                        <button onClick={handleDeleteClick} className="btn btn-danger">
                            <span className="glyphicon glyphicon-trash"></span>
                            &nbsp; Delete Budget
                        </button>
                    </div>
                </div>
            </div>
            {/* Edit Modal */}
            {showEditModal && <BasicModal show={showEditModal} handleClose={handleCloseModal} title="Edit Budget">
                <AddBudgetForm existingBudget={budget} onClose={() => setShowEditModal(false)}/>
            </BasicModal>}

            {/* Delete confirmation Modal */}
            {showDeleteConfirmation && <BasicModal show={showDeleteConfirmation} handleClose={handleCloseModal}  title="Confirm Deletion">
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
            {showDeleteWarning && <BasicModal show={showDeleteWarning} handleClose={handleCloseModal} title="Cannot Delete Budget">
                <div className="text-center">
                    <p><strong>This budget cannot be deleted because it has associated expenses. Please remove these expenses before attempting to delete the budget.</strong></p>
                </div>
            </BasicModal>}
        </div>
);
};

export default BudgetItem;
