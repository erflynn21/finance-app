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

const baseBudgetsStore = writable('');
const baseBudgetSumStore = writable('');
const budgetSumStore = writable('');
const startDate = writable('');
const endDate = writable('');
const selectedMonth = writable('');
const selectedYear = writable('');

startDate.set(`${start}`);
endDate.set(`${end}`);
selectedMonth.set(currentMonth);
selectedYear.set(currentYear);

const expensesStore = writable('');
const expenseSumStore = writable('');
const incomesStore = writable('');
const incomeSumStore = writable('');
const monthlyBudgetsStore = writable('');
const monthlyExpensesStore = writable('');
const monthlyIncomesStore = writable('');
const userCurrency = writable('');
const userCurrencySymbol = writable('');
const userSettingsStore = writable('');

export {baseBudgetsStore, baseBudgetSumStore, budgetSumStore, startDate, endDate, selectedMonth, selectedYear, expensesStore, expenseSumStore, incomesStore, incomeSumStore, monthlyBudgetsStore, monthlyExpensesStore, monthlyIncomesStore, userCurrency, userCurrencySymbol, userSettingsStore};