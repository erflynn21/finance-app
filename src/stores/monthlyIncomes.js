import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { userStore } from './userStore.js';
import { get } from "svelte/store";

let monthlyIncomes = writable([]);
const databaseName = `monthlyIncomes`;

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
    return userbase.insertItem({ databaseName, item: monthlyIncome });
};

const updateMonthlyIncomes = (monthlyIncome, monthlyIncomeId) => {
    return userbase.updateItem({ databaseName, item: monthlyIncome, itemId: monthlyIncomeId });
};

const deleteMonthlyIncomes = (monthlyIncomeId) => {
    return userbase.deleteItem({ databaseName, itemId: monthlyIncomeId });
}

export {expenses, addMonthlyIncomes, updateMonthlyIncomes, deleteMonthlyIncomes};