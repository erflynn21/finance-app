import {get, writable} from 'svelte/store';
import userbase from 'userbase-js';
import {incomes, addIncome} from './incomesStore';
import {baseCurrency} from './currenciesStore'
import { currentDate, selectedMonth, selectedYear } from './datesStore';
import { convert } from '../js/convert';

let monthlyIncomes = writable([]);
const databaseName = `monthlyIncomes`;

const openMonthlyIncomesDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        monthlyIncomes.set(items);
    }})
    .catch((e) => console.log(e))
    .finally(() => checkRecurringIncomes(get(monthlyIncomes)));
}


const checkRecurringIncomes = async (monthlyIncomes) => {
    let newIncomeFromMonthly;
    monthlyIncomes.forEach(async monthlyIncome => {
        let result = get(incomes).filter((income) => income.item.title === monthlyIncome.item.title);
        if (result.length == 0 && Number(monthlyIncome.item.recurringDate) <= get(currentDate)) {
            if (get(selectedMonth) < 10) {
                newIncomeFromMonthly = {
                    title: monthlyIncome.item.title,
                    amount: monthlyIncome.item.amount,
                    category: monthlyIncome.item.category,
                    date: get(selectedYear) + '-0' + get(selectedMonth) + '-' + monthlyIncome.item.recurringDate,
                    currency: monthlyIncome.item.currency,
                    originalAmount: null,
                    originalCurrency: null,
                }
            } else {
                newIncomeFromMonthly = {
                    title: monthlyIncome.item.title,
                    amount: monthlyIncome.item.amount,
                    category: monthlyIncome.item.category,
                    date: get(selectedYear) + '-' + get(selectedMonth) + '-' + monthlyIncome.item.recurringDate,
                    currency: monthlyIncome.item.currency,
                    originalAmount: null,
                    originalCurrency: null,
                }
            }
            

            if (newIncomeFromMonthly.currency !== get(baseCurrency)) {
                await convert(newIncomeFromMonthly);
            }

            addIncome(newIncomeFromMonthly);
        } else {
            return;
        }
    });
};

const addMonthlyIncome = (monthlyIncome) => {
    try {
        return userbase.insertItem({ databaseName, item: monthlyIncome });
    } catch (e) {
        return e;
    }
};

const updateMonthlyIncome = (monthlyIncome, monthlyIncomeId) => {
    try {
        return userbase.updateItem({ databaseName, item: monthlyIncome, itemId: monthlyIncomeId });
    } catch (e) {
        return e;
    }
};

const deleteMonthlyIncome = (monthlyIncomeId) => {
    try {
        return userbase.deleteItem({ databaseName, itemId: monthlyIncomeId });
    } catch (e) {
        return e;
    }
}

export {monthlyIncomes, openMonthlyIncomesDatabase, addMonthlyIncome, updateMonthlyIncome, deleteMonthlyIncome};