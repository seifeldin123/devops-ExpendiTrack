import React from 'react';
import BudgetItem from './BudgetItem';

const BudgetList = React.memo(({ budgets, onEditBudget }) => {
    if (!Array.isArray(budgets) || budgets.length === 0) {
        return (
            <div className="container mt-4">
                <section className="panel panel-info">
                    <header className="panel-heading">
                        <h5 className="panel-title text-center">Budgets</h5>
                    </header>
                    <div className="panel-body">
                        <p className="text-center">No budgets available</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <section className="panel panel-info">
                <header className="panel-heading">
                    <h5 className="panel-title">Budgets</h5>
                </header>
                <div className="panel-body row">
                    {budgets.map((budget, index) => (
                        <BudgetItem key={budget.id || `budget-${index}`} budget={budget} onEdit={onEditBudget}/>
                    ))}
                </div>
            </section>
        </div>
    );
});

export default BudgetList;
