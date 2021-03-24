import {get, writable} from 'svelte/store';
import {expenses, addExpense} from './expensesStore';
import {baseCurrency} from './currenciesStore'
import userbase from 'userbase-js';
import { currentDate, selectedMonth, selectedYear } from './datesStore';

let monthlyExpenses = writable([]);
const databaseName = `monthlyExpenses`;

const openMonthlyExpensesDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        monthlyExpenses.set(items);

        checkRecurringExpenses(items);
    }})
    .catch((e) => console.log(e));
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
                await convertAmount(newExpenseFromMonthly);
            }
            addExpense(newExpenseFromMonthly);
        } else {
            return;
        }
    });
};

const convertAmount = async (newExpenseFromMonthly) => {
    newExpenseFromMonthly.originalAmount = newExpenseFromMonthly.amount;
    newExpenseFromMonthly.originalCurrency = newExpenseFromMonthly.currency;
    let url = `https://api.exchangeratesapi.io/${newExpenseFromMonthly.date}?base=${get(baseCurrency)}&symbols=${newExpenseFromMonthly.originalCurrency}`;
    let response = await fetch(url);
    let data = await response.json();
    let rates = JSON.stringify(data.rates);
    let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
    newExpenseFromMonthly.amount = Number(
        (newExpenseFromMonthly.originalAmount / exchangeRate).toFixed(2)
    );
    newExpenseFromMonthly.currency = get(baseCurrency);
}

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