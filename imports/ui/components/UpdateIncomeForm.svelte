<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import { UserSettings } from '../../api/usersettings';
    export let income;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();
    import { userCurrency } from '../stores/UserCurrencyStore';

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let updatedIncome = {
        title: income.title,
        date: income.date,
        amount: income.amount,
        category: income.category,
        originalAmount: income.originalAmount,
        currency: income.currency,
        originalCurrency: income.originalCurrency,
    };

    async function updateIncome() {
        // check whether income needs to be converted;
        if (updatedIncome.currency !== $userCurrency) {
            await convertAmount();
        }

        // update the currency
        Meteor.call('incomes.update', income._id, updatedIncome);
        dispatch('incomeEdited', updatedIncome);

        // collapse the update menu
        dispatch('collapse');
    }

    async function convertAmount() {
        updatedIncome.originalAmount = updatedIncome.amount;
        updatedIncome.originalCurrency = updatedIncome.currency;
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
            placeholder={income.title}
            bind:value={updatedIncome.title} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        <input
            type="number"
            placeholder={income.amount}
            bind:value={updatedIncome.amount} />
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        <select id="income-currency" bind:value={updatedIncome.currency}>
            <option value={$userCurrency}>{$userCurrency}</option>
            {#each $usersettings as usersetting (usersetting._id)}
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
            on:click|preventDefault={updateIncome}>Update</button>
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
