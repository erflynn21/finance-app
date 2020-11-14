import {writable} from 'svelte/store';

const expenseSumStore = writable('');
const incomeSumStore = writable('');
const baseCurrency = writable('');
const baseCurrencySymbol = writable('');
const userSettingsStore = writable('');

export { expenseSumStore, incomeSumStore, baseCurrency, baseCurrencySymbol, userSettingsStore};