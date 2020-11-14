import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/store';
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
    userbase.insertItem({ databaseName, item: budget });
};

const updateBudget = (budget, budgetId) => {
    userbase.updateItem({ databaseName, item: budget, itemId: budgetId });
};

const deleteBudget = (budgetId) => {
    userbase.deleteItem({ databaseName, itemId: budgetId });
}

export {expenses, addBudget, updateBudget, deleteBudget};