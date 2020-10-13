<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import { UserSettings } from '../../api/usersettings';
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let recurring = false;

    let expense = {
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().substr(0, 10),
        currency: '',
        originalAmount: null,
        originalCurrency: null,
    };

    let error = '';

    async function handleAddExpense() {
        if (expense.title === '' || expense.amount === null) {
            error = `Please fill in all fields before submitting an expense`;
            return;
        } else {
            error = '';
        }

        // check whether expense needs to be converted to base currency
        if (
            expense.currency === '' ||
            expense.currency[0] === $userCurrency[0]
        ) {
            expense.currency = $userCurrency;
        } else {
            await convertAmount();
        }

        // add the expense
        Meteor.call('expenses.insert', expense);

        // clear form
        expense.title = '';
        expense.date = new Date().toISOString().substr(0, 10);
        expense.category = '';
        expense.amount = '';
        expense.currency = $userCurrency;
        expense.originalCurrency = null;
        expense.originalAmount = null;

        dispatch('collapse');
        dispatch('recalculateExpenses');
    }

    async function handleAddMonthlyExpense() {
        if (expense.title === '' || expense.amount === null) {
            error = `Please fill in all fields before submitting an expense`;
            return;
        } else {
            error = '';
        }
        // check whether expense needs to be converted to base currency
        if (
            expense.currency === '' ||
            expense.currency[0] === $userCurrency[0]
        ) {
            expense.currency = $userCurrency;
        } else {
            expense.originalAmount = expense.amount;
            expense.originalCurrency = expense.currency;
            expense.currency = null;
            expense.amount = null;
        }

        expense.recurringdate = expense.date.slice(-2);

        // add the expense
        Meteor.call('monthlyexpenses.insert', expense);

        // clear form
        expense.title = '';
        expense.date = new Date().toISOString().substr(0, 10);
        expense.category = '';
        expense.amount = '';
        expense.currency = $userCurrency;
        expense.originalCurrency = null;
        expense.originalAmount = null;

        dispatch('collapse');
    }

    async function convertAmount() {
        expense.originalAmount = expense.amount;
        expense.originalCurrency = expense.currency;
        let url = `https://api.exchangeratesapi.io/${expense.date}?base=${$userCurrency}&symbols=${expense.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        expense.amount = Number(
            (expense.originalAmount / exchangeRate).toFixed(2)
        );
        expense.currency = $userCurrency;
    }

    onMount(() => {
        Meteor.subscribe('usersettings');
    });
</script>

<form class="new-expense" on:submit|preventDefault={handleAddExpense}>
    <div class="date">
        <label for="date">Date: </label>
        <input type="date" name="date" bind:value={expense.date} />
    </div>

    <div class="title">
        <label for="title">Expense: </label>
        <input type="text" placeholder="Name" bind:value={expense.title} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        <input type="number" placeholder="0.00" bind:value={expense.amount} />
    </div>

    <div class="category">
        <label for="category">Category: </label>
        <select id="category" bind:value={expense.category}>
            <option disabled selected value>-- select a category --</option>
            {#each $budgets as budget (budget._id)}
                <option value={budget.category}>{budget.category}</option>
            {/each}
        </select>
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        <select id="expense-currency" bind:value={expense.currency}>
            {#each $usersettings as usersetting (usersetting._id)}
                <option value={usersetting.baseCurrency}>
                    {usersetting.baseCurrency}
                </option>
                {#each usersetting.currencyOptions as currencyOption}
                    <option value={currencyOption}>{currencyOption}</option>
                {/each}
            {/each}
        </select>
    </div>

    <span class="recurring">
        <input type="checkbox" bind:value={recurring} />
        <label for="recurring">This is a monthly recurring expense.</label>
    </span>

    <span class="error">
        <p>{error}</p>
    </span>

    {#if recurring === false}
        <div>
            <button on:click|preventDefault={handleAddExpense}>Add</button>
        </div>
    {:else}
        <div>
            <button
                on:click|preventDefault={handleAddMonthlyExpense}>Add</button>
        </div>
    {/if}
</form>

<style>
    .new-expense {
        width: 100%;
        background: white;
    }

    .new-expense div {
        margin: 15px 0;
        display: grid;
        grid-template-columns: 0.5fr 1fr;
    }

    input {
        border: none;
        background: transparent;
    }

    select {
        background: transparent;
    }

    input:active {
        border: none;
    }

    .date input {
        width: 65%;
    }

    .title input {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 5px;
    }

    .amount input {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 5px;
    }

    .category select {
        width: 80%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .currency select {
        width: 30%;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .currency {
        padding-bottom: 15px;
    }

    button {
        width: 60%;
        justify-self: center;
        height: 35px;
        grid-column: 1/3;
        border-radius: 10px;
        cursor: pointer;
        border: 0;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
        background: green;
        color: white;
    }
</style>
