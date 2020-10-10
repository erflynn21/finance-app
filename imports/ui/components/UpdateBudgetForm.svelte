<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { UserSettings } from '../../api/usersettings';
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { onMount } from 'svelte';
    export let budget;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let updatedBudget = {
        amount: budget.amount,
        category: budget.category,
        currency: budget.currency,
        originalAmount: budget.originalAmount,
        originalCurrency: budget.originalCurrency,
        date: new Date().toISOString().substr(0, 10),
    };

    async function updateBudget() {
        // check whether budget needs to be converted;
        if (updatedBudget.originalCurrency !== null) {
            await convertAmount();
        }

        // update the currency
        Meteor.call('budgets.update', budget._id, updatedBudget);

        // collapse the update menu
        dispatch('collapse');
        dispatch('recalculateBudgets');
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

    onMount(() => {
        Meteor.subscribe('monthlybudgets');
    });
</script>

<div class="big-title">Edit Expense</div>
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
        <select id="budget-currency" bind:value={updatedBudget.currency}>
            {#if updatedBudget.originalCurrency === null}
                {#each $usersettings as usersetting (usersetting._id)}
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        <option value={currencyOption}>{currencyOption}</option>
                    {/each}
                {/each}
            {:else}
                {#each $usersettings as usersetting (usersetting._id)}
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
            {/if}
        </select>
    </div>

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
