<script>
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import MonthlyBudgetCategory from './MonthlyBudgetCategory.svelte';
    import { expenseSumStore } from '../stores/ExpenseSumStore';
    import { budgetSumStore } from '../stores/BudgetSumStore';
    import { userCurrencySymbol } from '../stores/UserCurrencySymbolStore';
    import { Expenses } from '../../api/expenses';
    import Heading from '../shared/Heading.svelte';
    import { MonthlyBudgets } from '../../api/monthlybudgets';
    import { tweened } from 'svelte/motion';
    import ListItem from '../shared/ListItem.svelte';
    import { startDate, endDate } from '../stores/CurrentDateStore';

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
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // getting budget and expense info
    $: budgets = useTracker(() => Budgets.find({}).fetch());

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

    $: budgetSum = 0;
    const calculateTotalBudgets = () => {
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
        budgetSumStore.set(budgetSum);
    };

    onMount(() => {
        Meteor.subscribe('expenses', function () {
            calculateExpenses();
        });
        Meteor.subscribe('budgets');
        Meteor.subscribe('monthlybudgets', function () {
            calculateTotalBudgets();
        });
    });

    // percentage and tweened values
    $: percentage = Math.floor((100 / $budgetSumStore) * $expenseSumStore) || 0;
    const tweenedPercentage = tweened(0);
    $: tweenedPercentage.set(percentage);
</script>

<div class="monthly-overview">
    <Heading>Budget</Heading>

    <div class="budget-summary">
        <ListItem>
            <div class="grid row-one">
                <div class="budget">
                    <h4>{month} {year}</h4>
                </div>
                <div class="amount-summary">
                    {$userCurrencySymbol}{$expenseSumStore}
                    of
                    {$userCurrencySymbol}{$budgetSumStore}
                </div>
            </div>
            <div class="grid row-two">
                <div class="percentage">
                    <div class="percent" style="width: {$tweenedPercentage}%" />
                    <span>{percentage}%</span>
                </div>
            </div>
        </ListItem>
    </div>

    <div class="budget-list">
        {#each $budgets as budget (budget._id)}
            <MonthlyBudgetCategory
                {budget}
                {month}
                {year}
                on:calculate={calculateExpenses} />
        {/each}
    </div>
</div>

<style>
    .monthly-overview {
        margin-bottom: 60px;
    }
    .budget-summary {
        margin-bottom: 10px;
    }

    .grid {
        display: grid;
        margin: 5px 0;
        width: calc(100vw - 30px);
    }

    .row-one {
        grid-template-columns: 0.75fr 1fr;
        margin-bottom: 5px;
    }

    .amount-summary {
        justify-self: end;
    }

    .row-two {
        grid-template-columns: 1fr 0.1fr;
        width: 100%;
        height: 25px;
    }

    .percentage {
        grid-column: 1/2;
        width: 100%;
        position: relative;
        background-color: lightgray;
        box-sizing: border-box;
        border-radius: 5px;
        display: flex;
        align-items: center;
    }

    span {
        position: absolute;
        color: white;
        padding-left: 5px;
        font-size: 14px;
    }

    .percent {
        height: 100%;
        position: absolute;
        box-sizing: border-box;
        background-color: green;
        border-radius: 5px;
    }
</style>
