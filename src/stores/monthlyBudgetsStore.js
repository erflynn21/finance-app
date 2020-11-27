import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { get } from "svelte/store";

let monthlyBudgets = writable([]);
let monthlyDBOpen = writable(false);
const databaseName = `${get(selectedYear)}-${get(selectedMonth)}-monthlyBudgets`;

const openMonthlyBudgetsDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        monthlyBudgets.set(items);
    }})
    .catch((e) => console.log(e))
    .finally(() => monthlyDBOpen.set(true));
}

const addMonthlyBudget = (monthlyBudget) => {
    return userbase.insertItem({ databaseName, item: monthlyBudget });
};

const updateMonthlyBudget = (monthlyBudget, monthlyBudgetId) => {
    return userbase.updateItem({ databaseName, item: monthlyBudget, itemId: monthlyBudgetId });
};

const deleteMonthlyBudget = (monthlyBudgetId) => {
    return userbase.deleteItem({ databaseName, itemId: monthlyBudgetId });
};

export {monthlyBudgets, monthlyDBOpen, openMonthlyBudgetsDatabase, addMonthlyBudget, updateMonthlyBudget, deleteMonthlyBudget};