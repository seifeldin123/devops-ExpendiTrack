import React, { useState, useEffect } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';
import BasicModal from './Modal';
import AddExpenseForm from './AddExpenseForm';
import { formatCurrency, formatDate } from '../helpers/HelperFunctions';
import {useTranslation} from "react-i18next";

const ExpenseList = React.memo(({ expenses, budgets }) => {
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const { removeExpense, resetError } = useExpenseContext();
    const { t, i18n } = useTranslation();

    useEffect(() => {
    }, [i18n.language]);

    const handleCloseModal = () => {
        resetError(); // Reset error messages when closing any modal
        setShowEditModal(false);
        setShowDeleteConfirmation(false);
    };

    const handleEdit = (expense) => {
        resetError(); // Clear any existing error messages
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
                        <h5 className="panel-title text-center">{t("app.expenseListTitle")}</h5>
                    </header>
                    <div className="panel-body">
                        <p className="text-center">{t("app.expenseListNotAvailable")}</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="expense-list-container">
            <div className="expenses-list">
                {expenses.map((expense) => (
                    <div className="expense-item" key={expense.expensesId}>
                        <div className="card h-100 shadow-sm custom-card-border">
                            <div className="card-body">
                                <h5 className="card-title" data-testid="expense-title-test-id">
                                    <strong>{t("app.add-expenses-add")}: </strong>{expense.expensesDescription}
                                </h5>
                                <p className="card-text" data-testid="expense-amount-test-id">
                                    <strong>{t("app.add-expenses-amount")}: </strong>{formatCurrency(expense.expensesAmount)}
                                </p>
                                <p className="card-text">
                                    <strong>{t("app.add-expenses-date")}: </strong>{formatDate(expense.expensesDate, i18n.language === "en" ? "en-US" : "fr-FR")}
                                </p>
                                <p className="card-text">
                                    <strong>{t("app.add-budget-budget-name")}: </strong>{expense.budget?.budgetDescription || 'No Budget'}
                                </p>
                                <div className="text-right">

                                </div>
                                <div className="action-buttons mrgn-tp-md">
                                    <button data-testid="edit-expense" className="btn btn-sm btn-default "
                                            onClick={() => handleEdit(expense)}>
                                        <span className="glyphicon glyphicon-edit"></span>
                                        &nbsp; {t("app.add-expenses-edit")}
                                    </button>

                                    <button className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteClick(expense)}>
                                        <span className="glyphicon glyphicon-trash"></span>
                                        &nbsp; {t("app.expenseListTitleDelete")}
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
                    <BasicModal show={showDeleteConfirmation} handleClose={handleCloseModal}
                                title={t("app.budgetListConfirmDeletion")}>
                        <div className="text-center">
                            <h5>{t("app.expenseListTitleSureDelete")}</h5>
                            <div className="action-buttons mrgn-tp-md">
                                <button className="btn btn-danger m-2"
                                        onClick={confirmDelete}>{t("app.budgetItem-confirm-delete")}</button>
                                <button className="btn btn-default m-2"
                                        onClick={() => setShowDeleteConfirmation(false)}>{t("app.budgetItem-cancel")}</button>
                            </div>
                        </div>
                    </BasicModal>
                )}
            </div>
        </div>
);
});

export default ExpenseList;
