<script>
    import { onMount } from 'svelte';
    import { useTracker } from 'meteor/rdb:svelte-meteor-data';
    import { Budgets } from '../../api/budgets';
    import MonthlyBudgetCategory from './MonthlyBudgetCategory.svelte';
    import { expenseSumStore } from '../stores/ExpenseSumStore';
    import { Expenses } from '../../api/expenses';

    // getting budget and expense info
    $: baseBudgets = useTracker(() => Budgets.find({}).fetch());

    $: expenseSum = 0;
    const calculateExpenses = () => {
        let totalExpenses = Expenses.find({}).fetch();
        let expenses = [];
        totalExpenses.forEach((expense) => {
            expenses = [...expenses, expense.amount];
        });
        expenseSum = expenses.reduce(function (a, b) {
            return a + b;
        }, 0);
        expenseSumStore.set(expenseSum);
    };

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

    onMount(() => {
        Meteor.subscribe('expenses', function () {
            calculateExpenses();
        });
        Meteor.subscribe('budgets');
    });
</script>

<div class="monthly-overview">
    <div class="heading">
        <h1>Budget</h1>
    </div>

    <div class="add-button">
        <button>+</button>
    </div>

    <div class="budget-summary">
        <h1>{month} {year}</h1>
        <h3>Total Expenses: {$expenseSumStore}</h3>
    </div>

    <div class="budget-list">
        {#each $baseBudgets as budget (budget._id)}
            <MonthlyBudgetCategory
                {budget}
                {month}
                {year}
                on:calculate={calculateExpenses} />
        {/each}
    </div>

</div>

<style>
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

    .heading {
        width: 100%;
        display: flex;
        box-shadow: 0 2px 2px -2px gray;
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        padding-bottom: 5px;
        padding-right: 15px;
    }

    .heading h1 {
        font-size: 20px;
        font-weight: 500;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .add-button {
        position: absolute;
        height: 38px;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
    }

    .add-button button {
        font-size: 20px;
        font-weight: 300;
    }

    .budget-summary {
        display: inline-block;
        padding: 10px 0 10px 15px;
    }

    .budget-summary h1 {
        font-size: 20px;
    }

    .budget-summary h3 {
        font-size: 16px;
        font-weight: 500;
    }
</style>
