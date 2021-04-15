import {get, writable} from 'svelte/store';
import {expenses, addExpense} from './expensesStore';
import {baseCurrency} from './currenciesStore'
import userbase from 'userbase-js';
import { currentDate, selectedMonth, selectedYear } from './datesStore';
import { convert } from '../js/convert';

let monthlyExpenses = writable([]);
const databaseName = `monthlyExpenses`;

const openMonthlyExpensesDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        monthlyExpenses.set(items);
    }})
    .catch((e) => console.log(e))
    .finally(() => checkRecurringExpenses(get(monthlyExpenses)));
}



const checkRecurringExpenses = async (monthlyExpenses) => {
    let newExpenseFromMonthly;
    monthlyExpenses.forEach(async monthlyExpense => {
        let result = get(expenses).filter((expense) => (expense.item.title === monthlyExpense.item.title));
        if (result.length == 0 && Number(monthlyExpense.item.recurringDate) <= get(currentDate)) {
            if (get(selectedMonth) < 10) {
                newExpenseFromMonthly = {
                    title: monthlyExpense.item.title,
                    amount: monthlyExpense.item.amount,
                    category: monthlyExpense.item.category,
                    date: get(selectedYear) + '-0' + get(selectedMonth) + '-' + monthlyExpense.item.recurringDate,
                    currency: monthlyExpense.item.currency,
                    originalAmount: null,
                    originalCurrency: null,
                }
            } else {
                newExpenseFromMonthly = {
                    title: monthlyExpense.item.title,
                    amount: monthlyExpense.item.amount,
                    category: monthlyExpense.item.category,
                    date: get(selectedYear) + '-' + get(selectedMonth) + '-' + monthlyExpense.item.recurringDate,
                    currency: monthlyExpense.item.currency,
                    originalAmount: null,
                    originalCurrency: null,
                }
            }
            

            if (newExpenseFromMonthly.currency !== get(baseCurrency)) {
                await convert(newExpenseFromMonthly);
            }
            addExpense(newExpenseFromMonthly);
        } else {
            return;
        }
    });
};

const addMonthlyExpense = (monthlyExpense) => {
    try {
        return userbase.insertItem({ databaseName, item: monthlyExpense });
    } catch (e) {
        return e;
    }
};

const updateMonthlyExpense = (monthlyExpense, monthlyExpenseId) => {
    try {
        return userbase.updateItem({ databaseName, item: monthlyExpense, itemId: monthlyExpenseId });
    } catch (e) {
        return e;
    }
};

const deleteMonthlyExpense = (monthlyExpenseId) => {
    try {
        return userbase.deleteItem({ databaseName, itemId: monthlyExpenseId });
    } catch (e) {
        return e;
    }
}

export {monthlyExpenses, openMonthlyExpensesDatabase, addMonthlyExpense, updateMonthlyExpense, deleteMonthlyExpense};