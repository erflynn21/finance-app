<script>
    import { Meteor } from 'meteor/meteor';
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { UserSettings } from '../../api/usersettings';
    import { BlazeTemplate } from 'meteor/svelte:blaze-integration';
    import { Budgets } from '../../api/budgets';
    import { baseBudgetSumStore } from '../stores/BaseBudgetSumStore';
    import CurrenciesList from '../shared/CurrenciesList.svelte';
    import BudgetList from './BudgetList.svelte';
    import AddBudgetForm from './AddBudgetForm.svelte';
    import Heading from '../shared/Heading.svelte';

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

    const updateUserSettings = () => {
        // check if user already has settings in database
        if (updateduserinfo.owner) {
            // if yes, update settings
            Meteor.call('usersettings.update', usersetting, updateduserinfo.id);
        } else {
            // if no, add settings
            Meteor.call('usersettings.insert', usersetting);
        }
    };

    $: budgetSum = 0;
    const calculateBaseBudgets = () => {
        let totalBudgets = Budgets.find({}).fetch();
        let budgets = [];
        totalBudgets.forEach((budget) => {
            budgets = [...budgets, budget.amount];
        });
        budgetSum = Number(
            budgets.reduce(function (a, b) {
                return a + b;
            }, 0)
        ).toFixed(2);
        baseBudgetSumStore.set(budgetSum);
    };

    onMount(() => {
        Meteor.subscribe('usersettings');
        Meteor.subscribe('budgets', function () {
            calculateBaseBudgets();
        });
    });
</script>

<div class="container">
    <Heading>Settings</Heading>

    <!-- List of base budgets -->
    <BudgetList on:recalculateBudgets={calculateBaseBudgets} />
    <h3>Total Budgeted Monthly: {$baseBudgetSumStore}</h3>

    <!-- User settings -->
    <form class="user-settings" on:submit|preventDefault={updateUserSettings}>
        <h3>User Settings:</h3>
        <!-- <input
            type="text"
            placeholder={updateduserinfo.firstName}
            bind:value={usersetting.firstName} />
        <input
            type="text"
            placeholder={updateduserinfo.lastName}
            bind:value={usersetting.lastName} />
        <label for="base-currency">Base Currency:</label>
        <select id="base-currency" bind:value={usersetting.baseCurrency}>
            <CurrenciesList />
        </select> -->
        <div class="select-currencies">
            <label for="currency-options">Update Available Currency Options:</label>
            <select
                id="currency-options"
                bind:value={usersetting.currencyOptions}
                >
                <CurrenciesList />
            </select>
            <button on:click|preventDefault={updateUserSettings} class='ui button'>
                Update User Settings
            </button>
            {#each $usersettings.map(parseUserInfo) as userinfo}
            <div />
        {/each}
        </div>
       
        
        <div class="settings-info">
        <!-- <div>First Name: {updateduserinfo.firstName}</div>
        <div>Last Name: {updateduserinfo.lastName}</div> -->
        <div>Base Currency: {updateduserinfo.baseCurrency}</div>
        <div>Currency Options: {updateduserinfo.currencyOptions}</div>
        </div>
        
    </form>
</div>

<div class="logout">
    <BlazeTemplate template="loginButtons" />
</div>

<style>
    .container {
        margin-bottom: 60px;
    }
    h3 {
        font-size: 16px;
        color: black;
        font-weight: 500;
        margin: 10px 0;
        text-align: center;
    }

    .user-settings {
        width: 100%;
        background-color: white;
    }

    .user-settings h3 {
        font-size: 20px;
    }

    .select-currencies {
        margin: 15px 20px 15px 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .select-currencies select {
        width: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2);
        justify-self: center;
    }

    /* button {
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
        margin-top: 15px;
    } */

    .settings-info {
        text-align: center;
        margin-bottom: 15px;
    }
</style>
