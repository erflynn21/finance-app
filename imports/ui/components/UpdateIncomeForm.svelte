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

<form class="update-income" on:submit|preventDefault={updatedIncome}>
    <input
        type="text"
        placeholder={income.title}
        bind:value={updatedIncome.title} />
    <input type="date" bind:value={updatedIncome.date} />
    <input
        type="number"
        placeholder={income.amount}
        bind:value={updatedIncome.amount} />
    <select id="income-currency" bind:value={updatedIncome.currency}>
        <option value={$userCurrency}>{$userCurrency}</option>
        {#each $usersettings as usersetting (usersetting._id)}
            {#each usersetting.currencyOptions as currencyOption}
                <option value={currencyOption}>{currencyOption}</option>
            {/each}
        {/each}
    </select>
    <button class="no" on:click|preventDefault={exitUpdate}>Exit</button>
    <button class="yes" on:click|preventDefault={updateIncome}>Update</button>
</form>

<style>
    button {
        width: 30%;
        justify-self: center;
        height: 35px;
        grid-column: 1/3;
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
