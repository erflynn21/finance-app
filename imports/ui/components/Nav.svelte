<script>
    import { onMount } from 'svelte';
    import Overview from './Overview.svelte';
    import MonthlyBudget from './MonthlyBudget.svelte';
    import Settings from './Settings.svelte';
    import Transactions from './Transactions.svelte';
    import { UserSettings } from '../../api/usersettings';
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { userCurrencySymbol } from '../stores/UserCurrencySymbolStore';

    let current = 'transactions';

    const currencyDict = {
        EUR: '€',
        CNY: '¥',
        USD: '$',
        JPY: '¥',
        BGN: 'лв',
        CZK: 'Kč',
        DKK: 'kr',
        GBP: '£',
        HUF: 'Ft',
        PLN: 'zł',
        RON: 'lei',
        SEK: 'kr',
        CHF: 'CHF',
        ISK: 'kr',
        NOK: 'kr',
        HRK: 'kn',
        RUB: '₽',
        TRY: '₺',
        AUD: '$',
        BRL: 'R$',
        CAD: '$',
        HKD: '$',
        IDR: 'Rp',
        ILS: '₪',
        INR: '₹',
        KRW: '₩',
        MXN: '$',
        MYR: 'RM',
        NZD: '$',
        PHP: '₱',
        SGD: '$',
        THB: '฿',
        ZAR: 'R',
    };

    const setUserCurrency = () => {
        usersetting = UserSettings.findOne({});
        if (usersetting === undefined) {
            return;
        } else {
            userCurrency.set(usersetting.baseCurrency);
        }
    };

    const setUserCurrencySymbol = () => {
        userCurrencySymbol.set(currencyDict[$userCurrency]);
    };

    onMount(() => {
        Meteor.subscribe('usersettings', function () {
            setUserCurrency();
            setUserCurrencySymbol();
        });
    });
</script>

<div class="content">
    {#if current === 'overview'}
        <Overview />
    {:else if current === 'budget'}
        <MonthlyBudget />
    {:else if current === 'transactions'}
        <Transactions />
    {:else if current === 'settings'}
        <Settings />
    {/if}
</div>

<footer>
    <div class="bottom-nav-container">
        <div class="tab-nav-container">
            <button>
                <div
                    class="tab {current === 'overview' ? 'active' : ''}"
                    on:click={() => (current = 'overview')}>
                    <img src="/img/overview.svg" alt="" />
                </div>
            </button>

            <button>
                <div
                    class="tab {current === 'budget' ? 'active' : ''}"
                    on:click={() => (current = 'budget')}>
                    <img src="/img/budget.svg" alt="" />
                </div>
            </button>
            <button>
                <div
                    class="tab {current === 'transactions' ? 'active' : ''}"
                    on:click={() => (current = 'transactions')}>
                    <img src="/img/wallet.svg" alt="" />
                </div>
            </button>
            <button>
                <div
                    class="tab {current === 'settings' ? 'active' : ''}"
                    on:click={() => (current = 'settings')}>
                    <img src="/img/settings.svg" alt="" />
                </div>
            </button>
        </div>
    </div>
</footer>

<style>
    footer {
        box-shadow: 0px -2px 2px -2px gray;
    }
    .content {
        min-height: calc(100vh - 50px);
        max-height: calc(100vh - 50px);
        background-color: #eeeeeee7;
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
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .tab img {
        height: 30px;
    }

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
