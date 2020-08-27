<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import Expense from './components/Expense.svelte';
    import Income from './components/Income.svelte';
    import { Expenses } from '../api/expenses';
    import { Incomes } from '../api/incomes';

    let userCurrency = 'CNY';

    let expense = {
        title: '',
        amount: null,
        date: new Date().toISOString().substr(0, 10),
        currency: userCurrency,
        originalAmount: null,
        originalCurrency: null,
    };

    let income = {
        title: '',
        amount: null,
        date: new Date().toISOString().substr(0, 10),
        currency: userCurrency,
        originalAmount: null,
        originalCurrency: null,
    };

    $: expenses = useTracker(() =>
        Expenses.find({}, { sort: { date: -1 } }).fetch()
    );

    $: incomes = useTracker(() =>
        Incomes.find({}, { sort: { date: -1 } }).fetch()
    );

    let totalExpenses = [];
    let expenseSum = 0;
    // let totalIncome = 0;

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
            originalAmount: expense.originalAmount,
            currency: expense.currency,
            originalCurrency: expense.originalCurrency,
        });

        // clear form
        expense.title = '';
        expense.date = new Date().toISOString().substr(0, 10);
        expense.amount = '';
        expense.currency = userCurrency;
        expense.originalCurrency = null;
        expense.originalAmount = null;
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
            originalAmount: income.originalAmount,
            currency: income.currency,
            originalCurrency: income.originalCurrency,
        });

        // clear form
        income.title = '';
        income.date = new Date().toISOString().substr(0, 10);
        income.amount = null;
        income.currency = userCurrency;
        income.originalCurrency = null;
        income.originalAmount = null;
    }

    async function convertAmount() {
        let url;
        if (expense.amount !== null) {
            expense.originalAmount = expense.amount;
            expense.originalCurrency = expense.currency;
            url = `https://api.exchangeratesapi.io/${expense.date}?base=${userCurrency}&symbols=${expense.originalCurrency}`;
        } else {
            income.originalAmount = income.amount;
            income.originalCurrency = income.currency;
            url = `https://api.exchangeratesapi.io/${income.date}?base=${userCurrency}&symbols=${income.originalCurrency}`;
        }
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        if (expense.amount !== null) {
            expense.amount = Number(
                (expense.originalAmount / exchangeRate).toFixed(2)
            );
            expense.currency = userCurrency;
        } else {
            income.amount = Number(
                (income.originalAmount / exchangeRate).toFixed(2)
            );
            income.currency = userCurrency;
        }
    }

    // const calculateExpenses = () => {
    //     totalExpenses = [...totalExpenses, expense.amount];
    //     console.log(totalExpenses);
    //     expenseSum = totalExpenses.reduce(function (a, b) {
    //         return a + b;
    //     }, 0);
    // };
</script>

<div class="container">
    <header>
        <h1>Budget</h1>
        <!-- Form to add expenses-->
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
            <select id="expense-currency" bind:value={expense.currency}>
                <option value="USD">USD</option>
                <option value="CNY">CNY</option>
            </select>
            <button on:click|preventDefault={handleAddExpense}>Add</button>
        </form>

        <!-- Form to add incomes -->
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
            <select id="income-currency" bind:value={income.currency}>
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
    <h3>Total Expenses: {expenseSum}</h3>
    <h1>Incomes:</h1>
    {#each $incomes as income (income._id)}
        <Income {income} />
    {/each}
    <h3>Total Income:</h3>
    <h1>Remaining:</h1>

</div>
