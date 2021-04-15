import {writable} from 'svelte/store';

let currencies = writable(null);
let baseCurrency = writable('');
let baseCurrencySymbol = writable('');
let currencyOptions = writable('');
let allCurrencies = writable([]);

export {currencies, baseCurrency, baseCurrencySymbol, currencyOptions, allCurrencies };