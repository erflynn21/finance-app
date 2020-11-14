import {writable} from 'svelte/store';
import userbase from 'userbase-js';
import { userStore } from './userStore.js';
import { get } from "svelte/store";

let currencies = writable(null);
let baseCurrency = writable('');
let currencyOptions = writable('');
const databaseName = `currencies`;

const openDatabase = () => {
    let user = get(userStore);
    if (user !== null) {
        userbase.openDatabase({ databaseName, changeHandler: function (items) {
            currencies.set(items);
        }})
        .catch((e) => console.log(e))
        .finally(() => {
            baseCurrency.set(get(currencies)[0].item.baseCurrency);
            currencyOptions.set(get(currencies)[0].item.currencyOptions);
        });
    } else {
        setTimeout(openDatabase, 500)
    } 
}

openDatabase();

const addCurrencies = (currencies) => {
    userbase.insertItem({ databaseName, item: currencies });
};

const updateCurrencies = (currencies, currenciesId) => {
    userbase.updateItem({ databaseName, item: currencies, itemId: currenciesId });
};


export {currencies, baseCurrency, currencyOptions, addCurrencies, updateCurrencies };