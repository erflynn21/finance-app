import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { userStore } from './userStore.js';
import { get } from "svelte/store";

let expenses = writable([]);
const databaseName = `${selectedMonth}${selectedYear}expenses`;

const openDatabase = () => {
    let user = get(userStore);
    if (user !== null) {
        userbase.openDatabase({ databaseName, changeHandler: function (items) {
            expenses.set(items);
        }})
        .catch((e) => console.log(e));
    } else {
        setTimeout(openDatabase, 500)
    } 
}

openDatabase();

const addExpense = (expense) => {
    userbase.insertItem({ databaseName, item: expense });
};

const updateExpense = (expense, expenseId) => {
    userbase.updateItem({ databaseName, item: expense, itemId: expenseId });
};

const deleteExpense = (expenseId) => {
    userbase.deleteItem({ databaseName, itemId: expenseId });
}

export {expenses, addExpense, updateExpense, deleteExpense};