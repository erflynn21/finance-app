import {get, writable} from 'svelte/store';
import userbase from 'userbase-js';

let budgets = writable([]);
let budgetsSum = writable(0);
let categories = writable([]);
const databaseName = `budgets`;

const openBudgetsDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        budgets.set(items);

        // sets the budgets sum
        let totalBudgets = [];
        get(budgets).forEach((budget) => {
            totalBudgets = [...totalBudgets, budget.item.amount];
        });
        budgetsSum.set(totalBudgets.reduce(function (a, b) {
            const sum = a + b;
            const trimmed = Number(sum.toFixed(2));
            return trimmed;
        }, 0));
    }})
    .catch((e) => console.log(e))
    .finally(() => setCategories());
    ;
}

const setCategories = () => {
    if (get(budgets).length > 0) {
        let budgetCategories = [];
        get(budgets).forEach((budget) => {
            budgetCategories = [...budgetCategories, budget.item.category];
        });
        categories.set(budgetCategories);
    }
}

const addBudget = (budget) => {
    return userbase.insertItem({ databaseName, item: budget });
};

const updateBudget = (budget, budgetId) => {
    return userbase.updateItem({ databaseName, item: budget, itemId: budgetId });
};

const deleteBudget = (budgetId) => {
    return userbase.deleteItem({ databaseName, itemId: budgetId });
}

export {budgets, budgetsSum, categories, openBudgetsDatabase, addBudget, updateBudget, deleteBudget};