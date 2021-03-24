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
        setCurrencies();
    }})
    .catch((e) => console.log(e))
}

const setCurrencies = () => {
    if (get(currencies).length > 0) {
        baseCurrency.set(get(currencies)[0].item.newBaseCurrency);
        currencyOptions.set(get(currencies)[0].item.newCurrencyOptions);
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

const addCurrencies = async (currencies) => {
    await userbase.insertItem({ databaseName, item: currencies });
    setCurrencies();
};

const updateCurrencies = async (updatedCurrencies, updatedCurrenciesId) => {
    await userbase.updateItem({ databaseName, item: updatedCurrencies, itemId: updatedCurrenciesId });
    setCurrencies();
};


export {currencies, baseCurrency, baseCurrencySymbol, currencyOptions, allCurrencies, openCurrenciesDatabase, addCurrencies, updateCurrencies };