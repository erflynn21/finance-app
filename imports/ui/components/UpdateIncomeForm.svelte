<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { onMount } from 'svelte';
    import { Budgets } from '../../api/budgets';
    import { UserSettings } from '../../api/usersettings';
    export let income;
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    $: userCurrency = '';

    const setUserCurrency = (usersetting) => {
        if (usersetting === undefined) {
            return;
        } else {
            userCurrency = usersetting.baseCurrency;
        }
    };

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
        // check whether expense needs to be converted;
        if (updatedIncome.currency !== userCurrency) {
            await convertAmount();
        }

        // update the currency
        Meteor.call('incomes.update', income._id, updatedIncome);

        // collapse the update menu
        dispatch('collapse');
    }

    async function convertAmount() {
        updatedIncome.originalAmount = updatedIncome.amount;
        updatedIncome.originalCurrency = updatedIncome.currency;
        let url = `https://api.exchangeratesapi.io/${updatedIncome.date}?base=${userCurrency}&symbols=${updatedIncome.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        updatedIncome.amount = Number(
            (updatedIncome.originalAmount / exchangeRate).toFixed(2)
        );
        updatedIncome.currency = userCurrency;
    }

    onMount(() => {
        Meteor.subscribe('usersettings');
        setUserCurrency();
    });
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
    <select id="category" bind:value={updatedIncome.category}>
        {#each $budgets as budget (budget._id)}
            <option value={budget.category}>{budget.category}</option>
        {/each}
    </select>
    <select id="income-currency" bind:value={updatedIncome.currency}>
        {#each $usersettings as usersetting (usersetting._id)}
            <option value={income.currency}>{income.currency}</option>
            {#if income.currency !== userCurrency}
                <option value={usersetting.baseCurrency}>
                    {usersetting.baseCurrency}
                </option>
            {/if}
            {#each usersetting.currencyOptions as currencyOption}
                <option value={currencyOption}>{currencyOption}</option>
            {/each}
        {/each}
        {#each $usersettings.map(setUserCurrency) as usersetting}
            <div />
        {/each}

    </select>
    <button on:click|preventDefault={updateIncome}>Edit</button>
</form>
