<script>
    import { Meteor } from 'meteor/meteor';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import {
        startDate,
        endDate,
        selectedMonth,
        selectedYear,
    } from '../stores/CurrentDateStore';
    import { Expenses } from '../../api/expenses';
    import { Incomes } from '../../api/incomes';
    import { Budgets } from '../../api/budgets';
    import { MonthlyBudgets } from '../../api/monthlybudgets';
    import { MonthlyExpenses } from '../../api/monthlyexpenses';
    import { MonthlyIncomes } from '../../api/monthlyincomes';
    import { afterUpdate, onMount } from 'svelte';
    import { expensesStore } from '../stores/ExpensesStore';
    import { incomesStore } from '../stores/IncomesStore';
    import { baseBudgetsStore } from '../stores/BaseBudgetsStore';
    import { baseBudgetSumStore } from '../stores/BaseBudgetSumStore';
    import { monthlyBudgetsStore } from '../stores/MonthlyBudgetsStore';
    import { monthlyExpensesStore } from '../stores/MonthlyExpensesStore';
    import { monthlyIncomesStore } from '../stores/MonthlyIncomesStore';
    import { userSettingsStore } from '../stores/UserSettingsStore';
    import { budgetSumStore } from '../stores/BudgetSumStore';
    import { userCurrency } from '../stores/UserCurrencyStore';
    import { userCurrencySymbol } from '../stores/UserCurrencySymbolStore';
    import { UserSettings } from '../../api/usersettings';
    import { expenseSumStore } from '../stores/ExpenseSumStore';
    import { incomeSumStore } from '../stores/IncomeSumStore';

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

    $: expenses = useTracker(() =>
        Expenses.find(
            {
                date: { $gte: $startDate, $lte: $endDate },
            },
            { sort: { date: -1 } }
        ).fetch()
    );

    $: incomes = useTracker(() =>
        Incomes.find(
            { date: { $gte: $startDate, $lte: $endDate } },
            { sort: { date: -1 } }
        ).fetch()
    );

    $: budgets = useTracker(() => Budgets.find({}).fetch());

    $: monthlyBudgets = useTracker(() =>
        MonthlyBudgets.find({
            month: months[$selectedMonth - 1],
            year: $selectedYear,
        }).fetch()
    );

    $: userSettings = useTracker(() => UserSettings.findOne({}));

    $: monthlyExpenses = useTracker(() => MonthlyExpenses.find({}).fetch());

    $: monthlyIncomes = useTracker(() => MonthlyIncomes.find({}).fetch());

    $: userSettings = useTracker(() => UserSettings.find({}).fetch());

    $: expensesSum = 0;

    $: incomesSum = 0;

    $: baseBudgetsSum = 0;

    $: monthlyBudgetsSum = 0;

    const setStores = () => {
        // setting stores from db arrays
        expensesStore.set($expenses);
        incomesStore.set($incomes);
        baseBudgetsStore.set($budgets);
        monthlyBudgetsStore.set($monthlyBudgets);
        monthlyExpensesStore.set($monthlyExpenses);
        monthlyIncomesStore.set($monthlyIncomes);
        userSettingsStore.set($userSettings);

        // computing and setting expenses sum
        totalExpenses = [];
        $expenses.forEach((expense) => {
            totalExpenses = [...totalExpenses, expense.amount];
        });
        expensesSum = totalExpenses.reduce(function (a, b) {
            return a + b;
        }, 0);
        expenseSumStore.set(expensesSum);

        // computing and setting incomes sum
        totalIncomes = [];
        $incomes.forEach((income) => {
            totalIncomes = [...totalIncomes, income.amount];
        });
        incomesSum = totalIncomes.reduce(function (a, b) {
            return a + b;
        }, 0);
        incomeSumStore.set(incomesSum);

        // computing and setting base budgets sum
        totalBaseBudgets = [];
        $budgets.forEach((budget) => {
            totalBaseBudgets = [...totalBaseBudgets, budget.amount];
        });
        baseBudgetsSum = totalBaseBudgets.reduce(function (a, b) {
            return a + b;
        }, 0);
        baseBudgetSumStore.set(baseBudgetsSum);

        // computing and setting monthly budgets sum
        totalMonthlyBudgets = [];
        $monthlyBudgets.forEach((monthlyBudget) => {
            totalMonthlyBudgets = [
                ...totalMonthlyBudgets,
                monthlyBudget.amount,
            ];
        });
        monthlyBudgetsSum = totalMonthlyBudgets.reduce(function (a, b) {
            return a + b;
        }, 0);
        budgetSumStore.set(monthlyBudgetsSum);

        // setting base currency
        if (userSettings === []) {
            userCurrency.set(undefined);
        } else {
            $userSettings.forEach((userSetting) => {
                userCurrency.set(userSetting.baseCurrency[0]);
                userCurrencySymbol.set(currencyDict[$userCurrency]);
            });
        }
    };

    onMount(() => {
        Meteor.subscribe('incomes');
        Meteor.subscribe('expenses');
        Meteor.subscribe('budgets');
        Meteor.subscribe('monthlybudgets');
        Meteor.subscribe('usersettings');
    });

    afterUpdate(() => {
        setStores();
    });
</script>
