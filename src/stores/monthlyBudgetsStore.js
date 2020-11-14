import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { userStore } from './userStore.js';
import { get } from "svelte/store";

let monthlyBudgets = writable([]);
const databaseName = `${selectedMonth}${selectedYear}monthlyBudgets`;

const openDatabase = () => {
    let user = get(userStore);
    if (user !== null) {
        userbase.openDatabase({ databaseName, changeHandler: function (items) {
            monthlyBudgets.set(items);
        }})
        .catch((e) => console.log(e));
    } else {
        setTimeout(openDatabase, 500)
    } 
}

openDatabase();

const addMonthlyBudget = (monthlyBudget) => {
    userbase.insertItem({ databaseName, item: monthlyBudget });
};

const updateMonthlyBudget = (monthlyBudget, monthlyBudgetId) => {
    userbase.updateItem({ databaseName, item: monthlyBudget, itemId: monthlyBudgetId });
};

const deleteMonthlyBudget = (monthlyBudgetId) => {
    userbase.deleteItem({ databaseName, itemId: monthlyBudgetId });
};

export {expenses, addMonthlyBudget, updateMonthlyBudget, deleteMonthlyBudget};