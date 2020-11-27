import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { get } from "svelte/store";
import { currencyDict } from './dictionariesStore';

let currencies = writable(null);
let baseCurrency = writable('');
let baseCurrencySymbol = writable('');
let currencyOptions = writable('');
let allCurrencies = writable([]);
const databaseName = `currencies`;

const openCurrenciesDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        currencies.set(items);
    }})
    .catch((e) => console.log(e))
    .finally(() => {
        setCurrencies();
    });
}

const setCurrencies = () => {
    if (get(currencies).length > 0) {
        baseCurrency.set(get(currencies)[0].item.baseCurrency);
        currencyOptions.set(get(currencies)[0].item.currencyOptions);
        baseCurrencySymbol.set(currencyDict[get(baseCurrency)]);

        let everyCurrency = [];
        everyCurrency = [...everyCurrency, get(baseCurrency)];
        get(currencyOptions).forEach(currencyOption => {
            everyCurrency = [...everyCurrency, currencyOption];
        });
        allCurrencies.set(everyCurrency);
    } else {
        return;
    }
}

const addCurrencies = (currencies) => {
    return userbase.insertItem({ databaseName, item: currencies })
        .then(() => {
            setCurrencies();
        });
};

const updateCurrencies = (updatedCurrencies, updatedCurrenciesId) => {
    return userbase.updateItem({ databaseName, item: updatedCurrencies, itemId: updatedCurrenciesId })
        .then(() => {
            setCurrencies();
        });
};


export {currencies, baseCurrency, baseCurrencySymbol, currencyOptions, allCurrencies, openCurrenciesDatabase, addCurrencies, updateCurrencies };