import { writable } from "svelte/store";

const budgetCurrency = writable('USD');
const spendingCurrency = writable('CNY');
const currencyOptions = writable(['USD', 'CNY']);

export { budgetCurrency, currencyOptions, spendingCurrency };