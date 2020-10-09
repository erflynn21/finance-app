<script>
    export let monthlyBudget;
    export let month;
    export let year;
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { onMount } from 'svelte';
    import { UserSettings } from '../../api/usersettings';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();
    import { userCurrency } from '../stores/UserCurrencyStore';

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let updatedMonthlyBudget = {
        month: monthlyBudget.month,
        year: monthlyBudget.year,
        category: monthlyBudget.category,
        budgetId: monthlyBudget.id,
        currency: monthlyBudget.currency,
        amount: monthlyBudget.amount,
        originalCurrency: monthlyBudget.originalCurrency,
    };

    const updateMonthlyBudget = () => {
        Meteor.call(
            'monthlybudgets.update',
            monthlyBudget.id,
            updatedMonthlyBudget
        );
        dispatch('updateBudgets');
        dispatch('collapse');
    };

    const exitUpdate = () => {
        dispatch('collapse');
    };

    onMount(() => {
        Meteor.subscribe('monthlybudgets');
    });
</script>

<div class="big-title">Edit {monthlyBudget.category} for {month}, {year}</div>
<div class="border" />
<form
    class="update-monthly-budget"
    on:submit|preventDefault={updateMonthlyBudget}>
    <div class="amount">
        <label for="amount">Amount: </label>
        <input
            type="number"
            placeholder={monthlyBudget.amount}
            bind:value={updatedMonthlyBudget.amount} />
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        <select id="budget-currency" bind:value={updatedMonthlyBudget.currency}>
            {#each $usersettings as usersetting (usersetting._id)}
                <option value={monthlyBudget.currency}>
                    {monthlyBudget.currency}
                </option>
                {#if monthlyBudget.currency !== $userCurrency}
                    <option value={usersetting.baseCurrency}>
                        {usersetting.baseCurrency}
                    </option>
                {/if}
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
            on:click|preventDefault={updateMonthlyBudget}>Update</button>
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
    .update-monthly-budget {
        width: 100%;
        background: white;
    }

    .update-monthly-budget div {
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
