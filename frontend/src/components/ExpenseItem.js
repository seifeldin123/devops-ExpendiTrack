import React from 'react';

const ExpenseItem = ({ expense }) => {


    return (
        <div className="expense-item">
            <h3>{expense.description}</h3>
            <p>Amount: ${expense.amount}</p>
            <p>Date: ${expense.date}</p>
            <p>Budget: ${expense.budgetDescription}</p>
        </div>
    );
};

export default ExpenseItem;
