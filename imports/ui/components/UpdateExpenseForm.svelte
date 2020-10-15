<script>
    export let expense;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();
    import {
        userCurrency,
        baseBudgetsStore,
        userSettingsStore,
    } from '../stores/stores';

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

    let error = '';

    async function updateExpense() {
        if (updatedExpense.title === '' || updatedExpense.amount === null) {
            error = `Please fill in all fields before updating this income.`;
            return;
        } else {
            error = '';
        }
        // check whether expense needs to be converted;
        if (updatedExpense.originalCurrency !== null) {
            await convertAmount();
        }

        // update the currency
        Meteor.call('expenses.update', expense._id, updatedExpense);

        // collapse the update menu
        dispatch('collapse');
    }

    async function convertAmount() {
        if (updatedExpense.originalAmount === null) {
            updatedExpense.originalAmount = updatedExpense.amount;
            updatedExpense.originalCurrency = updatedExpense.currency;
        }
        let url = `https://api.exchangeratesapi.io/${updatedExpense.date}?base=${$userCurrency}&symbols=${updatedExpense.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        updatedExpense.amount = Number(
            (updatedExpense.originalAmount / exchangeRate).toFixed(2)
        );
        console.log(updatedExpense.amount);
        updatedExpense.currency = $userCurrency;
    }

    const exitUpdate = () => {
        dispatch('collapse');
    };
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
        {#if updatedExpense.originalCurrency === null}
            <input
                type="number"
                placeholder={updatedExpense.amount}
                bind:value={updatedExpense.amount} />
        {:else}
            <input
                type="number"
                placeholder={updatedExpense.originalAmount}
                bind:value={updatedExpense.originalAmount} />
        {/if}
    </div>

    <div class="category">
        <label for="category">Category: </label>
        <select id="category" bind:value={updatedExpense.category}>
            <option value={expense.category}>{expense.category}</option>
            {#each $baseBudgetsStore as budget (budget._id)}
                {#if budget.category !== updatedExpense.category}
                    <option value={budget.category}>{budget.category}</option>
                {/if}
            {/each}
        </select>
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        {#if updatedExpense.originalCurrency === null}
            <select id="expense-currency" bind:value={updatedExpense.currency}>
                {#each $userSettingsStore as usersetting (usersetting._id)}
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        <option value={currencyOption}>{currencyOption}</option>
                    {/each}
                {/each}
            </select>
        {:else}
            <select
                id="expense-currency"
                bind:value={updatedExpense.originalCurrency}>
                {#each $userSettingsStore as usersetting (usersetting._id)}
                    <option value={updatedExpense.originalCurrency}>
                        {updatedExpense.originalCurrency}
                    </option>
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        {#if currencyOption === updatedExpense.originalCurrency}
                            <div />
                        {:else}
                            <option value={currencyOption}>
                                {currencyOption}
                            </option>
                        {/if}
                    {/each}
                {/each}
            </select>
        {/if}
    </div>

    <span class="error">
        <p>{error}</p>
    </span>

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
