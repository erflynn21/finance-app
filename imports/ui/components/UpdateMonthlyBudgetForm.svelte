<script>
    export let monthlyBudget;
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { onMount } from 'svelte';
    import { UserSettings } from '../../api/usersettings';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();
    import { userCurrency } from '../stores/UserCurrencyStore';

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let updatedMonthlyBudget = {
        month: monthlyBudget.month,
        year: monthlyBudget.year,
        category: monthlyBudget.category,
        budgetId: monthlyBudget.id,
        currency: monthlyBudget.currency,
        amount: monthlyBudget.amount,
    };

    const updateMonthlyBudget = () => {
        Meteor.call(
            'monthlybudgets.update',
            monthlyBudget.id,
            updatedMonthlyBudget
        );
        dispatch('updateBudgets');
        dispatch('collapse');
    };

    onMount(() => {
        Meteor.subscribe('monthlybudgets');
    });
</script>

<form
    class="update-monthly-budget"
    on:submit|preventDefault={updateMonthlyBudget}>
    <input
        type="number"
        placeholder={monthlyBudget.amount}
        bind:value={updatedMonthlyBudget.amount} />
    <select id="budget-currency" bind:value={updatedMonthlyBudget.currency}>
        {#each $usersettings as usersetting (usersetting._id)}
            <option value={monthlyBudget.currency}>
                {monthlyBudget.currency}
            </option>
            {#if monthlyBudget.currency !== $userCurrency}
                <option value={usersetting.baseCurrency}>
                    {usersetting.baseCurrency}
                </option>
            {/if}
            {#each usersetting.currencyOptions as currencyOption}
                <option value={currencyOption}>{currencyOption}</option>
            {/each}
        {/each}
    </select>
    <button on:click|preventDefault={updateMonthlyBudget}>Edit</button>
</form>
