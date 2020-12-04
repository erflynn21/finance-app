import {get, writable} from 'svelte/store';
import userbase from 'userbase-js';
import {baseCurrency} from './currenciesStore'
import { startDate } from './datesStore';
import { addMonthlyBudget, monthlyBudgets } from './monthlyBudgetsStore';

let budgets = writable([]);
let budgetsSum = writable(0);
let categories = writable([]);
const databaseName = `budgets`;

const openBudgetsDatabase = () => {
    userbase.openDatabase({ databaseName, changeHandler: function (items) {
        budgets.set(items);

        // sets the budgets sum
        let totalBudgets = [];
        get(budgets).forEach((budget) => {
            totalBudgets = [...totalBudgets, budget.item.amount];
        });
        budgetsSum.set(totalBudgets.reduce(function (a, b) {
            const sum = a + b;
            const trimmed = Number(sum.toFixed(2));
            return trimmed;
        }, 0));

        // sets the categories
        setCategories();

        // sets monthly budgets
        setMonthlyBudgets(items);
    }})
    .catch((e) => console.log(e));
    ;
}

const setCategories = () => {
    if (get(budgets).length > 0) {
        let budgetCategories = [];
        get(budgets).forEach((budget) => {
            budgetCategories = [...budgetCategories, budget.item.category];
        });
        categories.set(budgetCategories);
    }
}

const setMonthlyBudgets = async (budgets) => {
    budgets.forEach(async budget => {
        let monthlyBudget = get(monthlyBudgets).filter((monthlybudget) => monthlybudget.item.category === budget.item.category);
        if (monthlyBudget.length == 0) {
            let newMonthlyBudget = {
                amount: budget.item.amount,
                category: budget.item.category,
                currency: budget.item.currency,
            }

            if (newMonthlyBudget.currency !== get(baseCurrency)) {
                await convertAmount(newMonthlyBudget);
            }
            await addMonthlyBudget(newMonthlyBudget);
        } else {
            return;
        }
    });
}

const convertAmount = async (newMonthlyBudget) => {
    newMonthlyBudget.originalAmount = newMonthlyBudget.amount;
    newMonthlyBudget.originalCurrency = newMonthlyBudget.currency;
    let date = get(startDate);
    let url = `https://api.exchangeratesapi.io/${date}?base=${get(baseCurrency)}&symbols=${newMonthlyBudget.originalCurrency}`;
    let response = await fetch(url);
    let data = await response.json();
    let rates = JSON.stringify(data.rates);
    let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
    newMonthlyBudget.amount = Number(
        (newMonthlyBudget.originalAmount / exchangeRate).toFixed(2)
    );
    newMonthlyBudget.currency = get(baseCurrency);
};

const addBudget = (budget) => {
    return userbase.insertItem({ databaseName, item: budget });
};

const updateBudget = (budget, budgetId) => {
    return userbase.updateItem({ databaseName, item: budget, itemId: budgetId });
};

const deleteBudget = (budgetId) => {
    return userbase.deleteItem({ databaseName, itemId: budgetId });
}

export {budgets, budgetsSum, categories, setMonthlyBudgets, openBudgetsDatabase, addBudget, updateBudget, deleteBudget};