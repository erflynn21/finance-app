import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { get } from "svelte/store";

let expenses = writable([]);
let expensesSum = writable(0);
const databaseName = `${get(selectedYear)}-${get(selectedMonth)}-expenses`;

const openExpensesDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        // sets the expenses based on date and timestamp
        let a = items;
        a.sort(function (a,b) {
            return (
                new Date(b.item.date) - new Date(a.item.date) ||
                new Date(b.createdBy.timestamp) -
                    new Date(a.createdBy.timestamp)
            );
        })
        expenses.set(a);

        // sets the expenses sum
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