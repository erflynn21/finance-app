import {get, writable} from 'svelte/store';
import userbase from 'userbase-js';
import {incomes, addIncome} from './incomesStore';
import {baseCurrency} from './currenciesStore'
import { currentDate, selectedMonth, selectedYear } from './datesStore';

let monthlyIncomes = writable([]);
const databaseName = `monthlyIncomes`;

const openMonthlyIncomesDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        monthlyIncomes.set(items);

        checkRecurringIncomes(items);
    }})
    .catch((e) => console.log(e));
}

const checkRecurringIncomes = async (monthlyIncomes) => {
    monthlyIncomes.forEach(async monthlyIncome => {
        let result = get(incomes).filter((income) => income.item.title === monthlyIncome.item.title);
        if (result.length == 0 && monthlyIncome.item.recurringDate <= get(currentDate)) {
            let newIncomeFromMonthly = {
                title: monthlyIncome.item.title,
                amount: monthlyIncome.item.amount,
                category: monthlyIncome.item.category,
                date: get(selectedYear) + '-' + get(selectedMonth) + '-' + monthlyIncome.item.recurringDate,
                currency: monthlyIncome.item.currency,
                originalAmount: null,
                originalCurrency: null,
            }

            if (newIncomeFromMonthly.currency !== get(baseCurrency)) {
                await convertAmount(newIncomeFromMonthly);
            }
            addIncome(newIncomeFromMonthly);
        } else {
            return;
        }
    });
};

const convertAmount = async (newIncomeFromMonthly) => {
    newIncomeFromMonthly.originalAmount = newIncomeFromMonthly.amount;
    newIncomeFromMonthly.originalCurrency = newIncomeFromMonthly.currency;
    let url = `https://api.exchangeratesapi.io/${newIncomeFromMonthly.date}?base=${get(baseCurrency)}&symbols=${newIncomeFromMonthly.originalCurrency}`;
    let response = await fetch(url);
    let data = await response.json();
    let rates = JSON.stringify(data.rates);
    let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
    newIncomeFromMonthly.amount = Number(
        (newIncomeFromMonthly.originalAmount / exchangeRate).toFixed(2)
    );
    newIncomeFromMonthly.currency = get(baseCurrency);
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