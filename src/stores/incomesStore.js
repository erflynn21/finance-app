import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { userStore } from './userStore.js';
import { get } from "svelte/store";

let incomes = writable([]);
const databaseName = `${selectedMonth}${selectedYear}incomes`;

const openDatabase = () => {
    let user = get(userStore);
    if (user !== null) {
        userbase.openDatabase({ databaseName, changeHandler: function (items) {
            incomes.set(items);
        }})
        .catch((e) => console.log(e));
    } else {
        setTimeout(openDatabase, 500)
    } 
}

openDatabase();

const addIncome = (income) => {
    userbase.insertItem({ databaseName, item: income });
};

const updateIncome = (income, incomeId) => {
    userbase.updateItem({ databaseName, item: income, itemId: incomeId });
};

const deleteIncome = (incomeId) => {
    userbase.deleteItem({ databaseName, itemId: incomeId });
}

export {expenses, addIncome, updateIncome, deleteIncome};