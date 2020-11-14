import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/datesStore';
import { userStore } from './userStore.js';
import { get } from "svelte/store";

let monthlyIncomes = writable([]);
const databaseName = `${selectedMonth}${selectedYear}monthlyIncomes`;

const openDatabase = () => {
    let user = get(userStore);
    if (user !== null) {
        userbase.openDatabase({ databaseName, changeHandler: function (items) {
            monthlyIncomes.set(items);
        }})
        .catch((e) => console.log(e));
    } else {
        setTimeout(openDatabase, 500)
    } 
}

openDatabase();

const addMonthlyIncomes = (monthlyIncome) => {
    userbase.insertItem({ databaseName, item: monthlyIncome });
};

const updateMonthlyIncomes = (monthlyIncome, monthlyIncomeId) => {
    userbase.updateItem({ databaseName, item: monthlyIncome, itemId: monthlyIncomeId });
};

const deleteMonthlyIncomes = (monthlyIncomeId) => {
    userbase.deleteItem({ databaseName, itemId: monthlyIncomeId });
}

export {expenses, addMonthlyIncomes, updateMonthlyIncomes, deleteMonthlyIncomes};