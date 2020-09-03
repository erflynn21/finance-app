<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { UserSettings } from '../../api/usersettings';
    import { BlazeTemplate } from 'meteor/svelte:blaze-integration';
    import CurrenciesList from '../shared/CurrenciesList.svelte';
    import BudgetList from './BudgetList.svelte';
    import AddBudgetForm from './AddBudgetForm.svelte';

    $: usersettings = useTracker(() => UserSettings.find({}).fetch());

    let usersetting = {
        firstName: '',
        lastName: '',
        baseCurrency: '',
        currencyOptions: '',
    };

    $: updateduserinfo = {};

    const parseUserInfo = (userinfo) => {
        updateduserinfo = {
            firstName: userinfo.firstName,
            lastName: userinfo.lastName,
            baseCurrency: userinfo.baseCurrency,
            currencyOptions: userinfo.currencyOptions,
            owner: userinfo.owner,
            id: userinfo._id,
        };
    };

    async function updateUserSettings() {
        // check if user already has settings in database
        if (updateduserinfo.owner) {
            // if yes, update settings
            Meteor.call('usersettings.update', usersetting, updateduserinfo.id);
        } else {
            // if no, add settings
            Meteor.call('usersettings.insert', usersetting);
        }
    }

    $: budgetSum = 0;
    const recalculateBudgets = (totalBudgets) => {
        budgets = totalBudgets.detail.data;
        budgetSum = budgets.reduce(function (a, b) {
            return a + b;
        }, 0);
    };

    onMount(() => {
        Meteor.subscribe('usersettings');
    });
</script>

<div>
    <BlazeTemplate template="loginButtons" />
</div>

<form class="user-settings" on:submit|preventDefault={updateUserSettings}>
    <input
        type="text"
        placeholder="first name"
        bind:value={usersetting.firstName} />
    <input
        type="text"
        placeholder="last name"
        bind:value={usersetting.lastName} />
    <label for="base-currency">Base Currency:</label>
    <select id="base-currency" bind:value={usersetting.baseCurrency}>
        <CurrenciesList />
    </select>
    <label for="currency-options">Currency Options:</label>
    <select
        id="currency-options"
        bind:value={usersetting.currencyOptions}
        multiple>
        <CurrenciesList />
    </select>
    <button on:click|preventDefault={updateUserSettings}>
        Update User Settings
    </button>
    {#each $usersettings.map(parseUserInfo) as userinfo}
        <div />
    {/each}
    <div>First Name: {updateduserinfo.firstName}</div>
    <div>Last Name: {updateduserinfo.lastName}</div>
    <div>Base Currency: {updateduserinfo.baseCurrency}</div>
    <div>Currency Options: {updateduserinfo.currencyOptions}</div>

    <!-- List of base budgets -->
    <BudgetList on:recalculateBudgets={recalculateBudgets} />
    <h3>Total Budgeted: {budgetSum}.</h3>

    <!-- Form to add budgets -->
    <h3>Add in a base budget:</h3>
    <AddBudgetForm />
</form>
