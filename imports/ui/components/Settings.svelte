<script>
    import { Meteor } from 'meteor/meteor';
    import { afterUpdate, onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { UserSettings } from '../../api/usersettings';
    import { Budgets } from '../../api/budgets';
    import { baseBudgetSumStore } from '../stores/BaseBudgetSumStore';
    import CurrenciesList from '../shared/CurrenciesList.svelte';
    import BudgetList from './BudgetList.svelte';
    import Heading from '../shared/Heading.svelte';
    import jq from 'jquery';
    import CurrenciesListDivs from '../shared/CurrenciesListDivs.svelte';
    import RecurringExpensesList from './RecurringExpensesList.svelte';
    import RecurringIncomeList from './RecurringIncomeList.svelte';
    import DeleteAccountPopUp from './DeleteAccountPopUp.svelte';
    import { userSettingsStore } from '../stores/UserSettingsStore';

    $: userSettings = {};

    $: updatedCurrencyOptions = {
        currencyOptions: '',
    };

    const getUserSettings = () => {
        if ($userSettingsStore[0] === undefined) {
            return;
        } else {
            userSettings = {
                baseCurrency: $userSettingsStore[0].baseCurrency,
                currencyOptions: $userSettingsStore[0].currencyOptions,
                owner: $userSettingsStore[0].owner,
                id: $userSettingsStore[0]._id,
            };
        }
    };

    const updateUserSettings = () => {
        // check if user already has settings in database
        if (userSettings.owner) {
            // if yes, update settings
            Meteor.call(
                'usersettings.update',
                updatedCurrencyOptions,
                userSettings.id
            );
        } else {
            // if no, add settings
            Meteor.call('usersettings.insert', updatedCurrencyOptions);
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

    const logout = () => {
        Meteor.logout();
    };

    let deletePopUp = false;
    const deleteAccount = () => {
        deletePopUp = !deletePopUp;
    };

    onMount(() => {
        Meteor.subscribe('usersettings');
        Meteor.subscribe('budgets', function () {
            calculateBaseBudgets();
        });
        jq('.ui.dropdown').dropdown();
    });

    afterUpdate(() => {
        getUserSettings();
        jq('.ui.dropdown').dropdown();
    });
</script>

<div class="container">
    <!-- {#each $usersettings.map(parseUserInfo) as userinfo}
        <div />
    {/each} -->

    <Heading>Settings</Heading>

    <!-- Lists -->
    <BudgetList on:recalculateBudgets={calculateBaseBudgets} />

    <RecurringExpensesList />

    <div class="spacer" />

    <RecurringIncomeList />

    <div class="spacer" />

    <!-- User settings -->
    <form class="user-settings" on:submit|preventDefault={updateUserSettings}>
        <h3>User Settings:</h3>
        <label for="currency-options">Update Available Currency Options:</label>
        <div class="ui search selection dropdown multiple currencies-select">
                <select
                        id="multi-select" multiple name='currencies' class='ui selection multiple dropdown'
                        bind:value={updatedCurrencyOptions.currencyOptions}
                        >
                        <CurrenciesList />
                    </select>

                <input name="currencies" type="hidden" />
                <i class="dropdown icon" />
                <div class="default text">Currencies</div>
                <div class="menu">
                    <CurrenciesListDivs />
                </div>
        </div>
        <button on:click|preventDefault={updateUserSettings}>
            Update User Settings
        </button>

        <div class="settings-info">
            {#if userSettings.baseCurrency === undefined || userSettings.currencyOptions === undefined}
                <div>Base Currency: Base Currency not yet set.</div>
                <div>Currency Options: Currency Options not yet set.</div>
            {:else}
                <div>Base Currency: {userSettings.baseCurrency}</div>
                <div>Currency Options: {userSettings.currencyOptions}</div>
            {/if}
        </div>
    </form>
    <div class="logout"><button on:click={logout}>Logout</button></div>

    <div class="delete-account">
        <h5>Danger Zone!</h5>
        <button class="delete" on:click={deleteAccount}>Delete Account</button>
    </div>
</div>

{#if deletePopUp === true}
    <div class="deleteTab">
        <DeleteAccountPopUp on:collapse={deleteAccount} />
        <!-- <DeleteAccoPopUp on:collapse={toggleDelete} on:delete={deleteExpense} /> -->
    </div>
{/if}

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

    .currencies-select {
        margin-top: 10px;
        overflow-x: visible;
    }

    button {
        width: 60%;
        justify-self: center;
        height: 35px;
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

    .logout {
        text-align: center;
        margin: 0 auto;
    }

    .delete-account {
        text-align: center;
        margin: 0 auto;
    }

    .delete-account h5 {
        margin-top: 20px;
    }

    .delete {
        background: red;
        margin-top: 5px;
    }
</style>
