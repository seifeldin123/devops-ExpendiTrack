import React, { useState } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';
import BasicModal from './Modal';
import AddExpenseForm from './AddExpenseForm';
import { formatCurrency, formatDate } from '../helpers/HelperFunctions';

const ExpenseList = React.memo(({ expenses, budgets }) => {
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const { removeExpense, resetError } = useExpenseContext();

    const handleCloseModal = () => {
        resetError(); // Reset error messages when closing any modal
        setShowEditModal(false);
        setShowDeleteConfirmation(false);
    };

    const handleEdit = (expense) => {
        setSelectedExpense(expense);
        setShowEditModal(true);
    };

    const handleDeleteClick = (expense) => {
        setSelectedExpense(expense);
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        await removeExpense(selectedExpense.expensesId);
        setShowDeleteConfirmation(false);
    };

    if (!Array.isArray(expenses) || expenses.length === 0) {
        return (
            <div>
                <section className="panel panel-info">
                    <header className="panel-heading">
                        <h5 className="panel-title text-center">Expenses</h5>
                    </header>
                    <div className="panel-body">
                        <p className="text-center">No expenses available</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div >
            <section className="panel panel-info">
                <header className="panel-heading">
                    <h5 className="panel-title">Expenses</h5>
                </header>
                <div className="panel-body row">
                    {expenses.map((expense) => (
                        <div key={expense.expensesId} className="col-lg-4 col-md-6 mb-4">
                            <div className="card h-100 shadow-sm custom-card-border">
                                <div className="card-body">
                                    <h5 className="card-title"><strong>Expense
                                        Name: </strong>{expense.expensesDescription}</h5>
                                    <p className="card-text"><strong>Expense
                                        Amount: </strong>{formatCurrency(expense.expensesAmount)}</p>
                                    <p className="card-text"><strong>Expense
                                        Date: </strong>{formatDate(expense.expensesDate)}</p>
                                    <p className="card-text"><strong>Budget
                                        Name: </strong>{expense.budget?.budgetDescription || 'No Budget'}</p>
                                    <div className="text-right">

                                    </div>
                                    <div className="action-buttons mrgn-tp-md">
                                        <button className="btn btn-default "
                                                onClick={() => handleEdit(expense)}>
                                            <span className="glyphicon glyphicon-edit"></span>
                                            &nbsp; Edit Expense
                                        </button>

                                        <button className="btn btn-danger"
                                                onClick={() => handleDeleteClick(expense)}>
                                            <span className="glyphicon glyphicon-trash"></span>
                                            &nbsp; Delete Budget
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}

                    {showEditModal && (
                        <BasicModal show={showEditModal} handleClose={handleCloseModal}
                                    title="Edit Expense">
                            <AddExpenseForm
                                existingExpense={selectedExpense}
                                budgets={budgets}
                                onClose={() => setShowEditModal(false)}
                            />
                        </BasicModal>
                    )}

                    {showDeleteConfirmation && (
                        <BasicModal show={showDeleteConfirmation} handleClose={handleCloseModal}title="Confirm Deletion">
                            <div className="text-center">
                                <h5>Are you sure you want to delete this expense?</h5>
                                <div className="action-buttons mrgn-tp-md">
                                    <button className="btn btn-danger m-2" onClick={confirmDelete}>Confirm Delete</button>
                                    <button className="btn btn-default m-2" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                                </div>
                            </div>
                        </BasicModal>
                    )}
                </div>
            </section>
        </div>
    );
});

export default ExpenseList;
