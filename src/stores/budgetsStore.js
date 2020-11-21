import {get, writable} from 'svelte/store';
import userbase from 'userbase-js';

let budgets = writable([]);
let categories = writable([]);
const databaseName = `budgets`;

const openBudgetsDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        budgets.set(items);
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

export {budgets, categories, openBudgetsDatabase, addBudget, updateBudget, deleteBudget};