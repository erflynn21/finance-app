import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { get } from "svelte/store";

let incomes = writable([]);
let incomesSum = writable(0);
let incomesDatabaseName = writable(null);
incomesDatabaseName.set(`${get(selectedYear)}-incomes`);

const openIncomesDatabase = () => {
        return userbase.openDatabase({ databaseName: get(incomesDatabaseName), changeHandler: function (items) {
            // sorts the incomes based on date and timestamp
            let a = items;
            a.sort(function (a,b) {
                return (
                    new Date(b.item.date) - new Date(a.item.date) ||
                    new Date(b.createdBy.timestamp) -
                    new Date(a.createdBy.timestamp)
                );
            })
            incomes.set(a);

            // sets the income sum
            let totalIncomes = [];
            get(incomes).forEach((income) => {
                totalIncomes = [...totalIncomes, income.item.amount];
            });
            incomesSum.set(totalIncomes.reduce(function (a, b) {
                const sum = a + b;
                const trimmed = Number(sum.toFixed(2));
                return trimmed;
            }, 0));
        }})
        .catch((e) => console.log(e));
}

const addIncome = (income) => {
    return userbase.insertItem({ databaseName: get(incomesDatabaseName), item: income });
};

const updateIncome = (income, incomeId) => {
    return userbase.updateItem({ databaseName: get(incomesDatabaseName), item: income, itemId: incomeId });
};

const deleteIncome = (incomeId) => {
    return userbase.deleteItem({ databaseName: get(incomesDatabaseName), itemId: incomeId });
}

export {incomes, incomesSum, incomesDatabaseName, openIncomesDatabase, addIncome, updateIncome, deleteIncome};