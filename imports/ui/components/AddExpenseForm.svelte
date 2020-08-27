<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Expenses } from '../../api/expenses';
    import { Budgets } from '../../api/budgets';

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    let userCurrency = 'CNY';

    let expense = {
        title: '',
        amount: null,
        category: '',
        date: new Date().toISOString().substr(0, 10),
        currency: userCurrency,
        originalAmount: null,
        originalCurrency: null,
    };

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
            category: expense.category,
            originalAmount: expense.originalAmount,
            currency: expense.currency,
            originalCurrency: expense.originalCurrency,
        });

        // clear form
        expense.title = '';
        expense.date = new Date().toISOString().substr(0, 10);
        expense.amount = '';
        (expense.category = ''), (expense.currency = userCurrency);
        expense.originalCurrency = null;
        expense.originalAmount = null;
    }

    async function convertAmount() {
        expense.originalAmount = expense.amount;
        expense.originalCurrency = expense.currency;
        let url = `https://api.exchangeratesapi.io/${expense.date}?base=${userCurrency}&symbols=${expense.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        expense.amount = Number(
            (expense.originalAmount / exchangeRate).toFixed(2)
        );
        expense.currency = userCurrency;
    }
</script>

<form class="new-expense" on:submit|preventDefault={handleAddExpense}>
    <input
        type="text"
        placeholder="new expense..."
        bind:value={expense.title} />
    <input type="date" id="today" bind:value={expense.date} />
    <input type="number" placeholder="amount" bind:value={expense.amount} />
    <select id="category" bind:value={expense.category}>
        <option disabled selected value>-- select a category --</option>
        {#each $budgets as budget (budget._id)}
            <option value={budget.category}>{budget.category}</option>
        {/each}
        <!-- <option value="Rent">Rent</option>
        <option value="Groceries">Groceries</option>
        <option value="Utilities">Utilities</option> -->
    </select>
    <select id="expense-currency" bind:value={expense.currency}>
        <option value="USD">USD</option>
        <option value="CNY">CNY</option>
    </select>
    <button on:click|preventDefault={handleAddExpense}>Add</button>
</form>
