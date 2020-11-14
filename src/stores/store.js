import {writable} from 'svelte/store';

// getting current date
const date = new Date();
const currentYear = date.getFullYear();
let currentMonth = '';
if (date.getMonth() + 1 >= 10) {
    currentMonth = date.getMonth() + 1;
} else {
    currentMonth = '0' + date.getMonth() + 1;
}

let today = '';
if (date.getDate() >= 10) {
    today = date.getDate();
} else {
    today = '0' + date.getDate();
}

const start = currentYear + '-' + currentMonth + '-01';
const end = currentYear + '-' + currentMonth + '-' + today;

const baseBudgetSumStore = writable('');
const startDate = writable('');
const endDate = writable('');
const selectedMonth = writable('');
const selectedYear = writable('');

startDate.set(`${start}`);
endDate.set(`${end}`);
selectedMonth.set(currentMonth);
selectedYear.set(currentYear);

const expenseSumStore = writable('');
const incomeSumStore = writable('');
const baseCurrency = writable('');
const baseCurrencySymbol = writable('');
const userSettingsStore = writable('');

export {baseBudgetSumStore, startDate, endDate, selectedMonth, selectedYear, expenseSumStore, incomeSumStore, baseCurrency, baseCurrencySymbol, userSettingsStore};