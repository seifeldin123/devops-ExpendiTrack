import React, { useState } from 'react';
import { useExpenseContext } from '../contexts/ExpenseContext';
import { calculateTotalSpent} from '../helpers/HelperFunctions';


const AddExpenseForm = ({ budgets }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [selectedBudgetId, setSelectedBudgetId] = useState(budgets.length > 0 ? budgets[0].id : '');
    const { addNewExpense, expenses, error, resetError } = useExpenseContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetError(); // Reset error state before attempting to add a new expense

        if (!description || !amount || !selectedBudgetId || !date) {
            alert("Please fill in all fields.");
            return;
        }

        const selectedBudget = budgets.find(b => b.budgetId === parseInt(selectedBudgetId, 10));
        if (!selectedBudget) {
            alert("Selected budget does not exist.");
            return;
        }

        // Use the helper function to calculate total spent
        const totalSpent = calculateTotalSpent(expenses, parseInt(selectedBudgetId, 10));
        const remaining = selectedBudget.budgetAmount - totalSpent;

        if (remaining < parseFloat(amount)) {
            const proceed = window.confirm("This expense exceeds your remaining budget. Do you want to proceed?");
            if (!proceed) return;
        }

        try {
            await addNewExpense({
                description,
                amount: parseFloat(amount),
                date: new Date(date).toISOString(),
                budgetId: selectedBudgetId,
            });
            setDescription('');
            setAmount('');
            setDate('');
        } catch (error) {
            console.error('Error adding expense', error);
            alert("Failed to add expense. Please try again.");
        }
    };

    return (
        <div className="dashboard-expense-form">
            <form onSubmit={handleSubmit}>
                {error && <div style={{color: 'red'}}>{error}</div>}


                <section className="panel panel-info">

                    <header className="panel-heading">
                        <h2 className="panel-title">Create Expense</h2>
                    </header>

                    <div className="form-section-container">

                        <div className="form-group mrgn-tp-sm">
                            <div className="mrgn-tp-md">
                                <label htmlFor="expense-description" className="control-label">Expense Name</label>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g., Walmart"
                                    id="expense-description"
                                    required="required"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div>
                                <label htmlFor="expense-amount" className="control-label">Amount</label>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="e.g., 150.47"
                                    id="expense-amount"
                                    required="required"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div>
                                <label htmlFor="expense-date" className="control-label">Date</label>
                            </div>
                            <div>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    placeholder="Date"
                                    id="expense-date"
                                    required="required"

                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div>
                                <label htmlFor="budget-category" className="control-label">Budget Category</label>
                            </div>
                            <div>
                                <select
                                    className="form-control"
                                    value={selectedBudgetId}
                                    onChange={(e) => setSelectedBudgetId(e.target.value)}
                                    id="budget-category"
                                    required="required">
                                    <option value="">Select Budget</option>
                                    {budgets.map(budget => (
                                        <option key={budget.budgetId}
                                                value={budget.budgetId}>{budget.budgetDescription}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mrgn-bttm-md">
                            <button type="submit" className="btn-lg btn-primary">
                                Add Expense <span className="glyphicon glyphicon-plus-sign"></span>
                            </button>
                        </div>
                    </div>
                </section>
            </form>
        </div>
);
};

export default AddExpenseForm;
