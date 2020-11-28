import {get, writable} from 'svelte/store';
import {expenses, addExpense} from './expensesStore';
import {baseCurrency} from './currenciesStore'
import userbase from 'userbase-js';
import { selectedMonth, selectedYear } from './datesStore';

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
    monthlyExpenses.forEach(async monthlyExpense => {
        let result = get(expenses).filter((expense) => expense.item.title === monthlyExpense.item.title);
        if (result.length == 0) {
            let newExpenseFromMonthly = {
                title: monthlyExpense.item.title,
                amount: monthlyExpense.item.amount,
                category: monthlyExpense.item.category,
                date: get(selectedYear) + '-' + get(selectedMonth) + '-' + monthlyExpense.item.recurringDate,
                currency: monthlyExpense.item.currency,
                originalAmount: null,
                originalCurrency: null,
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
    return userbase.insertItem({ databaseName, item: monthlyExpense });
};

const updateMonthlyExpense = (monthlyExpense, monthlyExpenseId) => {
    return userbase.updateItem({ databaseName, item: monthlyExpense, itemId: monthlyExpenseId });
};

const deleteMonthlyExpense = (monthlyExpenseId) => {
    return userbase.deleteItem({ databaseName, itemId: monthlyExpenseId });
}

export {monthlyExpenses, openMonthlyExpensesDatabase, addMonthlyExpense, updateMonthlyExpense, deleteMonthlyExpense};