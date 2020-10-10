<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import { UserSettings } from '../../api/usersettings';
    export let monthlyexpense;
    import { createEventDispatcher, onMount } from 'svelte';
    let dispatch = createEventDispatcher();
    import { userCurrency } from '../stores/UserCurrencyStore';

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let updatedMonthlyExpense = {
        title: monthlyexpense.title,
        recurringdate: monthlyexpense.recurringdate,
        amount: monthlyexpense.amount,
        category: monthlyexpense.category,
        originalAmount: monthlyexpense.originalAmount,
        currency: monthlyexpense.currency,
        originalCurrency: monthlyexpense.originalCurrency,
        _id: monthlyexpense._id,
    };

    console.log(updatedMonthlyExpense);

    async function updateExpense() {
        // check whether expense needs to be converted;

        // update the currency
        Meteor.call(
            'monthlyexpenses.update',
            monthlyexpense._id,
            updatedMonthlyExpense
        );
        // dispatch('expenseEdited', updatedMonthlyExpense);

        // collapse the update menu
        dispatch('collapse');
    }

    // async function convertAmount() {
    //     if (updatedMonthlyExpense.originalAmount === null) {
    //         updatedMonthlyExpense.originalAmount = updatedMonthlyExpense.amount;
    //         updatedMonthlyExpense.originalCurrency =
    //             updatedMonthlyExpense.currency;
    //     }
    //     let url = `https://api.exchangeratesapi.io/${updatedMonthlyExpense.date}?base=${$userCurrency}&symbols=${updatedMonthlyExpense.originalCurrency}`;
    //     let response = await fetch(url);
    //     let data = await response.json();
    //     let rates = JSON.stringify(data.rates);
    //     let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
    //     updatedMonthlyExpense.amount = Number(
    //         (updatedMonthlyExpense.originalAmount / exchangeRate).toFixed(2)
    //     );
    //     console.log(updatedMonthlyExpense.amount);
    //     updatedMonthlyExpense.currency = $userCurrency;
    // }

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
        <label for="date">Monthly On The: </label>
        <input
            type="text"
            bind:value={updatedMonthlyExpense.recurringdate}
            placeholder={updatedMonthlyExpense.recurringdate} />
    </div>

    <div class="title">
        <label for="title">Expense: </label>
        <input
            type="text"
            placeholder={updatedMonthlyExpense.title}
            bind:value={updatedMonthlyExpense.title} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        {#if updatedMonthlyExpense.originalCurrency === null}
            <input
                type="number"
                placeholder={updatedMonthlyExpense.amount}
                bind:value={updatedMonthlyExpense.amount} />
        {:else}
            <input
                type="number"
                placeholder={updatedMonthlyExpense.originalAmount}
                bind:value={updatedMonthlyExpense.originalAmount} />
        {/if}
    </div>

    <div class="category">
        <label for="category">Category: </label>
        <select id="category" bind:value={updatedMonthlyExpense.category}>
            <option value={monthlyexpense.category}>
                {monthlyexpense.category}
            </option>
            {#each $budgets as budget (budget._id)}
                {#if budget.category !== monthlyexpense.category}
                    <option value={budget.category}>{budget.category}</option>
                {/if}
            {/each}
        </select>
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        <select
            id="expense-currency"
            bind:value={updatedMonthlyExpense.currency}>
            {#if updatedMonthlyExpense.originalCurrency == null}
                {#each $usersettings as usersetting (usersetting._id)}
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        <option value={currencyOption}>{currencyOption}</option>
                    {/each}
                {/each}
            {:else}
                {#each $usersettings as usersetting (usersetting._id)}
                    <option value={updatedMonthlyExpense.originalCurrency}>
                        {updatedMonthlyExpense.originalCurrency}
                    </option>
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        {#if currencyOption === updatedMonthlyExpense.originalCurrency}
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
