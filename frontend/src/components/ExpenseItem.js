import React from 'react';
import {formatCurrency} from '../helpers/HelperFunctions';



const ExpenseItem = ({ expense }) => {

    return (
        <div className="expense-item">
            <h3>{expense.expensesDescription}</h3>
            <p>Amount: {formatCurrency(expense.expensesAmount)}</p>
            {/* Formatting the date for better readability */}
            <p>Date: {new Date(expense.expensesDate).toLocaleDateString()}</p>
            {/* Accessing the budgetDescription from the nested budget object */}
            <p>Budget: {expense.budget.budgetDescription}</p>
        </div>
    );
};

export default ExpenseItem;
