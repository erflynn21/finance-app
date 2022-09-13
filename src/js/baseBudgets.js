import { get } from 'svelte/store';
import userbase from 'userbase-js';
import { baseBudgets, baseBudgetsSum, categories } from '../stores/baseBudgetsStore';
import { monthlyBudgets } from '../stores/monthlyBudgetsStore';
import { addMonthlyBudget } from './monthlyBudgets';
const databaseName = 'baseBudgets';

const openBaseBudgetsDatabase = () => {
    userbase.openDatabase({
        databaseName: databaseName,
        changeHandler: function (items) {
            baseBudgets.set(items);

            // sets the budgets sum
            let totalBudgets = [];
            get(baseBudgets).forEach((budget) => {
                totalBudgets = [...totalBudgets, budget.item.amount];
            });
            baseBudgetsSum.set(totalBudgets.reduce(function (a, b) {
                const sum = a + b;
                const trimmed = Number(sum.toFixed(2));
                return trimmed;
            }, 0));

            // set categories
            setCategories();
            
        },
    });
}


const setCategories = () => {
    if (get(baseBudgets).length > 0) {
        let budgetCategories = [];
        get(baseBudgets).forEach((budget) => {
            budgetCategories = [...budgetCategories, budget.item.category];
        });
        categories.set(budgetCategories);
    }
}

const setMonthlyBudgets = async (baseBudgets) => {
    baseBudgets.forEach(async budget => {
        let monthlyBudget = get(monthlyBudgets).filter((monthlybudget) => monthlybudget.item.category === budget.item.category);
        if (monthlyBudget.length == 0) {
            let newMonthlyBudget = {
                amount: budget.item.amount,
                category: budget.item.category,
                currency: budget.item.currency,
            }

            if (newMonthlyBudget.currency !== get(baseCurrency)) {
                await convert(newMonthlyBudget);
            }
            await addMonthlyBudget(newMonthlyBudget);
        } else {
            return;
        }
    });
}

const addBudget = (budget) => {
    try {
        return userbase.insertItem({ databaseName, item: budget });
    } catch (e) {
        return e;
    }
};

const updateBudget = (budget, budgetId) => {
    try {
        return userbase.updateItem({ databaseName, item: budget, itemId: budgetId });
    } catch (e) {
        return e;
    }
};

const deleteBudget = (budgetId) => {
    try {
        return userbase.deleteItem({ databaseName, itemId: budgetId });
    } catch (e) {
        return e;
    }
}

export { openBaseBudgetsDatabase, setCategories, setMonthlyBudgets, addBudget, updateBudget, deleteBudget };