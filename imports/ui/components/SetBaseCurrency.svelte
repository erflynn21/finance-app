<script>
    import CurrenciesList from '../shared/CurrenciesList.svelte';
    import CurrenciesListDivs from '../shared/CurrenciesListDivs.svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { UserSettings } from '../../api/usersettings';
    import jq from 'jquery';
    import { afterUpdate, onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

    let usersetting = {
        baseCurrency: '',
        currencyOptions: '',
    };

    $: usersettings = useTracker(() => UserSettings.findOne({}));

    const updateUserSettings = () => {
        if ($usersettings !== undefined) {
            // if yes, update settings
            Meteor.call('usersettings.update', usersetting, $usersettings._id);
            dispatch('currencySet');
        } else {
            // if no, add settings and dispatch
            Meteor.call('usersettings.insert', usersetting);
        }
    };

    onMount(() => {
        jq('.ui.dropdown').dropdown();
    });

    afterUpdate(() => {
        jq('.ui.dropdown').dropdown();
    });
</script>

{#if $usersettings === undefined}
    <div class="content">
        <div class="form">
            <label for="currency-options">Before you start fiddling with your
                budget we have to set the currency that your budget will be in.
                This is the currency that all other currencies will converted to
                and be displayed in within your budget. This base currency can
                only be set once, so choose carefully.
            </label>
            <div class="ui selection dropdown  base-currency-dropdown">
                <select
                    id="select"
                    name="base-currency"
                    multiple
                    class="ui selection dropdown "
                    bind:value={usersetting.baseCurrency}>
                    <CurrenciesList />
                </select>
                <input name="currencies" type="hidden" />
                <i class="dropdown icon" />
                <div class="default text">Base Currency</div>
                <div class="menu">
                    <CurrenciesListDivs />
                </div>
            </div>
            <button on:click|preventDefault={updateUserSettings}>
                Choose Budget Currency
            </button>
        </div>
    </div>
{:else}
    <div class="content">
        <div class="form">
            <label for="currency-options">Next let's select some currencies
                you'd like to have available to convert to. These will be
                available to convert from the currency that you just selected to
                have your budget in. You can select as many or as few as you'd
                like, and can also change the available currencies later in the
                settings panel.</label>
            <div
                class="ui search selection dropdown multiple currencies-select">
                <select
                    id="multi-select"
                    multiple
                    name="currencies"
                    class="ui selection multiple dropdown"
                    bind:value={usersetting.currencyOptions}>
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
        </div>
    </div>
{/if}

<style>
    .content {
        min-height: 100vh;
        max-height: 100vh;
        background-color: #eeeeeee7;
        text-align: center;
    }

    .form {
        margin: 50% auto;
        width: 80%;
        overflow-x: visible;
    }

    .form div {
        margin-top: 10px;
        overflow-x: visible;
    }

    button {
        width: 60%;
        height: 35px;
        border-radius: 10px;
        cursor: pointer;
        border: 0;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.2);
        color: white;
        margin: 10px;
        background: green;
    }
</style>
