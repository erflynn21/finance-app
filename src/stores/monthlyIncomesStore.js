import {writable} from 'svelte/store';
import userbase from 'userbase-js';

let monthlyIncomes = writable([]);
const databaseName = `monthlyIncomes`;

const openMonthlyIncomesDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        monthlyIncomes.set(items);
    }})
    .catch((e) => console.log(e));
}

const addMonthlyIncomes = (monthlyIncome) => {
    return userbase.insertItem({ databaseName, item: monthlyIncome });
};

const updateMonthlyIncomes = (monthlyIncome, monthlyIncomeId) => {
    return userbase.updateItem({ databaseName, item: monthlyIncome, itemId: monthlyIncomeId });
};

const deleteMonthlyIncomes = (monthlyIncomeId) => {
    return userbase.deleteItem({ databaseName, itemId: monthlyIncomeId });
}

export {monthlyIncomes, openMonthlyIncomesDatabase, addMonthlyIncomes, updateMonthlyIncomes, deleteMonthlyIncomes};