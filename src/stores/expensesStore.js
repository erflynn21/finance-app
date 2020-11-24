import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { get } from "svelte/store";

let expenses = writable([]);
let expensesSum = writable(0);
const databaseName = `${get(selectedYear)}-${get(selectedMonth)}-expenses`;

const openExpensesDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        expenses.set(items)
        let totalExpenses = [];
        get(expenses).forEach((expense) => {
            totalExpenses = [...totalExpenses, expense.item.amount];
        });
        expensesSum.set(totalExpenses.reduce(function (a, b) {
            const sum = a + b;
            const trimmed = Number(sum.toFixed(2));
            return trimmed;
        }, 0));
    }})
    .catch((e) => console.log(e));
}

const addExpense = (expense) => {
    return userbase.insertItem({ databaseName, item: expense });
};

const updateExpense = (expense, expenseId) => {
    return userbase.updateItem({ databaseName, item: expense, itemId: expenseId });
};

const deleteExpense = (expenseId) => {
    return userbase.deleteItem({ databaseName, itemId: expenseId });
}

export {expenses, expensesSum, openExpensesDatabase, addExpense, updateExpense, deleteExpense};