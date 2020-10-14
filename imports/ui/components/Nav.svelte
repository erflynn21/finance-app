<script>
    import { afterUpdate, onMount } from 'svelte';
    import Overview from './Overview.svelte';
    import MonthlyBudget from './MonthlyBudget.svelte';
    import Settings from './Settings.svelte';
    import Transactions from './Transactions.svelte';
    import { UserSettings } from '../../api/usersettings';
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { userCurrencySymbol } from '../stores/UserCurrencySymbolStore';
    import { Expenses } from '../../api/expenses';
    import { Incomes } from '../../api/incomes';
    import { MonthlyBudgets } from '../../api/monthlybudgets';
    import { Budgets } from '../../api/budgets';
    import { expenseSumStore } from '../stores/ExpenseSumStore';
    import { incomeSumStore } from '../stores/IncomeSumStore';
    import { baseBudgetSumStore } from '../stores/BaseBudgetSumStore';
    import { budgetSumStore } from '../stores/BudgetSumStore';
    import {
        startDate,
        endDate,
        selectedMonth,
        selectedYear,
    } from '../stores/CurrentDateStore';
    import AddButton from './AddButton.svelte';
    import SetBaseCurrency from './SetBaseCurrency.svelte';
    import Loading from '../shared/Loading.svelte';

    let loading = false;

    // setting budget month
    const date = new Date();
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const currentMonth = months[$selectedMonth - 1];

    let current = 'overview';

    $: baseCurrencySet = true;

    let fadedButton = false;

    const fadeButton = () => {
        fadedButton = !fadedButton;
    };
</script>

{#if loading === true}
    <div class="content">
        <Loading />
    </div>
{:else if baseCurrencySet === false}
    <SetBaseCurrency />
{:else}
    <div class="content">
        {#if current === 'overview'}
            <!-- <Overview
                on:recalculate={calculateExpenses}
                on:recalculate={calculateMonthlyBudgets}
                on:recalculate={calculateIncomes}
                on:fade={fadeButton} /> -->
            <Overview on:fade={fadeButton} />
        {:else if current === 'budget'}
            <MonthlyBudget />
        {:else if current === 'transactions'}
            <Transactions />
        {:else if current === 'settings'}
            <Settings />
        {/if}
    </div>
{/if}

{#if baseCurrencySet === true}
    <footer>
        <div class:faded={fadedButton === true}>
            <AddButton />
            <!-- <AddButton on:recalculateExpenses={calculateExpenses} /> -->
        </div>
        <div class="bottom-nav-container">
            <div class="tab-nav-container">
                <button>
                    <div
                        class="tab {current === 'overview' ? 'active' : ''}"
                        on:click={() => (current = 'overview')}>
                        <i class="chart pie icon" />
                        <!-- <img src="/img/overview.svg" alt="" /> -->
                    </div>
                </button>

                <button>
                <div
                    class="tab {current === 'budget' ? 'active' : ''}"
                    on:click={() => (current = 'budget')}>
                    <i class="calculator icon"></i>
                    <!-- <img src="/img/budget.svg" alt="" /> -->
                </div>
            </button>
                <button>
                    <div
                        class="tab {current === 'transactions' ? 'active' : ''}"
                        on:click={() => (current = 'transactions')}>
                        <i class="dollar sign icon" />
                        <!-- <img src="/img/wallet.svg" alt="" /> -->
                    </div>
                </button>
                <button>
                <div
                    class="tab {current === 'settings' ? 'active' : ''}"
                    on:click={() => (current = 'settings')}>
                    <i class="cog icon" />
                    <!-- <img src="/img/settings.svg" alt="" /> -->
                </div>
            </button>
            </div>
        </div>
    </footer>
{/if}

<style>
    .content {
        min-height: calc(100vh - 51px);
        max-height: calc(100vh - 51px);
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
        padding: 10px 40px;
        position: sticky;
        border-top: 1px solid #e4e0e0;
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

    .tab i {
        font-size: 26px;
        color: rgb(128, 128, 128);
    }

    .active i {
        color: green;
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

    .faded {
        visibility: hidden;
    }
</style>
