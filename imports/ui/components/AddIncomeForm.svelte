<script>
    import { Meteor } from 'meteor/meteor';
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { createEventDispatcher } from 'svelte';
    import { userSettingsStore } from '../stores/UserSettingsStore';
    let dispatch = createEventDispatcher();

    let recurring = false;

    let income = {
        title: '',
        amount: null,
        date: new Date().toISOString().substr(0, 10),
        currency: '',
        originalAmount: null,
        originalCurrency: null,
    };

    let error = '';

    async function handleAddIncome() {
        if (income.title === '' || income.amount === null) {
            error = `Please fill in all fields before submitting an income.`;
            return;
        } else {
            error = '';
        }

        // check whether expense needs to be converted to base currency
        if (income.currency === '' || income.currency[0] === $userCurrency[0]) {
            income.currency = $userCurrency;
        } else {
            await convertAmount();
        }

        // add the income
        Meteor.call('incomes.insert', income);

        // clear form
        income.title = '';
        income.date = new Date().toISOString().substr(0, 10);
        income.amount = null;
        income.currency = $userCurrency;
        income.originalCurrency = null;
        income.originalAmount = null;

        dispatch('collapse');
    }

    async function handleAddMonthlyIncome() {
        if (income.title === '' || income.amount === null) {
            error = `Please fill in all fields before submitting an expense`;
            return;
        } else {
            error = '';
        }
        // check whether expense needs to be converted to base currency
        if (income.currency === '' || income.currency[0] === $userCurrency[0]) {
            income.currency = $userCurrency;
        } else {
            income.originalAmount = income.amount;
            income.originalCurrency = income.currency;
            income.currency = null;
            income.amount = null;
        }

        income.recurringdate = income.date.slice(-2);

        // add the expense
        Meteor.call('monthlyincomes.insert', income);

        // clear form
        income.title = '';
        income.date = new Date().toISOString().substr(0, 10);
        income.category = '';
        income.amount = '';
        income.currency = $userCurrency;
        income.originalCurrency = null;
        income.originalAmount = null;

        dispatch('collapse');
    }

    async function convertAmount() {
        income.originalAmount = income.amount;
        income.originalCurrency = income.currency;
        let url = `https://api.exchangeratesapi.io/${income.date}?base=${$userCurrency}&symbols=${income.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        income.amount = Number(
            (income.originalAmount / exchangeRate).toFixed(2)
        );
        income.currency = $userCurrency;
    }
</script>

<form class="new-income" on:submit|preventDefault={handleAddIncome}>
    <div class="date">
        <label for="date">Date: </label>
        <input type="date" id="today" bind:value={income.date} />
    </div>

    <div class="title">
        <label for="title">Income: </label>
        <input type="text" placeholder="Name" bind:value={income.title} />
    </div>

    <div class="amount">
        <label for="amount">Amount: </label>
        <input type="number" placeholder="0.00" bind:value={income.amount} />
    </div>

    <div class="currency">
        <label for="currency">Currency: </label>
        <select id="income-currency" bind:value={income.currency}>
            {#each $userSettingsStore as usersetting (usersetting._id)}
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

    <div class="recurring" />
    {#if recurring === false}
        <div>
            <button on:click|preventDefault={handleAddIncome}>Add</button>
        </div>
    {:else}
        <div>
            <button
                on:click|preventDefault={handleAddMonthlyIncome}>Add</button>
        </div>
    {/if}
</form>

<style>
    .new-income {
        width: 100%;
        background: white;
    }

    .new-income div {
        margin: 15px 0;
        display: grid;
        grid-template-columns: 0.5fr 1fr;
    }

    input {
        border: none;
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
