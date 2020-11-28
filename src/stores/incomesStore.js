import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { get } from "svelte/store";

let incomes = writable([]);
let incomesSum = writable(0);
let incomesDBOpen = writable(false);
const databaseName = `${get(selectedYear)}-${get(selectedMonth)}-incomes`;

const openIncomesDatabase = () => {
        userbase.openDatabase({ databaseName, changeHandler: function (items) {
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
        .catch((e) => console.log(e))
        .finally(() => incomesDBOpen.set(true));
}

const addIncome = (income) => {
    return userbase.insertItem({ databaseName, item: income });
};

const updateIncome = (income, incomeId) => {
    return userbase.updateItem({ databaseName, item: income, itemId: incomeId });
};

const deleteIncome = (incomeId) => {
    return userbase.deleteItem({ databaseName, itemId: incomeId });
}

export {incomes, incomesSum, incomesDBOpen, openIncomesDatabase, addIncome, updateIncome, deleteIncome};