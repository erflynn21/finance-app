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
    import Heading from '../shared/Heading.svelte';
    import jq from 'jquery';
    import CurrenciesListDivs from '../shared/CurrenciesListDivs.svelte';
    import RecurringExpensesList from './RecurringExpensesList.svelte';
    import RecurringIncomeList from './RecurringIncomeList.svelte';

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
        jq('.ui.dropdown').dropdown();
    });
</script>

<div class="container">
    {#each $usersettings.map(parseUserInfo) as userinfo}
        <div />
    {/each}

    <Heading>Settings</Heading>

    <!-- List of base budgets -->
    <BudgetList on:recalculateBudgets={calculateBaseBudgets} />

    <RecurringExpensesList />

    <div class="spacer" />

    <RecurringIncomeList />

    <div class="spacer" />

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
            bind:value={usersetting.lastName} /> -->
        {#if updateduserinfo.baseCurrency === undefined}
            <label for="currency-options">Set Base Currency (Your Base Currency can only be set once, choose carefully.):</label>
            <div class="ui search selection dropdown multiple base-currency-dropdown">
                <select
                    id="search-select" name='base-currency' multiple class='ui selection dropdown multiple'
                    bind:value={usersetting.baseCurrency}
                    >
                    <CurrenciesList />
                </select>
                <input name="currencies" type='hidden'>
                <i class='dropdown icon'></i>
                <div class="default text">Base Currency</div>
                <div class="menu">
                    <CurrenciesListDivs />
                </div>    
            </div>
        {/if}
        <label for="currency-options">Update Available Currency Options:</label>
        <div class="ui search selection dropdown multiple currencies-select">
            <select
                id="multi-select" multiple name='currencies' class='ui selection multiple dropdown'
                bind:value={usersetting.currencyOptions}
                >
                <CurrenciesList />
            </select>
            <input name="currencies" type='hidden'>
            <i class='dropdown icon'></i>
            <div class="default text">Currencies</div>
            <div class="menu">
                <CurrenciesListDivs />
            </div>  
        </div> 
        <button on:click|preventDefault={updateUserSettings}>
            Update User Settings
        </button>
       
        
        <div class="settings-info">
        <!-- <div>First Name: {updateduserinfo.firstName}</div>
        <div>Last Name: {updateduserinfo.lastName}</div> -->
        {#if updateduserinfo.baseCurrency === undefined || updateduserinfo.currencyOptions === undefined}
            <div>Base Currency: Base Currency not yet set.</div>
            <div>Currency Options: Currency Options not yet set.</div>
        {:else}
            <div>Base Currency: {updateduserinfo.baseCurrency}</div>
            <div>Currency Options: {updateduserinfo.currencyOptions}</div>
        {/if}
        </div>
        
    </form>
</div>

<div class="logout">
    <BlazeTemplate template="loginButtons" />
</div>

<style>
    .container {
        margin-bottom: 60px;
        overflow-x: visible;
    }
    h3 {
        font-size: 16px;
        color: black;
        font-weight: 500;
        margin: 15px 0;
        text-align: center;
    }

    .user-settings {
        width: 100%;
        background-color: white;
        overflow-x: visible;
        text-align: center;
        padding-top: 2px;
    }

    .user-settings h3 {
        font-size: 20px;
    }

    .base-currency-dropdown {
        margin-top: 10px;
        overflow-x: visible;
    }

    .currencies-select {
        margin-top: 10px;
        overflow-x: visible;
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
        margin-top: 15px;
        margin-bottom: 10px;
    }

    .settings-info {
        text-align: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
    }

    .spacer {
        height: 15px;
    }
</style>
