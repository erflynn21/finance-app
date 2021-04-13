import {get} from 'svelte/store';
import {baseCurrency} from '../stores/currenciesStore';
import { startDate } from '../stores/datesStore';

const convert = async (item) => {
    if (item.originalAmount === null) {
        item.originalAmount = item.amount;
        item.originalCurrency = item.currency[0];
    }
    let date; 
    if (!item.date) {
        date = get(startDate);
    } else {
        date = item.date
    }

    let url = `https://api.exchangerate.host/convert?from=${get(baseCurrency)}&to=${item.originalCurrency}&date=${date}`;
    let response = await fetch(url);
    let data = await response.json();
    let exchangeRate = Number(JSON.stringify(data.info.rate));
    item.amount = Number(
        (item.originalAmount / exchangeRate).toFixed(2)
    );
    item.currency = get(baseCurrency);
    return(item);
};

export {convert}