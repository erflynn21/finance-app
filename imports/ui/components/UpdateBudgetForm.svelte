<script>
    import { userCurrency, userSettingsStore } from '../stores/stores';
    export let budget;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    let updatedBudget = {
        amount: budget.amount,
        category: budget.category,
        currency: budget.currency,
        originalAmount: budget.originalAmount,
        originalCurrency: budget.originalCurrency,
        date: new Date().toISOString().substr(0, 10),
    };

    let error = '';

    async function updateBudget() {
        if (updatedBudget.category === '' || updatedBudget.amount === null) {
            error = `Please fill in all fields before updating this income.`;
            return;
        } else {
            error = '';
        }

        // check whether budget needs to be converted;
        if (updatedBudget.originalCurrency !== null) {
            await convertAmount();
        }

        // update the currency
        Meteor.call('budgets.update', budget._id, updatedBudget);

        // collapse the update menu
        dispatch('collapse');
    }

    async function convertAmount() {
        if (updatedBudget.originalAmount === null) {
            updatedBudget.originalAmount = updatedBudget.amount;
            updatedBudget.originalCurrency = updatedBudget.currency;
        }
        let url = `https://api.exchangeratesapi.io/${updatedBudget.date}?base=${$userCurrency}&symbols=${updatedBudget.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        updatedBudget.amount = Number(
            (updatedBudget.originalAmount / exchangeRate).toFixed(2)
        );
        updatedBudget.currency = $userCurrency;
    }

    const exitUpdate = () => {
        dispatch('collapse');
    };
</script>

<div class="big-title">Edit {budget.category} Budget Category</div>
<div class="border" />
<form class="update-budget" on:submit|preventDefault={updateBudget}>
    <div class="title">
        <label for="title">Budget Category: </label>
        <input
            type="text"
            placeholder={updatedBudget.category}
            bind:value={updatedBudget.category} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        {#if updatedBudget.originalAmount === null}
            <input
                type="number"
                placeholder={updatedBudget.amount}
                bind:value={updatedBudget.amount} />
        {:else}
            <input
                type="number"
                placeholder={updatedBudget.originalAmount}
                bind:value={updatedBudget.originalAmount} />
        {/if}
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        {#if updatedBudget.originalCurrency === null}
            <select id="expense-currency" bind:value={updatedBudget.currency}>
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
                bind:value={updatedBudget.originalCurrency}>
                {#each $userSettingsStore as usersetting (usersetting._id)}
                    <option value={updatedBudget.originalCurrency}>
                        {updatedBudget.originalCurrency}
                    </option>
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        {#if currencyOption === updatedBudget.originalCurrency}
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
            on:click|preventDefault={updateBudget}>Update</button>
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
    .update-budget {
        width: 100%;
        background: white;
    }

    .update-budget div {
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

    .title input {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 5px;
    }

    .amount input {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 5px;
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
