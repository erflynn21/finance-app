<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import Expense from './Expense.svelte';
    import Income from './Income.svelte';
    import { Expenses } from '../api/expenses';
    import { Incomes } from '../api/incomes';

    let userCurrency = 'CNY';

    let expense = {
        title: '',
        amount: null,
        date: new Date().toISOString().substr(0, 10),
        currency: userCurrency,
        convertedAmount: null,
        convertCurrency: null,
    };

    let income = {
        title: '',
        amount: null,
        date: new Date().toISOString().substr(0, 10),
        currency: userCurrency,
        convertedAmount: null,
        convertCurrency: null,
    };

    $: expenses = useTracker(() =>
        Expenses.find({}, { sort: { date: -1 } }).fetch()
    );

    $: incomes = useTracker(() =>
        Incomes.find({}, { sort: { date: -1 } }).fetch()
    );

    async function handleAddExpense() {
        // check whether expense needs to be converted to base currency
        if (expense.currency !== userCurrency) {
            await convertAmount();
        } else {
            expense.currency = userCurrency;
        }

        // add the expense
        Expenses.insert({
            title: expense.title,
            date: expense.date,
            amount: expense.amount,
            convertedAmount: expense.convertedAmount,
            currency: expense.currency,
            convertedCurrency: userCurrency,
        });

        // clear form
        expense.title = '';
        expense.date = new Date().toISOString().substr(0, 10);
        expense.amount = '';
        expense.currency = userCurrency;
        expense.convertCurrency = null;
        expense.convertedAmount = null;
    }

    async function handleAddIncome() {
        // check whether expense needs to be converted to base currency
        if (income.currency !== userCurrency) {
            await convertAmount();
        } else {
            income.currency = userCurrency;
        }

        // add the income
        Incomes.insert({
            title: income.title,
            date: income.date,
            amount: income.amount,
            convertedAmount: income.convertedAmount,
            currency: income.currency,
            convertedCurrency: userCurrency,
        });

        // clear form
        income.title = '';
        income.date = new Date().toISOString().substr(0, 10);
        income.amount = '';
        income.currency = userCurrency;
        income.convertCurrency = null;
        income.convertedAmount = null;
    }

    async function convertAmount() {
        let url = `https://api.exchangeratesapi.io/${expense.date}?base=${userCurrency}&symbols=${expense.currency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        if (expense) {
            expense.convertedAmount = (expense.amount / exchangeRate).toFixed(
                2
            );
        } else {
            income.convertedAmount = (income.amount / exchangeRate).toFixed(2);
        }
    }
</script>

<div class="container">
    <header>
        <h1>Expenses</h1>
        <form class="new-expense" on:submit|preventDefault={handleAddExpense}>
            <input
                type="text"
                placeholder="new expense..."
                bind:value={expense.title} />
            <input type="date" id="today" bind:value={expense.date} />
            <input
                type="number"
                placeholder="amount"
                bind:value={expense.amount} />
            <select id="currency" bind:value={expense.currency}>
                <option value="USD">USD</option>
                <option value="CNY">CNY</option>
            </select>
            <button on:click|preventDefault={handleAddExpense}>Add</button>
        </form>
        <form class="new-income" on:submit|preventDefault={handleAddIncome}>
            <input
                type="text"
                placeholder="new income..."
                bind:value={income.title} />
            <input type="date" id="today" bind:value={income.date} />
            <input
                type="number"
                placeholder="amount"
                bind:value={income.amount} />
            <select id="currency" bind:value={income.currency}>
                <option value="USD">USD</option>
                <option value="CNY">CNY</option>
            </select>
            <button on:click|preventDefault={handleAddIncome}>Add</button>
        </form>
    </header>
    <h1>Expenses:</h1>
    {#each $expenses as expense (expense._id)}
        <Expense {expense} />
    {/each}
    <h1>Incomes:</h1>
    {#each $incomes as income (income._id)}
        <Income {income} />
    {/each}

</div>
