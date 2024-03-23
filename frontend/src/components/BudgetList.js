import React, {useEffect} from 'react';
import BudgetItem from './BudgetItem';
import {useTranslation} from "react-i18next";

const BudgetList = React.memo(({ budgets, onEditBudget }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
    }, [i18n.language]);

    if (!Array.isArray(budgets) || budgets.length === 0) {
        return (
            <div className="no-budget-item-container">
                <h2 className="h2-titles">Budgets</h2>
                <p>{t("app.budgeListNotAvailable")}</p>
            </div>
        );
    }

    return (
        <div >
            <h2 className="h2-titles">Budgets</h2>
            <div className="budget-item-container">
                {budgets.map((budget, index) => (
                    <BudgetItem key={budget.id || `budget-${index}`} budget={budget} onEdit={onEditBudget}/>
                ))}
            </div>
        </div>
    );
});

export default BudgetList;
