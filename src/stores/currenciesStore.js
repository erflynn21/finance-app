import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { get } from "svelte/store";

const currencyDict = {
    EUR: '€',
    CNY: '¥',
    USD: '$',
    JPY: '¥',
    BGN: 'лв',
    CZK: 'Kč',
    DKK: 'kr',
    GBP: '£',
    HUF: 'Ft',
    PLN: 'zł',
    RON: 'lei',
    SEK: 'kr',
    CHF: 'CHF',
    ISK: 'kr',
    NOK: 'kr',
    HRK: 'kn',
    RUB: '₽',
    TRY: '₺',
    AUD: '$',
    BRL: 'R$',
    CAD: '$',
    HKD: '$',
    IDR: 'Rp',
    ILS: '₪',
    INR: '₹',
    KRW: '₩',
    MXN: '$',
    MYR: 'RM',
    NZD: '$',
    PHP: '₱',
    SGD: '$',
    THB: '฿',
    ZAR: 'R',
};

let currencies = writable(null);
let baseCurrency = writable('');
let baseCurrencySymbol = writable('');
let currencyOptions = writable('');
const databaseName = `currencies`;

const openCurrenciesDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        currencies.set(items);
    }})
    .catch((e) => console.log(e))
    .finally(() => {
        baseCurrency.set(get(currencies)[0].item.baseCurrency);
        currencyOptions.set(get(currencies)[0].item.currencyOptions);
        baseCurrencySymbol.set(currencyDict[get(baseCurrency)]);
    });
}

const addCurrencies = (currencies) => {
    return userbase.insertItem({ databaseName, item: currencies });
};

const updateCurrencies = (currencies, currenciesId) => {
    return userbase.updateItem({ databaseName, item: currencies, itemId: currenciesId });
};


export {currencies, baseCurrency, baseCurrencySymbol, currencyOptions, openCurrenciesDatabase, addCurrencies, updateCurrencies };