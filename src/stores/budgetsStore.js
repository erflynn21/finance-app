import {writable} from 'svelte/store';
import userbase from 'userbase-js';

let budgets = writable([]);
const databaseName = `budgets`;

const openBudgetsDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        budgets.set(items);
    }})
    .catch((e) => console.log(e));
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

export {budgets, openBudgetsDatabase, addBudget, updateBudget, deleteBudget};