import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { userStore } from './userStore.js';
import { get } from "svelte/store";

let monthlyExpenses = writable([]);
const databaseName = `${selectedMonth}${selectedYear}monthlyExpenses`;

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
    userbase.insertItem({ databaseName, item: monthlyExpense });
};

const updateMonthlyExpenses = (monthlyExpense, monthlyExpenseId) => {
    userbase.updateItem({ databaseName, item: monthlyExpense, itemId: monthlyExpenseId });
};

const deleteMonthlyExpenses = (monthlyExpenseId) => {
    userbase.deleteItem({ databaseName, itemId: monthlyExpenseId });
}

export {expenses, addMonthlyExpenses, updateMonthlyExpenses, deleteMonthlyExpenses};