import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { userStore } from './userStore.js';
import { get } from "svelte/store";

let incomes = writable([]);
let incomesSum = writable(0);
const databaseName = `${selectedMonth}-${selectedYear}-incomes`;

const openDatabase = () => {
    let user = get(userStore);
    if (user !== null) {
        userbase.openDatabase({ databaseName, changeHandler: function (items) {
            incomes.set(items)
            let totalIncomes = [];
            get(incomes).forEach((income) => {
                totalExpenses = [...totalExpenses, income.item.amount];
            });
            incomesSum.set(totalIncomes.reduce(function (a, b) {
                const sum = a + b;
                const trimmed = Number(sum.toFixed(2));
                return trimmed;
            }, 0));
        }})
        .catch((e) => console.log(e));
    } else {
        setTimeout(openDatabase, 500)
    } 
}

openDatabase();

const addIncome = (income) => {
    return userbase.insertItem({ databaseName, item: income });
};

const updateIncome = (income, incomeId) => {
    return userbase.updateItem({ databaseName, item: income, itemId: incomeId });
};

const deleteIncome = (incomeId) => {
    return userbase.deleteItem({ databaseName, itemId: incomeId });
}

export {incomes, incomesSum, addIncome, updateIncome, deleteIncome};