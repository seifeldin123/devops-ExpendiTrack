import React, { useEffect, useState } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';
import { formatDate} from '../helpers/HelperFunctions';
import { useUserContext } from '../contexts/UserContext';
import BasicModal from "./Modal";

const AddExpenseForm = ({ existingExpense, budgets, onClose }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedBudgetId, setSelectedBudgetId] = useState('');
    const { addNewExpense, fetchExpenses, updateExistingExpense, error, resetError, expenses } = useExpenseContext();
    const { user } = useUserContext(); // Get the current user

    const [date, setDate] = useState(() => {
        const today = new Date();
        const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));
        return localDate.toISOString().slice(0, 10);
    });

    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // Initialize form with existingExpense data if present
    useEffect(() => {
        if (existingExpense && existingExpense.budget && budgets.length > 0) {
            setDescription(existingExpense.expensesDescription);
            setAmount(existingExpense.expensesAmount);
            setDate(existingExpense.expensesDate.slice(0, 10)); // Assuming ISO string format
            setSelectedBudgetId(existingExpense.budget.budgetId.toString());
        } else if (budgets && budgets.length > 0) {
            setSelectedBudgetId(budgets[0].budgetId.toString());
        }
    }, [existingExpense, budgets]);

    const handleWarningClose = async (proceed) => {
        setShowWarningModal(false);
        if (proceed) {
            await submitExpense(); // Proceed with the expense submission.
        }
    };

    const submitExpense = async () => {

        try {
            if (existingExpense) {
                const expenseData = {
                    expensesDescription: description,
                    expensesAmount: parseFloat(amount),
                    budget: { budgetId: parseInt(selectedBudgetId) },
                };
                await updateExistingExpense(existingExpense.expensesId, expenseData);
            } else {
                const expenseData = {
                    expensesDescription: description,
                    expensesAmount: parseFloat(amount),
                    expensesDate: new Date(date).toISOString(),
                    budget: { budgetId: parseInt(selectedBudgetId) },
                };
                await addNewExpense(expenseData);
            }
            setDescription('');
            setAmount('');
            setDate('');
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 5000); // Adjust duration as needed
            fetchExpenses(user.id); // Refresh expense list
            setSelectedBudgetId(budgets.length > 0 ? budgets[0].budgetId.toString() : '');
        } catch (serverError) {
            setShowSuccessAlert(false);
            resetError();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetError();

        // No need to fetch budgets and expenses if they are already up-to-date.
        const budgetAmount = budgets.find(budget => budget.budgetId.toString() === selectedBudgetId)?.budgetAmount;
        let totalExpensesForBudget = expenses
            .filter(expense => expense.budget?.budgetId.toString() === selectedBudgetId)
            .reduce((acc, current) => acc + parseFloat(current.expensesAmount), 0);

        // Adjust total if we are updating an expense.
        if (existingExpense) {
            totalExpensesForBudget -= parseFloat(existingExpense.expensesAmount);
        }

        const newTotal = totalExpensesForBudget + parseFloat(amount);

        // Determine if we should show the warning modal or submit the expense directly.
        if (budgetAmount < newTotal) {
            setShowWarningModal(true);
        } else {
            await submitExpense();
        }
    };



    return (
        <div className="dashboard-expense-form">
            <form onSubmit={handleSubmit}>
                <section className="panel panel-primary">

                    <header className="panel-heading">
                        <h2 className="panel-title">{existingExpense ? 'Edit Expense' : 'Create Expense'}</h2>
                    </header>

                    <div className="form-section-container">
                        <div className="form-group mrgn-tp-sm">
                            <label htmlFor="expense-description">
                                <span className="field-name">Expense Name</span> <strong
                                className="required">(required)</strong>
                            </label>

                            <div>
                                <input
                                    data-testid="expense-description-input"
                                    type="text"
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g., Walmart"
                                    id="expense-description"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="expense-amount">
                                <span className="field-name">Expense Amount</span> <strong
                                className="required">(required)</strong>
                            </label>

                            <div>
                                <input
                                    data-testid="expense-amount-input"
                                    type="number"
                                    className="form-control"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="e.g., 150.47"
                                    id="expense-amount"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">

                            {existingExpense ? (
                                <label htmlFor="expense-date">
                                    <span className="field-name">Expense Date</span>
                                </label>
                            ) : (
                                <label htmlFor="expense-date">
                                    <span className="field-name">Expense Date</span> <strong
                                    className="required">(required)</strong>
                                </label>
                            )}

                            {existingExpense ? (
                                // If editing an existing expense, display the date as text
                                <div id="expense-date" className="form-control-plaintext">
                                {formatDate(existingExpense.expensesDate)}
                                </div>
                            ) : (

                                // If adding a new expense, display the date input field
                                <input
                                    data-testid="expense-date"
                                    type="date"
                                    className="form-control"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    placeholder="Date"
                                    id="expense-date"
                                    required
                                />
                            )}
                        </div>

                        <div className="form-group">

                            {existingExpense ? (
                                <label htmlFor="budget-category">
                                    <span className="field-name"  >Budget Category</span>
                                </label>
                            ) : (
                                <label htmlFor="budget-category">
                                    <span className="field-name">Budget Category</span> <strong
                                    className="required">(required)</strong>
                                </label>
                            )}

                            {existingExpense ? (
                                // If editing an existing expense, display the budget description as text
                                <div id="budget-category" className="form-control-plaintext">
                                {existingExpense.budget.budgetDescription}
                                </div>
                            ) : (
                                // If adding a new expense, display the dropdown for budget selection
                                <select
                                    data-testid="budget-category"
                                    className="form-control"
                                    value={selectedBudgetId}
                                    onChange={(e) => setSelectedBudgetId(e.target.value)}
                                    id="budget-category"
                                    required>
                                    <option defaultValue value="">Select Budget</option>
                                    {budgets.map(budget => (
                                        <option key={budget.budgetId} value={budget.budgetId}>
                                            {budget.budgetDescription}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {existingExpense ? (
                            <button type="submit" className="btn-lg btn-success">
                                <span className="glyphicon glyphicon-floppy-save"></span>
                                &nbsp; Update Expense
                            </button>
                        ) : (
                            <div className="mrgn-bttm-md">
                                <button data-testid="create-expense" type="submit" className="btn-lg btn-default">
                                    <span className="glyphicon glyphicon-plus"></span>
                                    &nbsp;Create Expense
                                </button>
                            </div>
                        )}
                        {/* Success and error alerts */}
                        {showSuccessAlert && !error && (
                            <div className="expense-message alert alert-success" role="alert">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                                        onClick={() => setShowSuccessAlert(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <p>Expense successfully {existingExpense ? 'updated' : 'added'}!</p>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <h4>The form could not be submitted because these errors were found:</h4>
                                <ul>
                                    <li>{error}</li>
                                </ul>
                            </div>
                        )}

                        {/* Warning modal similar to the one in AddBudgetForm */}
                        <BasicModal
                            show={showWarningModal}
                            handleClose={() => handleWarningClose(false)}
                            title="Warning"
                        >
                            <p><strong>{`Adding this expense exceeds your budget. Do you want to proceed?`}</strong></p>
                            <div>
                                <button onClick={() => handleWarningClose(true)}
                                        className="btn btn-danger mrgn-rght-lg">Proceed
                                </button>
                                <button onClick={() => handleWarningClose(false)} className="btn btn-default">Cancel
                                </button>
                            </div>
                        </BasicModal>
                    </div>
                </section>
            </form>
        </div>
    );
};

export default AddExpenseForm;
