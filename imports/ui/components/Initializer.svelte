<script>
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
    import { afterUpdate } from 'svelte';
    import { expensesStore } from '../stores/ExpensesStore';
    import { incomesStore } from '../stores/IncomesStore';
    import { baseBudgetsStore } from '../stores/BaseBudgetsStore';
    import { monthlyBudgetsStore } from '../stores/MonthlyBudgetsStore';
    import { monthlyExpensesStore } from '../stores/MonthlyExpensesStore';
    import { monthlyIncomesStore } from '../stores/MonthlyIncomesStore';
    import { userSettingsStore } from '../stores/UserSettingsStore';
    import { UserSettings } from '../../api/usersettings';

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
            {
                date: { $gte: $startDate, $lte: $endDate },
            },
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

    $: monthlyExpenses = useTracker(() => MonthlyExpenses.find({}).fetch());

    $: monthlyIncomes = useTracker(() => MonthlyIncomes.find({}).fetch());

    $: userSettings = useTracker(() => UserSettings.find({}).fetch());

    const setStores = () => {
        expensesStore.set($expenses);
        incomesStore.set($incomes);
        baseBudgetsStore.set($budgets);
        monthlyBudgetsStore.set($monthlyBudgets);
        monthlyExpensesStore.set($monthlyExpenses);
        monthlyIncomesStore.set($monthlyIncomes);
        userSettingsStore.set($userSettings);
    };

    afterUpdate(() => {
        setStores();
    });
</script>
