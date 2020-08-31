<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { onMount } from 'svelte';
    import { Budgets } from '../../api/budgets';
    import { UserSettings } from '../../api/usersettings';
    export let expense;
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

    let updatedExpense = {
        title: expense.title,
        date: expense.date,
        amount: expense.amount,
        category: expense.category,
        originalAmount: expense.originalAmount,
        currency: expense.currency,
        originalCurrency: expense.originalCurrency,
    };

    async function updateExpense() {
        // check whether expense needs to be converted;
        if (updatedExpense.currency !== userCurrency) {
            await convertAmount();
        }

        // update the currency
        Meteor.call('expenses.update', expense._id, updatedExpense);

        // collapse the update menu
        dispatch('collapse');
    }

    async function convertAmount() {
        updatedExpense.originalAmount = updatedExpense.amount;
        updatedExpense.originalCurrency = updatedExpense.currency;
        let url = `https://api.exchangeratesapi.io/${updatedExpense.date}?base=${userCurrency}&symbols=${updatedExpense.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        updatedExpense.amount = Number(
            (updatedExpense.originalAmount / exchangeRate).toFixed(2)
        );
        updatedExpense.currency = userCurrency;
    }

    onMount(() => {
        Meteor.subscribe('usersettings');
        setUserCurrency();
    });
</script>

<form class="update-expense" on:submit|preventDefault={updateExpense}>
    <input
        type="text"
        placeholder={expense.title}
        bind:value={updatedExpense.title} />
    <input type="date" bind:value={updatedExpense.date} />
    <input
        type="number"
        placeholder={expense.amount}
        bind:value={updatedExpense.amount} />
    <select id="category" bind:value={updatedExpense.category}>
        {#each $budgets as budget (budget._id)}
            <option value={budget.category}>{budget.category}</option>
        {/each}
    </select>
    <select id="expense-currency" bind:value={updatedExpense.currency}>
        {#each $usersettings as usersetting (usersetting._id)}
            <option value={expense.currency}>{expense.currency}</option>
            {#if expense.currency !== userCurrency}
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
    <button on:click|preventDefault={updateExpense}>Edit</button>
</form>
