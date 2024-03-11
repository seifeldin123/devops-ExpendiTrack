import React, {useEffect} from 'react';
import BudgetItem from './BudgetItem';
import {useTranslation} from "react-i18next";

const BudgetList = React.memo(({ budgets, onEditBudget }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
    }, [i18n.language]);

    if (!Array.isArray(budgets) || budgets.length === 0) {
        return (
            <div >
                <section className="panel panel-info">
                    <header className="panel-heading">
                        <h5 className="panel-title text-center">Budgets</h5>
                    </header>
                    <div className="panel-body">
                        <p className="text-center">{t("app.budgeListNotAvailable")}</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div >
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
