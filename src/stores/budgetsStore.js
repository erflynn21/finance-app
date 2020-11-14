import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { userStore } from './userStore.js';
import { get } from "svelte/store";

let budgets = writable([]);
const databaseName = `budgets`;

const openDatabase = () => {
    let user = get(userStore);
    if (user !== null) {
        userbase.openDatabase({ databaseName, changeHandler: function (items) {
            budgets.set(items);
        }})
        .catch((e) => console.log(e));
    } else {
        setTimeout(openDatabase, 500)
    } 
}

openDatabase();

const addBudget = (budget) => {
    return userbase.insertItem({ databaseName, item: budget });
};

const updateBudget = (budget, budgetId) => {
    return userbase.updateItem({ databaseName, item: budget, itemId: budgetId });
};

const deleteBudget = (budgetId) => {
    return userbase.deleteItem({ databaseName, itemId: budgetId });
}

export {expenses, addBudget, updateBudget, deleteBudget};