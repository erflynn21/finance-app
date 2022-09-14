import { writable } from "svelte/store";

const budgetCurrency = writable(null);
const spendingCurrency = writable(null);
const currencyOptions = writable(null);

export { budgetCurrency, currencyOptions, spendingCurrency };