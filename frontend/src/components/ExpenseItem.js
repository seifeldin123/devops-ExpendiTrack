import React from 'react';
import { formatCurrency } from '../helpers/HelperFunctions';

const ExpenseItem = ({ expense }) => {
    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">{expense.expensesDescription}</h5>
                    <p className="card-text">Amount: {formatCurrency(expense.expensesAmount)}</p>
                    <p className="card-text">Date: {new Date(expense.expensesDate).toLocaleDateString()}</p>
                    <p className="card-text">Budget: {expense?.budget?.budgetDescription || 'No Budget'}</p>
                </div>
            </div>
        </div>
    );
};

export default ExpenseItem;

