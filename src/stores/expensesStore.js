import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { get } from "svelte/store";

let expenses = writable([]);
let expensesSum = writable(0);
let expensesDatabaseName = writable(null);
expensesDatabaseName.set(`${get(selectedYear)}-expenses`);

const openExpensesDatabase = async () => {
    try {
        return userbase.openDatabase({
            databaseName: get(expensesDatabaseName), changeHandler: function (items_2) {
                // sets the expenses based on date and timestamp
                let a = items_2;
                a.sort(function (a_1, b) {
                    return (
                        new Date(b.item.date) - new Date(a_1.item.date) ||
                        new Date(b.createdBy.timestamp) -
                        new Date(a_1.createdBy.timestamp)
                    );
                });
                expenses.set(a);

                // sets the expenses sum
                let totalExpenses = [];
                get(expenses).forEach((expense) => {
                    totalExpenses = [...totalExpenses, expense.item.amount];
                });
                expensesSum.set(totalExpenses.reduce(function (a_2, b_1) {
                    const sum = a_2 + b_1;
                    const trimmed = Number(sum.toFixed(2));
                    return trimmed;
                }, 0));

            }
        });
    } catch (e) {
        return console.log(e);
    }
}

const addExpense = (expense) => {
    return userbase.insertItem({ databaseName: get(expensesDatabaseName), item: expense });
};

const updateExpense = (expense, expenseId) => {
    return userbase.updateItem({ databaseName: get(expensesDatabaseName), item: expense, itemId: expenseId });
};

const deleteExpense = (expenseId) => {
    try {
        return userbase.deleteItem({ databaseName: get(expensesDatabaseName), itemId: expenseId });
    } catch (e) {
        return console.log(e);
    }
}

export {expenses, expensesSum, expensesDatabaseName, openExpensesDatabase, addExpense, updateExpense, deleteExpense};