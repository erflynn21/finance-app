import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { userStore } from './userStore.js';
import { get } from "svelte/store";

let monthlyExpenses = writable([]);
const databaseName = `monthlyExpenses`;

const openDatabase = () => {
    let user = get(userStore);
    if (user !== null) {
        userbase.openDatabase({ databaseName, changeHandler: function (items) {
            monthlyExpenses.set(items);
        }})
        .catch((e) => console.log(e));
    } else {
        setTimeout(openDatabase, 500)
    } 
}

openDatabase();

const addMonthlyExpenses = (monthlyExpense) => {
    return userbase.insertItem({ databaseName, item: monthlyExpense });
};

const updateMonthlyExpenses = (monthlyExpense, monthlyExpenseId) => {
    return userbase.updateItem({ databaseName, item: monthlyExpense, itemId: monthlyExpenseId });
};

const deleteMonthlyExpenses = (monthlyExpenseId) => {
    return userbase.deleteItem({ databaseName, itemId: monthlyExpenseId });
}

export {expenses, addMonthlyExpenses, updateMonthlyExpenses, deleteMonthlyExpenses};