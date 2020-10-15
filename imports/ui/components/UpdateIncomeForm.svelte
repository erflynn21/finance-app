<script>
    export let income;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { userSettingsStore } from '../stores/UserSettingsStore';

    let updatedIncome = {
        title: income.title,
        date: income.date,
        amount: income.amount,
        originalAmount: income.originalAmount,
        currency: income.currency,
        originalCurrency: income.originalCurrency,
    };

    console.log(income);

    let error = '';

    async function updateIncome() {
        if (updatedIncome.title === '' || updatedIncome.amount === null) {
            error = `Please fill in all fields before updating this income.`;
            return;
        } else {
            error = '';
        }

        // check whether income needs to be converted;
        if (updatedIncome.originalCurrency !== null) {
            await convertAmount();
        }

        // update the income
        Meteor.call('incomes.update', income._id, updatedIncome);

        // collapse the update menu
        dispatch('collapse');
    }

    async function convertAmount() {
        if (updateIncome.originalAmount === null) {
            updatedIncome.originalAmount = updatedIncome.amount;
            updatedIncome.originalCurrency = updatedIncome.currency;
        }
        let url = `https://api.exchangeratesapi.io/${updatedIncome.date}?base=${$userCurrency}&symbols=${updatedIncome.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        updatedIncome.amount = Number(
            (updatedIncome.originalAmount / exchangeRate).toFixed(2)
        );
        updatedIncome.currency = $userCurrency;
    }

    const exitUpdate = () => {
        dispatch('collapse');
    };
</script>

<div class="big-title">Edit Income</div>
<div class="border" />
<form class="update-income" on:submit|preventDefault={updatedIncome}>
    <div class="date">
        <label for="date">Date: </label>
        <input type="date" bind:value={updatedIncome.date} />
    </div>

    <div class="title">
        <label for="title">Expense: </label>
        <input
            type="text"
            placeholder={updatedIncome.title}
            bind:value={updatedIncome.title} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        {#if updatedIncome.originalCurrency === null}
            <input
                type="number"
                placeholder={updatedIncome.amount}
                bind:value={updatedIncome.amount} />
        {:else}
            <input
                type="number"
                placeholder={updatedIncome.originalAmount}
                bind:value={updatedIncome.originalAmount} />
        {/if}
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        {#if updatedIncome.originalCurrency === null}
            <select id="income-currency" bind:value={updatedIncome.currency}>
                {#each $userSettingsStore as usersetting (usersetting._id)}
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        <option value={currencyOption}>{currencyOption}</option>
                    {/each}
                {/each}
            </select>
        {:else}
            <select
                id="income-currency"
                bind:value={updatedIncome.originalCurrency}>
                {#each $userSettingsStore as usersetting (usersetting._id)}
                    <option value={updatedIncome.originalCurrency}>
                        {updatedIncome.originalCurrency}
                    </option>
                    <option value={$userCurrency}>{$userCurrency}</option>
                    {#each usersetting.currencyOptions as currencyOption}
                        {#if currencyOption === updatedIncome.originalCurrency}
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
            on:click|preventDefault={updateIncome}>Update</button>
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
    .update-income {
        width: 100%;
        background: white;
    }

    .update-income div {
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
