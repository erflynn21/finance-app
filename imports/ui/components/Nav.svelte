<script>
    import { onMount } from 'svelte';
    import { BlazeTemplate } from 'meteor/svelte:blaze-integration';
    import Overview from './Overview.svelte';
    import MonthlyBudget from './MonthlyBudget.svelte';
    import Settings from './Settings.svelte';
    import Summary from './Summary.svelte';
    import { UserSettings } from '../../api/usersettings';
    import { userCurrency } from '../stores/UserCurrencyStore';

    let current = 'budget';

    const setUserCurrency = () => {
        usersetting = UserSettings.findOne({});
        if (usersetting === undefined) {
            return;
        } else {
            userCurrency.set(usersetting.baseCurrency);
        }
    };

    onMount(() => {
        Meteor.subscribe('usersettings', function () {
            setUserCurrency();
        });
    });
</script>

<div>
    <BlazeTemplate template="loginButtons" />
</div>

<div class="content">
    {#if current === 'overview'}
        <Overview />
    {:else if current === 'budget'}
        <MonthlyBudget />
    {:else if current === 'summary'}
        <Summary />
    {:else if current === 'settings'}
        <Settings />
    {/if}
</div>

<div class="bottom-nav-container">
    <div class="tab-nav-container">
        <button>
            <div
                class="tab {current === 'overview' ? 'active' : ''}"
                on:click={() => (current = 'overview')}>
                <img src="/img/overview.svg" alt="" />
                <!-- <p>Overview</p> -->
            </div>
        </button>
        <button>
            <div
                class="tab {current === 'budget' ? 'active' : ''}"
                on:click={() => (current = 'budget')}>
                <img src="/img/budget.svg" alt="" />
                <!-- <p>Budget</p> -->
            </div>
        </button>
        <button>
            <div
                class="tab {current === 'summary' ? 'active' : ''}"
                on:click={() => (current = 'summary')}>
                <img src="/img/wallet.svg" alt="" />
                <!-- <p>Summary</p> -->
            </div>
        </button>
        <button>
            <div
                class="tab {current === 'settings' ? 'active' : ''}"
                on:click={() => (current = 'settings')}>
                <img src="/img/settings.svg" alt="" />
                <!-- <p>Settings</p> -->
            </div>
        </button>
    </div>
</div>

<style>
    .content {
        min-height: calc(100vh - 20px);
    }
    .bottom-nav-container {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        margin: 0;
        bottom: 0;
        padding: 10px 20px;
        position: sticky;
    }

    .tab-nav-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .tab {
        background-color: #ffffff;
        border-radius: 50px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .tab img {
        height: 30px;
    }

    /* .tab p {
        font-weight: bold;
        overflow: hidden;
        max-width: 0;
    }

    .tab.active p {
        margin-left: 10px;
        max-width: 200px;
        transition: max-width 0.4s linear;
    } */
    button,
    button:active,
    button:visited,
    button:enabled,
    button:focus {
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
        outline: 0;
        min-width: 0px;
    }
</style>
