<script>
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import { UserSettings } from '../../api/usersettings';
    export let expense;
    import { createEventDispatcher, onMount } from 'svelte';
    let dispatch = createEventDispatcher();
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { Expenses } from '../../api/expenses';

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let updatedExpense = {
        title: expense.title,
        date: expense.date,
        amount: expense.amount,
        category: expense.category,
        originalAmount: expense.originalAmount,
        currency: expense.currency,
        originalCurrency: expense.originalCurrency,
        _id: expense._id,
    };

    async function updateExpense() {
        // check whether expense needs to be converted;
        if (updatedExpense.currency !== $userCurrency) {
            await convertAmount();
        }

        // update the currency
        Meteor.call('expenses.update', expense._id, updatedExpense);
        dispatch('expenseEdited', updatedExpense);

        // collapse the update menu
        dispatch('collapse');
    }

    async function convertAmount() {
        updatedExpense.originalAmount = updatedExpense.amount;
        updatedExpense.originalCurrency = updatedExpense.currency;
        let url = `https://api.exchangeratesapi.io/${updatedExpense.date}?base=${$userCurrency}&symbols=${updatedExpense.originalCurrency}`;
        let response = await fetch(url);
        let data = await response.json();
        let rates = JSON.stringify(data.rates);
        let exchangeRate = Number(rates.replace(/[^\d.-]/g, ''));
        updatedExpense.amount = Number(
            (updatedExpense.originalAmount / exchangeRate).toFixed(2)
        );
        updatedExpense.currency = $userCurrency;
    }

    const exitUpdate = () => {
        dispatch('collapse');
    };

    onMount(() => {
        Meteor.subscribe('usersettings');
        Meteor.subscribe('budgets');
    });
</script>

<form class="update-expense" on:submit|preventDefault={updateExpense}>
    <input
        type="text"
        placeholder={updatedExpense.title}
        bind:value={updatedExpense.title} />
    <input type="date" bind:value={updatedExpense.date} />
    <input
        type="number"
        placeholder={updatedExpense.amount}
        bind:value={updatedExpense.amount} />
    <select id="category" bind:value={updatedExpense.category}>
        <option value={expense.category}>{expense.category}</option>
        {#each $budgets as budget (budget._id)}
            {#if budget.category !== expense.category}
                <option value={budget.category}>{budget.category}</option>
            {/if}
        {/each}
    </select>
    <select id="expense-currency" bind:value={updatedExpense.currency}>
        {#each $usersettings as usersetting (usersetting._id)}
            <option value={$userCurrency}>{$userCurrency}</option>
            {#each usersetting.currencyOptions as currencyOption}
                <option value={currencyOption}>{currencyOption}</option>
            {/each}
        {/each}
    </select>
    <button on:click|preventDefault={updateExpense}>Update</button>
    <button on:click|preventDefault={exitUpdate}>Exit</button>
</form>
