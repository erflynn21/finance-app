import userbase from 'userbase-js';
import { monthlyBudgets, monthlyBudgetsSum, monthlyBudgetsDatabaseName } from '../stores/monthlyBudgetsStore';
import { get } from "svelte/store";

const openMonthlyBudgetsDatabase = async () => {
    try {
        return userbase.openDatabase({
            databaseName: get(monthlyBudgetsDatabaseName), changeHandler: function (items) {
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
            }
        });
    } catch (e) {
        return console.log(e);
    }
}

const addMonthlyBudget = (monthlyBudget) => {
    try {
        return userbase.insertItem({ databaseName: get(monthlyBudgetsDatabaseName), item: monthlyBudget });
    } catch (e) {
        return e;
    }
};

const updateMonthlyBudget = (monthlyBudget, monthlyBudgetId) => {
    try {
        return userbase.updateItem({ databaseName: get(monthlyBudgetsDatabaseName), item: monthlyBudget, itemId: monthlyBudgetId });
    } catch (e) {
        return e;
    }
};

const deleteMonthlyBudget = (monthlyBudgetId) => {
    try {
        return userbase.deleteItem({ databaseName: get(monthlyBudgetsDatabaseName), itemId: monthlyBudgetId });
    } catch (e) {
        return e;
    }
};

export {openMonthlyBudgetsDatabase, addMonthlyBudget, updateMonthlyBudget, deleteMonthlyBudget}