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

const addMonthlyIncome = (monthlyIncome) => {
    return userbase.insertItem({ databaseName, item: monthlyIncome });
};

const updateMonthlyIncome = (monthlyIncome, monthlyIncomeId) => {
    return userbase.updateItem({ databaseName, item: monthlyIncome, itemId: monthlyIncomeId });
};

const deleteMonthlyIncome = (monthlyIncomeId) => {
    return userbase.deleteItem({ databaseName, itemId: monthlyIncomeId });
}

export {monthlyIncomes, openMonthlyIncomesDatabase, addMonthlyIncome, updateMonthlyIncome, deleteMonthlyIncome};