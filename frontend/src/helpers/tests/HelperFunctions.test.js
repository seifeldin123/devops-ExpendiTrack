// HelperFunctions.test.js
import { calculateTotalSpent, formatCurrency, formatPercentage } from '../HelperFunctions';

describe('HelperFunctions', () => {
    describe('calculateTotalSpent', () => {
        //  Calculate Total Spent for a Specific Budget
        it('calculates the total expenses amount for a given budget ID', () => {
            const expenses = [
                { budget: { budgetId: 1 }, expensesAmount: '100.00' },
                { budget: { budgetId: 1 }, expensesAmount: '200.50' },
                { budget: { budgetId: 2 }, expensesAmount: '300.00' }
            ];
            const budgetId = 1;
            const totalSpent = calculateTotalSpent(expenses, budgetId);
            expect(totalSpent).toBe(300.50);
        });

        // Calculate Total Spent with No Expenses for Budget
        it('returns zero total for non-existing budget expenses', () => {
            const expenses = [
                { budget: { budgetId: 1 }, expensesAmount: '100.00' }
            ];
            const budgetId = 2;
            const totalSpent = calculateTotalSpent(expenses, budgetId);
            expect(totalSpent).toBe(0);
        });

        // Calculate Total with Mixed Data Types
        it('handles string and number expensesAmount', () => {
            const expenses = [
                { budget: { budgetId: 1 }, expensesAmount: "100" },
                { budget: { budgetId: 1 }, expensesAmount: 200 }
            ];
            const budgetId = 1;
            const totalSpent = calculateTotalSpent(expenses, budgetId);
            expect(totalSpent).toBe(300);
        });
    });

    describe('formatCurrency', () => {
        // Format Currency in USD
        it('correctly formats a number as USD currency', () => {
            const amount = 1000;
            const formatted = formatCurrency(amount);
            expect(formatted).toMatch(/^\$\d{1,3},\d{3}\.00$/); // Matches "$1,000.00" format
        });

        // Format Currency with Decimal Amount
        it('handles amounts with cents correctly', () => {
            const amount = 1234.56;
            const formatted = formatCurrency(amount);
            expect(formatted).toMatch(/^\$\d{1,3},\d{3}\.\d{2}$/); // Matches "$1,234.56" format
        });
    });

    describe('formatPercentage', () => {
        // Format Whole Number as Percentage
        it('correctly formats a whole number as percentage', () => {
            const amount = 1;
            const formatted = formatPercentage(amount);
            expect(formatted).toBe("100%");
        });

        // Format Decimal Number as Percentage
        it('correctly formats a decimal number as percentage', () => {
            const amount = 0.123;
            const formatted = formatPercentage(amount);
            expect(formatted).toBe("12%");
        });
    });
});
