<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { UserSettings } from '../../api/usersettings';
    import { userCurrency } from '../stores/UserCurrencyStore';

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let budget = {
        category: '',
        amount: '',
        currency: '',
        date: new Date().toISOString().substr(0, 10),
    };

    async function handleAddBudget() {
        // check whether budget needs to be converted to base currency
        if (budget.currency === '' || budget.currency === $userCurrency) {
            budget.currency = $userCurrency;
        } else {
            await convertAmount();
        }

        // add the budget
        Meteor.call('budgets.insert', budget);

        // clear form
        budget.category = '';
        budget.amount = '';
        budget.currency = $userCurrency;
    }

    async function convertAmount() {
        budget.originalAmount = budget.amount;
        budget.originalCurrency = budget.currency;
        let url = `https://api.exchangeratesapi.io/${budget.date}?base=${$userCurrency}&symbols=${budget.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        budget.amount = Number(
            (budget.originalAmount / exchangeRate).toFixed(2)
        );
        budget.currency = $userCurrency;
    }

    onMount(() => {
        Meteor.subscribe('usersettings');
    });
</script>

<form class="new-budget" on:submit|preventDefault={handleAddBudget}>
    <input
        type="text"
        placeholder="new budget...."
        bind:value={budget.category} />
    <input type="number" placeholder="amount" bind:value={budget.amount} />
    <select id="budget-currency" bind:value={budget.currency}>
        {#each $usersettings as usersetting (usersetting._id)}
            <option value={usersetting.baseCurrency}>
                {usersetting.baseCurrency}
            </option>
            {#each usersetting.currencyOptions as currencyOption}
                <option value={currencyOption}>{currencyOption}</option>
            {/each}
        {/each}
    </select>
    <button on:click|preventDefault={handleAddBudget}>Add</button>
</form>
