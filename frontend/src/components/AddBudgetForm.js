import React, { useState } from 'react';
import { useBudgetContext } from '../contexts/BudgetContext';
import { useUserContext } from '../contexts/UserContext';

const AddBudgetForm = () => {
    const [budgetDescription, setBudgetDescription] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const { addNewBudget, error, resetError } = useBudgetContext(); // Use error from context
    const { user } = useUserContext(); // Get the current user

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetError(); // Reset any previous error from context
        if (!budgetDescription || !budgetAmount) {
            // Use local setError for form validation errors
            alert('Please fill in all fields');
            return;
        }

        try {
            await addNewBudget({ budgetDescription, budgetAmount, user: { id: user.id } });
            setBudgetDescription('');
            setBudgetAmount('');
            // No need to reset error here since successful submission will not set an error
        } catch (serverError){}
    };

    return (
        <div className="dashboard-budget-form ">

            <form onSubmit={handleSubmit}>
                {error && <div style={{color: 'red'}}>{error}</div>}

                <section className="panel panel-info">

                    <header className="panel-heading">
                        <h2 className="panel-title">Create Budget</h2>
                    </header>

                    <div className="form-section-container">

                        <div className="form-group mrgn-tp-sm">
                            <div className="mrgn-tp-md">
                                <label htmlFor="budget-description" className="control-label">Budget Name </label>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={budgetDescription}
                                    onChange={(e) => setBudgetDescription(e.target.value)}
                                    placeholder="e.g., Groceries"
                                    id="budget-description"
                                    required="required"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div>
                                <label htmlFor="budget-amount" className="control-label">Amount</label>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={budgetAmount}
                                    onChange={(e) => setBudgetAmount(e.target.value)}
                                    placeholder="e.g., 500"
                                    id="budget-amount"
                                    required="required"
                                />
                            </div>
                        </div>

                        <div className="mrgn-bttm-md">
                            <button type="submit" className="btn-lg btn-primary">
                                Create Budget <span className="glyphicon glyphicon-usd"></span>
                            </button>
                        </div>
                    </div>
                </section>
            </form>
        </div>
);
};

export default AddBudgetForm;
