import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from '../stores/store';


const createExpensesStore = () => {
    const {subscribe, set} = writable('');
    const databaseName = `${selectedMonth}${selectedYear}expenses`;
    
    let expenses = [];
    function changeHandler(items) {expenses = items};
    userbase.openDatabase({ databaseName, changeHandler })
        .then(() => set(expenses));
    ;

    return {
        subscribe,
        addExpense: (expense) => {
            userbase.insertItem({ databaseName, item: expense });
        },
        updateExpense: (expense, expenseId) => {
            userbase.updateItem({ databaseName, item: expense, itemId: expenseId });
        },
        deleteExpense: (expenseId) => {
            userbase.deleteItem({ databaseName, itemId: expenseId });
        }
    };
}

export const expensesStore = createExpensesStore();