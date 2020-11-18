import {get, writable} from 'svelte/store';
import userbase from 'userbase-js';

let monthlyExpenses = writable([]);
const databaseName = `monthlyExpenses`;

const openMonthlyExpensesDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        monthlyExpenses.set(items);
    }})
    .catch((e) => console.log(e));
}

const addMonthlyExpense = (monthlyExpense) => {
    return userbase.insertItem({ databaseName, item: monthlyExpense });
};

const updateMonthlyExpense = (monthlyExpense, monthlyExpenseId) => {
    return userbase.updateItem({ databaseName, item: monthlyExpense, itemId: monthlyExpenseId });
};

const deleteMonthlyExpense = (monthlyExpenseId) => {
    return userbase.deleteItem({ databaseName, itemId: monthlyExpenseId });
}

export {monthlyExpenses, openMonthlyExpensesDatabase, addMonthlyExpense, updateMonthlyExpense, deleteMonthlyExpense};