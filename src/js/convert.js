import { get } from 'svelte/store';
import { budgetCurrency } from '../stores/currenciesStore';
import { startDate } from '../stores/datesStore';

const convert = async (item) => {
    if (item.originalAmount === null) {
        item.originalAmount = item.amount;
        item.originalCurrency = item.currency;
    }

    if (!item.originalAmount) {
        item.originalAmount = item.amount;
        item.originalCurrency = item.currency;
    }

    let date;
    let originalCurrency; 
    if (!item.date) {
        date = get(startDate);
        originalCurrency = item.currency
    } else {
        date = item.date;
        originalCurrency = item.originalCurrency
    }

    let url = `https://api.exchangerate.host/convert?from=${get(budgetCurrency)}&to=${originalCurrency}&date=${date}`;
    let response = await fetch(url);
    let data = await response.json();
    let exchangeRate = Number(JSON.stringify(data.info.rate));
    item.amount = Number(
        (item.originalAmount / exchangeRate).toFixed(2)
    );
    item.currency = get(budgetCurrency);
    return(item);
};

export {convert}