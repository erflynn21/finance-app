<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { UserSettings } from '../../api/usersettings';
    import { userCurrency } from '../stores/UserCurrencyStore';
    export let budget;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let updatedBudget = {
        amount: budget.amount,
        category: budget.category,
        currency: budget.currency,
        date: new Date().toISOString().substr(0, 10),
    };

    async function updateBudget() {
        // check whether budget needs to be converted;
        if (updatedBudget.currency !== $userCurrency) {
            await convertAmount();
        }

        // update the currency
        Meteor.call('budgets.update', budget._id, updatedBudget);

        // collapse the update menu
        dispatch('collapse');
    }

    async function convertAmount() {
        updatedBudget.originalAmount = updatedBudget.amount;
        updatedBudget.originalCurrency = updatedBudget.currency;
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
</script>

<form class="update-budget" on:submit|preventDefault={updateBudget}>
    <input
        type="text"
        placeholder={budget.category}
        bind:value={updatedBudget.category} />
    <input
        type="number"
        placeholder={budget.amount}
        bind:value={updatedBudget.amount} />
    <select id="budget-currency" bind:value={updatedBudget.currency}>
        <option value={$userCurrency} />
        {#each $usersettings as usersetting (usersetting._id)}
            {#each usersetting.currencyOptions as currencyOption}
                <option value={currencyOption}>{currencyOption}</option>
            {/each}
        {/each}
    </select>
    <!-- <select id="budget-currency" bind:value={budget.currency}>
        {#each $usersettings as usersetting (usersetting._id)}
            <option value={usersetting.baseCurrency}>
                {usersetting.baseCurrency}
            </option>
            {#each usersetting.currencyOptions as currencyOption}
                <option value={currencyOption}>{currencyOption}</option>
            {/each}
        {/each}
    </select> -->
    <button on:click|preventDefault={updateBudget}>Edit</button>
</form>
