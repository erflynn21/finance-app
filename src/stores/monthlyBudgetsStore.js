import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { get } from "svelte/store";

let monthlyBudgets = writable([]);
let monthlyBudgetsSum = writable(0);
let monthlyDBOpen = writable(false);
const databaseName = `${get(selectedYear)}-${get(selectedMonth)}-monthlyBudgets`;

const openMonthlyBudgetsDatabase = () => {
    return userbase.openDatabase({ databaseName, changeHandler: function (items) {
        monthlyBudgets.set(items);
        // sets the monthly budgets total
        let totalMonthlyBudgets = [];
        get(monthlyBudgets).forEach((monthlyBudget) => {
            totalMonthlyBudgets = [...totalMonthlyBudgets, monthlyBudget.item.amount];
        });
        monthlyBudgetsSum.set(totalMonthlyBudgets.reduce(function (a, b) {
            const sum = a + b;
            const trimmed = Number(sum.toFixed(2));
            return trimmed;
        }, 0));
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

export {monthlyBudgets, monthlyBudgetsSum, monthlyDBOpen, openMonthlyBudgetsDatabase, addMonthlyBudget, updateMonthlyBudget, deleteMonthlyBudget};