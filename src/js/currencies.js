import userbase from 'userbase-js';
import { budgetCurrency, currencyOptions, spendingCurrency } from '../stores/currenciesStore';

const databaseName = 'currencies';

const openCurrenciesDatabase = async () => {
    try {
        await userbase.openDatabase({ databaseName, 
            changeHandler: (items) => {
                setCurrencies(items);
            }
        });
    } catch (e) {
        return e;
    }
}

const setCurrencies = (items) => {
    budgetCurrency.set(items[0].baseCurrency);
    spendingCurrency.set(items[0].spendingCurrency);
    currencyOptions.set(items[0].currencyOptions);
}

const addCurrencies = async (currencies) => {
    try {
        await userbase.insertItem({
            databaseName,
            item: currencies
        });
    } catch (e) {
        console.log(e);
    }
}

const updateCurrencies = async (currencies) => {
    try {
        await userbase.updateItem({
            databaseName,
            item: currencies
        });
    } catch (e) {
        return e;
    }
}

export { openCurrenciesDatabase, addCurrencies, updateCurrencies };