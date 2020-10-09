<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import { UserSettings } from '../../api/usersettings';
    export let expense;
    import { createEventDispatcher, onMount } from 'svelte';
    let dispatch = createEventDispatcher();
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { Expenses } from '../../api/expenses';
    import EditPopUp from '../shared/EditPopUp.svelte';

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let updatedExpense = {
        title: expense.title,
        date: expense.date,
        amount: expense.amount,
        category: expense.category,
        originalAmount: expense.originalAmount,
        currency: expense.currency,
        originalCurrency: expense.originalCurrency,
        _id: expense._id,
    };

    async function updateExpense() {
        // check whether expense needs to be converted;
        if (updatedExpense.currency !== $userCurrency) {
            await convertAmount();
        }

        // update the currency
        Meteor.call('expenses.update', expense._id, updatedExpense);
        dispatch('expenseEdited', updatedExpense);

        // collapse the update menu
        dispatch('collapse');
    }

    async function convertAmount() {
        updatedExpense.originalAmount = updatedExpense.amount;
        updatedExpense.originalCurrency = updatedExpense.currency;
        let url = `https://api.exchangeratesapi.io/${updatedExpense.date}?base=${$userCurrency}&symbols=${updatedExpense.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        updatedExpense.amount = Number(
            (updatedExpense.originalAmount / exchangeRate).toFixed(2)
        );
        updatedExpense.currency = $userCurrency;
    }

    const exitUpdate = () => {
        dispatch('collapse');
    };

    onMount(() => {
        Meteor.subscribe('usersettings');
        Meteor.subscribe('budgets');
    });
</script>

<div class="big-title">Edit Expense</div>
<div class="border" />
<form class="update-expense" on:submit|preventDefault={updateExpense}>
    <div class="date">
        <label for="date">Date: </label>
        <input type="date" bind:value={updatedExpense.date} />
    </div>

    <div class="title">
        <label for="title">Expense: </label>
        <input
            type="text"
            placeholder={updatedExpense.title}
            bind:value={updatedExpense.title} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        <input
            type="number"
            placeholder={updatedExpense.amount}
            bind:value={updatedExpense.amount} />
    </div>

    <div class="category">
        <label for="category">Category: </label>
        <select id="category" bind:value={updatedExpense.category}>
            <option value={expense.category}>{expense.category}</option>
            {#each $budgets as budget (budget._id)}
                {#if budget.category !== expense.category}
                    <option value={budget.category}>{budget.category}</option>
                {/if}
            {/each}
        </select>
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        <select id="expense-currency" bind:value={updatedExpense.currency}>
            {#each $usersettings as usersetting (usersetting._id)}
                <option value={$userCurrency}>{$userCurrency}</option>
                {#each usersetting.currencyOptions as currencyOption}
                    <option value={currencyOption}>{currencyOption}</option>
                {/each}
            {/each}
        </select>
    </div>
    <span class="buttons">
        <button class="no" on:click|preventDefault={exitUpdate}>Exit</button>
        <button
            class="yes"
            on:click|preventDefault={updateExpense}>Update</button>
    </span>
</form>

<style>
    .big-title {
        text-align: center;
        margin-bottom: 10px;
        width: 100%;
        /* margin: 0 15px; */
        font-size: 18px;
    }

    .border {
        border: 1px solid #f2f2f2;
    }
    .update-expense {
        width: 100%;
        background: white;
    }

    .update-expense div {
        margin: 15px 0 10px 0;
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

    .buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    button {
        width: 80%;
        height: 35px;
        border-radius: 10px;
        cursor: pointer;
        border: 0;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
        color: white;
        margin: 10px;
    }

    .yes {
        background: green;
    }

    .no {
        background: red;
    }
</style>
