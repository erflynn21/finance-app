<script>
    import { onMount } from 'svelte';
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
    import { startDate, endDate } from '../stores/CurrentDateStore';
    import AddButton from './AddButton.svelte';

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
    const currentMonth = months[date.getMonth()];

    let current = 'overview';

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
        Meteor.subscribe('expenses', function () {
            calculateExpenses();
        });
        Meteor.subscribe('incomes', function () {
            calculateIncomes();
        });
        Meteor.subscribe('monthlybudgets', function () {
            calculateMonthlyBudgets();
        });
        Meteor.subscribe('budgets', function () {
            calculateBudgets();
        });
    });

    // getting summary of total amounts for expenses, income and budgets
    $: expenseSum = 0;
    const calculateExpenses = () => {
        let totalExpenses = Expenses.find({
            date: { $gte: $startDate, $lte: $endDate },
        }).fetch();
        let expenses = [];
        totalExpenses.forEach((expense) => {
            expenses = [...expenses, expense.amount];
        });
        expenseSum = expenses.reduce(function (a, b) {
            return a + b;
        }, 0);
        expenseSumStore.set(expenseSum);
    };

    $: incomeSum = 0;
    const calculateIncomes = () => {
        let totalIncomes = Incomes.find({
            date: { $gte: $startDate, $lte: $endDate },
        }).fetch();
        let incomes = [];
        totalIncomes.forEach((expense) => {
            incomes = [...incomes, expense.amount];
        });
        incomeSum = incomes.reduce(function (a, b) {
            return a + b;
        }, 0);
        incomeSumStore.set(incomeSum);
    };

    $: baseBudgetSum = 0;
    const calculateBudgets = () => {
        let totalBudgets = Budgets.find({}).fetch();
        let budgets = [];
        totalBudgets.forEach((budget) => {
            budgets = [...budgets, budget.amount];
        });
        baseBudgetSum = Number(
            budgets.reduce(function (a, b) {
                return a + b;
            }, 0)
        ).toFixed(2);
        baseBudgetSumStore.set(baseBudgetSum);
    };

    $: monthlyBudgetSum = 0;
    const calculateMonthlyBudgets = () => {
        let totalBudgets = MonthlyBudgets.find({ month: currentMonth }).fetch();
        let budgets = [];
        totalBudgets.forEach((budget) => {
            budgets = [...budgets, budget.amount];
        });
        monthlyBudgetSum = Number(
            budgets.reduce(function (a, b) {
                return a + b;
            }, 0)
        ).toFixed(2);
        budgetSumStore.set(monthlyBudgetSum);
    };
</script>

<div class="content">
    {#if current === 'overview'}
        <Overview />
    {:else if current === 'budget'}
        <MonthlyBudget />
    {:else if current === 'transactions'}
        <Transactions />
    {:else if current === 'settings'}
        <Settings on:recalculateBudgets={calculateBudgets} />
    {/if}
</div>

<footer>
    <AddButton on:recalculateExpenses={calculateExpenses} />
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
